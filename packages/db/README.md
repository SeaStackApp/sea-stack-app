# @repo/db

Shared Prisma database package.

- Uses Prisma Client with `engineType = "dataproxy"` (Prisma Accelerate/Data Proxy), which runs a JS/WASM query engine and avoids native Rust binaries.
- Exposes a singleton `prisma` client for use across server code.
- Includes a basic `User` model; adjust per your domain.

## Setup

1. Set environment variables. For Prisma Accelerate, set `DATABASE_URL` to the Accelerate URL, and optionally `DIRECT_URL` to your direct connection string (used for migrations):

```
# DATABASE_URL should be your Prisma Accelerate connection string
DATABASE_URL="https://accelerate.prisma-data.net/?api_key=..."
# DIRECT_URL is optional and used locally for migrations/db push
DIRECT_URL="postgresql://user:pass@localhost:5432/yourdb?schema=public"
```

2. Install and generate the client:

```
pnpm install
pnpm -F @repo/db generate
```

3. Run migrations or push schema:

```
# For iterative local dev
pnpm -F @repo/db db:push

# For migration workflow
pnpm -F @repo/db migrate:dev
pnpm -F @repo/db migrate:deploy
```

## Usage

From other packages (e.g., `@repo/api`):

```ts
import { prisma } from '@repo/db';

const users = await prisma.user.findMany();
```

## Notes

- Data Proxy/Accelerate does not support some features available with the native engine (e.g., certain preview features). Consult Prisma docs when enabling features.
- If you prefer the native engine instead, change `engineType` in `prisma/schema.prisma` to the default (remove `engineType`) and ensure your deployment environment supports Prisma's native binaries.
