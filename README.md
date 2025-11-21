# SeaStack

SeaStack helps you manage remote servers and deploy containerized applications using Docker Swarm, all routed behind a Traefik proxy. The goal is a simple, open‑source control plane where you can register servers, run commands securely, and orchestrate app deployments on a Swarm cluster with sensible defaults.

Contributions are welcome — see the Contribution Guidelines below.

## Features (current and planned)

- Register remote Linux servers and execute administrative actions (reboot, terminal access, etc.).
- Manage application deployments targeting Docker Swarm clusters. (Planned)
- Traefik proxy integration for zero‑downtime routing via labels. (Planned)
- Web UI powered by Next.js, tRPC, Prisma, and PostgreSQL.

## Monorepo Overview

This repository is a pnpm + Turborepo workspace:

- apps/web — Next.js app (UI + API routes)
- packages/api — Shared API layer (tRPC routers/utilities)
- packages/db — Prisma schema and generated client
- packages/schemas — Shared Zod schemas
- packages/auth — Auth utilities Better Auth

## Prerequisites

- Node.js >= 24.8.0
- pnpm 9.x (repo uses "packageManager": "pnpm@9.0.0")
- Docker (for local Postgres and later for Swarm)

## Quick Start (Local Development)

1. Clone and install dependencies

```
pnpm install
```

2. Start a local PostgreSQL database via Docker Compose (runs on 5432)

```
docker compose up -d postgres
```

This uses docker-compose.yml in the repo root and persists data in the volume `postgres_data`.

3. Create environment files

- In packages/db/.env

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/public?schema=public"
```

- In apps/web/.env

```
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/public?schema=public"

# Auth
BETTER_AUTH_SECRET=dev_super_secret_change_me
BETTER_AUTH_URL=http://localhost:3000

# SSH key encryption (used to encrypt private keys before storing)
ENCRYPTION_SECRET=dev_encryption_secret_change_me
```

Tip: use distinct, strong secrets in real environments.

4. Prepare the database schema (Prisma)
   From the repo root you can run Prisma scripts through the workspace:

```
# Generate Prisma client (also runs on postinstall)
pnpm -w --filter @repo/db generate

# Push current schema to the dev database
pnpm -w --filter @repo/db db:push

# Alternatively, use migrations during dev
pnpm -w --filter @repo/db migrate:dev
```

5. Run the app in dev mode

```
# Turborepo will run package dev scripts
pnpm dev
```

The web UI should be available at http://localhost:3000.

## Common Scripts

- Root
    - `pnpm dev` — run all dev servers as configured by Turbo (Next.js on port 3000).
    - `pnpm build` — build all packages/apps.
    - `pnpm lint` — run ESLint via Turbo.
    - `pnpm check-types` — run TypeScript checks across the workspace.
    - `pnpm format` — Prettier format.
- Database (from root via filter or inside packages/db)
    - `pnpm -w --filter @repo/db studio` — Prisma Studio.
    - `pnpm -w --filter @repo/db migrate:dev` — create/apply migrations in dev.
    - `pnpm -w --filter @repo/db migrate:deploy` — apply migrations in prod/CI.

## Docker Images

Pre-built Docker images are automatically published to GitHub Container Registry on version changes:

- **Image**: `ghcr.io/seastackapp/seastack`
- **Base**: Alpine Linux (node:24-alpine) for minimal size and security
- **Tags**: `latest` and versioned tags (e.g., `1.0.0`)
- **Architectures**: Multi-arch support for `linux/amd64` and `linux/arm64`
  - Works on x86_64 servers (Intel/AMD)
  - Works on ARM servers and Mac M1/M2/M3

To run the pre-built image:

```bash
docker pull ghcr.io/seastackapp/seastack:latest
```

Images are built automatically via GitHub Actions when the version in `apps/web/package.json` changes.

## How it works (high level)

- UI: Next.js app in apps/web provides the dashboard and API routes.
- API: tRPC routers in packages/api define server operations (e.g., remote shell, server management) consumed by the web app.
- Data: Prisma models in packages/db with a Postgres database.
- SSH & Servers: SSH actions are performed server-side; private keys are encrypted using `ENCRYPTION_SECRET` before storage.
- Deployments (planned): You’ll be able to define app stacks which SeaStack deploys to a Swarm cluster with Traefik routing via labels.

## Local Testing Guidelines

Before opening a PR, please verify all of the following locally:

- Start Postgres via `docker compose up -d postgres`.
- Ensure `.env` files exist in `packages/db` and `apps/web`.
- Apply schema: `pnpm -w --filter @repo/db db:push` (or `migrate:dev`).
- Run the app with `pnpm dev` and confirm http://localhost:3000 loads.
- Exercise key flows you touched (e.g., adding/removing a server, terminal access).
- Run `pnpm lint`, `pnpm check-types`, and `pnpm format`.

## Contribution Guidelines

We welcome contributions of all kinds — features, fixes, docs, and examples.

1. Discuss first for larger changes

- Open an issue describing the problem/motivation and proposed approach.

2. Fork and create a feature branch

- Use a descriptive branch name like `feat/swarm-app-deployments` or `fix/server-ssh-timeout`.

3. Keep changes focused

- Smaller, targeted PRs are easier to review and merge.

4. Code style and checks

- Use the existing lint and format configuration: `pnpm lint`, `pnpm format`.
- Type-check with `pnpm check-types`.
- Follow existing patterns for file structure, naming, and imports.

5. Tests and manual validation

- Ensure the app runs locally and the scenarios you changed work as expected.
- If you add new behavior, include any relevant validation notes in the PR.

6. Commit messages

- Prefer conventional commits style when possible: `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`.

7. Opening a PR

- Fill the PR description with context, screenshots (if UI), and steps to reproduce/verify.
- Confirm you ran local checks:
    - [ ] App runs locally (`pnpm dev`).
    - [ ] Database prepared (Prisma push/migrate).
    - [ ] Lint, type checks, and formatting pass.

## Security

- Never commit secrets. Use `.env` files locally.
- The `ENCRYPTION_SECRET` is used for encrypting SSH keys at rest. Use strong values in non‑dev environments.

## Roadmap

- Server registration and lifecycle operations — iterative improvements.
- Define and deploy app stacks to Swarm.
- Traefik integration with automated routing.
