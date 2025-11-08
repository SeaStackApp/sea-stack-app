import type { Context } from '../../context';

/**
 * Create a mock context for testing
 */
export function createMockContext(
    overrides?: Partial<Context>
): Context {
    return {
        prisma: {} as any, // Mock prisma client
        user: undefined,
        organizationId: undefined,
        ...overrides,
    };
}

/**
 * Create a mock context with authenticated user
 */
export function createAuthenticatedMockContext(
    organizationId = 'test-org-id',
    userId = 'test-user-id'
): Context {
    return createMockContext({
        user: {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
        } as any,
        organizationId,
    });
}
