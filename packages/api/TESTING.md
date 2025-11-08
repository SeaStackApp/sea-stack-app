# Testing Guide for tRPC API

This package uses Jest for testing the tRPC API endpoints.

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Test Structure

Tests are located in the `src/__tests__` directory with the following structure:

```
src/__tests__/
├── routers/          # Tests for tRPC routers
│   ├── health.test.ts
│   └── trpc.test.ts
└── utils/            # Test utilities
    ├── mockContext.ts
    ├── createCaller.ts
    └── index.ts
```

## Writing Tests

### Testing Public Procedures

```typescript
import { describe, expect, it } from '@jest/globals';
import { healthRouter } from '../../routers/health';
import { createCaller, createMockContext } from '../utils';

describe('health router', () => {
    it('should return ok status', async () => {
        const ctx = createMockContext();
        const caller = createCaller(healthRouter, ctx);

        const result = await caller.ping();

        expect(result).toHaveProperty('status', 'ok');
    });
});
```

### Testing Protected Procedures

Protected procedures require an authenticated context with a user and organizationId:

```typescript
import { describe, expect, it } from '@jest/globals';
import { projectsRouter } from '../../routers/projects';
import { createCaller, createAuthenticatedMockContext } from '../utils';

describe('projects router', () => {
    it('should list projects for authenticated user', async () => {
        const ctx = createAuthenticatedMockContext('org-id', 'user-id');
        const caller = createCaller(projectsRouter, ctx);

        // Mock Prisma responses as needed
        ctx.prisma.project.findMany = jest.fn().mockResolvedValue([]);

        const result = await caller.list();

        expect(result).toEqual([]);
    });
});
```

## Test Utilities

### `createMockContext(overrides?)`

Creates a basic mock context for testing public procedures.

```typescript
const ctx = createMockContext({
    user: { id: 'test-user', email: 'test@example.com' },
});
```

### `createAuthenticatedMockContext(organizationId?, userId?)`

Creates a mock context with an authenticated user and organization, useful for testing protected procedures.

```typescript
const ctx = createAuthenticatedMockContext('my-org-id', 'my-user-id');
```

### `createCaller(router, ctx)`

Creates a tRPC caller for testing router procedures.

```typescript
const caller = createCaller(myRouter, ctx);
const result = await caller.myProcedure({ input: 'value' });
```

## Mocking Prisma

When testing procedures that interact with the database, mock the Prisma client methods:

```typescript
ctx.prisma.project.create = jest.fn().mockResolvedValue({
    id: 'project-id',
    name: 'Test Project',
});
```

## Notes

- Tests run with `NODE_OPTIONS='--experimental-vm-modules'` to support ES modules
- The package uses `ts-jest` for TypeScript support
- Test files should be named with `.test.ts` or `.spec.ts` suffix
- Test utilities in `src/__tests__/utils` are excluded from Jest's test discovery
