# Multi-stage Dockerfile for the workers app in a pnpm + turbo monorepo
# Uses Alpine for the final worker image

# -----------------------
# 1) Base image with pnpm
# -----------------------
FROM node:24-alpine AS base

# Runtime dependencies commonly needed by Node native modules & Prisma
RUN apk add --no-cache libc6-compat openssl

# Enable corepack and pin pnpm (must match repo tooling)
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# -----------------------
# 2) Dependencies layer
#    - install workspace deps with caching
# -----------------------
FROM base AS deps

# Build toolchain for native modules (not in final image)
RUN apk add --no-cache python3 make g++

# Copy only files needed to resolve the dependency graph to leverage Docker cache
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy workspace manifests used by the workers app and its internal deps
COPY apps/workers/package.json ./apps/workers/package.json
COPY packages ./packages

# Install dependencies (workspace-aware) using lockfile
RUN pnpm install --frozen-lockfile

# -----------------------
# 3) Build layer
# -----------------------
FROM deps AS build

# Bring in full source to build the workers package
COPY . .

# Provide safe defaults for codegen steps that don't require a live DB
ENV DATABASE_URL=postgres://postgres:password@postgres:5432/postgres

# Generate Prisma client for @repo/db (no live DB needed)
RUN pnpm --filter @repo/db... generate || pnpm --filter @repo/db generate || true

# Build the workers app (outputs to apps/workers/dist)
RUN pnpm --filter workers build

# Produce a pruned, production-ready output for just the workers package
# This includes the package files, its dist, and a pruned node_modules
RUN pnpm deploy --filter workers --prod /out

# -----------------------
# 4) Runtime layer (Alpine)
# -----------------------
FROM node:24-alpine AS runner

ENV NODE_ENV=production

# Runtime libs needed by Prisma and other native deps
RUN apk add --no-cache libc6-compat openssl

# Non-root user for security
RUN adduser -D worker

WORKDIR /app

# Copy the pruned deployment from build stage
COPY --from=build /out/ .

USER worker

# Start the worker process
CMD ["node", "dist/index.mjs"]
