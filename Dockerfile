# Multi-stage Dockerfile for Next.js (standalone) in a pnpm + turbo monorepo
# Runtime Node requirement per repo engines: Node >= 24.8.0

# -----------------------
# 1) Base image with pnpm
# -----------------------
FROM node:24-alpine AS base
# Install dependencies needed for Node.js native modules and Prisma
RUN apk add --no-cache libc6-compat openssl
# Enable corepack (manages pnpm)
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# -----------------------
# 2) Dependencies layer
#    - install all workspace deps using lockfile
# -----------------------
FROM base AS deps

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Only copy files needed to compute dependency graph to leverage Docker cache
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
# Copy package manifests for workspaces (kept minimal for caching)
COPY apps/web/package.json ./apps/web/package.json
COPY packages ./packages

# Install dependencies (workspace-aware)
# Using frozen-lockfile to ensure reproducible builds
RUN pnpm install --frozen-lockfile

# -----------------------
# 3) Build layer
#    - builds Next.js app with standalone output
# -----------------------
FROM deps AS build
# Ensure full source is available for build
COPY . .


ENV DATABASE_URL=postgres://postgres:password@postgres:5432/postgres
ENV BETTER_AUTH_SECRET=CeOx3AmjqVWNIlmeMLOgwtq87J49YpQX
ENV BETTER_AUTH_URL=http://localhost:3000
ENV ENCRYPTION_SECRET=CeOx3AmjqVWNIlmeMLOgwtq87J49YpQX

# Generate Prisma client (in case not covered by postinstall) before app build
# Safe to run without a live DB connection; it only reads schema
RUN pnpm --filter @repo/db... generate || pnpm --filter @repo/db generate || true

# Build only the web app (Next.js)
RUN pnpm --filter web build

# -----------------------
# 4) Runtime layer
#    - copy Next.js standalone output only
# -----------------------
FROM base AS runner
ENV NODE_ENV=production

# Create a non-root user for security (Alpine uses adduser instead of useradd)
RUN adduser -D nextjs

# Install Prisma CLI globally for runtime migrations (use npm for predictable global bin path)
RUN npm i -g prisma@6.18.0

# Ensure application can write to /etc/seastack without running as root
# - create the directory at build time
# - restrict permissions to owner/group
# - change ownership to the runtime user `nextjs`
RUN mkdir -p /etc/seastack \
    && chown -R nextjs:nextjs /etc/seastack \
    && chmod 0750 /etc/seastack

# Optionally mark as a volume for persistence when desired
VOLUME ["/etc/seastack"]

# Copy the standalone server and required assets from the build stage
# Next.js standalone places a full minimal Node.js server and node_modules into .next/standalone
COPY --from=build /app/apps/web/.next/standalone ./
# Static assets used by the server
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
# Public assets used at runtime
COPY --from=build /app/apps/web/public ./apps/web/public
# Copy prisma schema and migrations
COPY ./packages/db/prisma ./prisma

# The app listens on PORT (defaults to 3000)
ENV PORT=3000
# Path to Prisma schema (copied from packages/db/prisma)
ENV PRISMA_SCHEMA_PATH=/app/prisma/schema.prisma
EXPOSE 3000

# Switch to the app directory inside standalone output and run the server
WORKDIR /app/apps/web

# Copy and use an entrypoint that prepares /etc/seastack recursively and then
# runs migrations before starting the app as the non-root user.
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Run the entrypoint as root so it can chown/chmod bind mounts, then drop to nextjs inside the script
USER root
ENTRYPOINT ["docker-entrypoint.sh"]

# Default command; the entrypoint will run migrations and exec this as user `nextjs`
CMD ["node", "server.js"]
