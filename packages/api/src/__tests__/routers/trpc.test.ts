import { describe, expect, it } from '@jest/globals';
import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '../../trpc';
import { createAuthenticatedMockContext, createMockContext } from '../utils';

describe('tRPC procedures', () => {
    describe('protectedProcedure', () => {
        it('should throw UNAUTHORIZED when user is not authenticated', async () => {
            const ctx = createMockContext();

            // Create a test procedure
            const testProcedure = protectedProcedure.query(() => {
                return { success: true };
            });

            // Try to call without authentication
            await expect(
                testProcedure({
                    ctx,
                    getRawInput: async () => undefined,
                    path: 'test',
                    type: 'query',
                    signal: undefined,
                })
            ).rejects.toThrow(TRPCError);

            await expect(
                testProcedure({
                    ctx,
                    getRawInput: async () => undefined,
                    path: 'test',
                    type: 'query',
                    signal: undefined,
                })
            ).rejects.toMatchObject({
                code: 'UNAUTHORIZED',
            });
        });

        it('should throw UNAUTHORIZED when organizationId is missing', async () => {
            const ctx = createMockContext({
                user: {
                    id: 'test-user-id',
                    name: 'Test User',
                    email: 'test@example.com',
                } as any,
            });

            // Create a test procedure
            const testProcedure = protectedProcedure.query(() => {
                return { success: true };
            });

            // Try to call without organizationId
            await expect(
                testProcedure({
                    ctx,
                    getRawInput: async () => undefined,
                    path: 'test',
                    type: 'query',
                    signal: undefined,
                })
            ).rejects.toThrow(TRPCError);

            await expect(
                testProcedure({
                    ctx,
                    getRawInput: async () => undefined,
                    path: 'test',
                    type: 'query',
                    signal: undefined,
                })
            ).rejects.toMatchObject({
                code: 'UNAUTHORIZED',
                message: 'Not organization selected in this session',
            });
        });

        it('should succeed when user and organizationId are present', async () => {
            const ctx = createAuthenticatedMockContext();

            // Create a test procedure
            const testProcedure = protectedProcedure.query(() => {
                return { success: true };
            });

            const result = await testProcedure({
                ctx,
                getRawInput: async () => undefined,
                path: 'test',
                type: 'query',
                signal: undefined,
            });

            expect(result).toEqual({ success: true });
        });
    });
});
