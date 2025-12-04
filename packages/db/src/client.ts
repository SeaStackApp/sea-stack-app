import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Singleton Prisma Client for server runtimes
// With Accelerate/Data Proxy the PrismaClient uses a JS/WASM engine (no native binaries)

declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = globalThis.__prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma = prisma;
}

export { prisma };
