import { protectedProcedure } from '../../trpc';
import { z } from 'zod';
import { serviceIdSchema } from '@repo/schemas';
import { TRPCError } from '@trpc/server';
import { encrypt } from '../../utils/crypto';

const updateServiceEnvironmentVariablesSchema = serviceIdSchema.extend({
    environmentVariables: z.string(),
});

export const updateServiceEnvironmentVariables = protectedProcedure
    .input(updateServiceEnvironmentVariablesSchema)
    .mutation(async ({ ctx, input }) => {
        // Check if service exists in organization
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
                id: true,
            },
        });

        if (!service) {
            throw new TRPCError({
                code: 'NOT_FOUND',
            });
        }

        // Encrypt the environment variables before storing
        const encryptedEnvVars = input.environmentVariables
            ? encrypt(input.environmentVariables)
            : '';

        await ctx.prisma.service.update({
            where: {
                id: input.serviceId,
            },
            data: {
                environmentVariables: encryptedEnvVars,
            },
        });

        return {
            success: true,
        };
    });
