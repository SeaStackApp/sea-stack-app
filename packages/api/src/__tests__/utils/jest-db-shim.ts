// Jest shim for @repo/db to avoid loading Prisma ESM client in tests
// Provides minimal runtime exports used by API code under test.

// Export a very light mock PrismaClient type and constructor
export class PrismaClient {
    // You can add mocked methods as needed for tests
}

// Minimal Prisma namespace placeholder for types/usages like `Prisma.ModelName`
export const Prisma: any = {};

// A very naive in-memory mock of the prisma client used in a couple of utils.
// Extend this as your tests need more methods.
export const prisma: any = {
    registry: {
        findUnique: async (_args: any) => null,
    },
    service: {
        findFirst: async (_args: any) => null,
    },
};
