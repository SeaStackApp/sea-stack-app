import { protectedProcedure } from '../../trpc';
import { serviceIdSchema } from '@repo/schemas';
import { TRPCError } from '@trpc/server';
import { decrypt } from '../../utils/crypto';

export const getServiceEnvironmentVariables = protectedProcedure
    .input(serviceIdSchema)
    .query(async ({ ctx, input }) => {
        const service = await ctx.prisma.service.findFirst({
            where: {
                id: input.serviceId,
                deploymentEnvironment: {
                    project: {
                        organizations: {
                            some: {
                                id: ctx.organizationId,
                            },
                        },
                    },
                },
            },
            select: {
                environmentVariables: true,
            },
        });

        if (!service) {
            throw new TRPCError({
                code: 'NOT_FOUND',
            });
        }

        // Decrypt environment variables if they exist
        let environmentVariables = '';
        if (service.environmentVariables) {
            try {
                environmentVariables = decrypt(service.environmentVariables);
            } catch (e) {
                console.error('Failed to decrypt environment variables', e);
                // If decryption fails, it might be unencrypted (legacy), so return as is
                environmentVariables = service.environmentVariables;
            }
        }

        return {
            environmentVariables,
        };
    });
