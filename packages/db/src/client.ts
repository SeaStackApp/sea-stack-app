import { PrismaClient } from './generated/client';

// Singleton Prisma Client for server runtimes
// With Accelerate/Data Proxy the PrismaClient uses a JS/WASM engine (no native binaries)

declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma = prisma;
}

export { prisma };
