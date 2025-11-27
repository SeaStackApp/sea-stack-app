import { protectedProcedure, router } from '../trpc';
import {
    discordNotificationProviderSchema,
    notificationProviderIdSchema,
} from '@repo/schemas';
import { TRPCError } from '@trpc/server';
import { sendDiscordNotification } from '../utils/notifications/discord';
import { getProviders } from '../utils/notifications/getProviders';
import { z } from 'zod';

export const notificationsRouter = router({
    listProviders: protectedProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/notifications.listProviders',
                tags: ['Notifications'],
                summary: 'List all notification providers',
                description:
                    'Returns a list of all notification providers configured for the organization.',
                protect: true,
            },
        })
        .input(z.void())
        .query(({ ctx: { prisma, organizationId } }) => {
            return getProviders(prisma, organizationId);
        }),

    createDiscordProvider: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/notifications.createDiscordProvider',
                tags: ['Notifications'],
                summary: 'Create a Discord notification provider',
                description:
                    'Creates a new Discord webhook notification provider.',
                protect: true,
            },
        })
        .input(discordNotificationProviderSchema)
        .mutation(({ ctx: { prisma, organizationId }, input }) => {
            return prisma.notificationProvider.create({
                data: {
                    name: input.name,
                    organizations: {
                        connect: {
                            id: organizationId,
                        },
                    },
                    DiscordNotificationProvider: {
                        create: {
                            webhook: input.webhookUrl,
                        },
                    },
                },
            });
        }),

    testProvider: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/notifications.testProvider',
                tags: ['Notifications'],
                summary: 'Test a notification provider',
                description:
                    'Sends a test notification to verify the provider is configured correctly.',
                protect: true,
            },
        })
        .input(notificationProviderIdSchema)
        .mutation(
            async ({
                ctx: { prisma, organizationId },
                input: { notificationProviderId },
            }) => {
                const provider = await prisma.notificationProvider.findUnique({
                    where: {
                        id: notificationProviderId,
                        organizations: {
                            some: {
                                id: organizationId,
                            },
                        },
                    },
                    include: {
                        DiscordNotificationProvider: true,
                    },
                });

                if (!provider)
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message:
                            'Unable to find the requested notifications provider',
                    });

                if (provider.DiscordNotificationProvider) {
                    const { webhook } = provider.DiscordNotificationProvider;
                    await sendDiscordNotification(webhook, {
                        username: 'SeaStack Test',
                        embeds: [
                            {
                                title: 'Test completed',
                                description: 'Hey ! Notifications work :-)',
                                color: 0x00ff00,
                                fields: [
                                    {
                                        name: 'Service',
                                        value: 'SeaStack',
                                        inline: true,
                                    },
                                    {
                                        name: 'Status',
                                        value: 'success',
                                        inline: true,
                                    },
                                ],
                            },
                        ],
                    });
                }
            }
        ),

    deleteProvider: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/notifications.deleteProvider',
                tags: ['Notifications'],
                summary: 'Delete a notification provider',
                description:
                    'Permanently deletes a notification provider from the organization.',
                protect: true,
            },
        })
        .input(notificationProviderIdSchema)
        .mutation(
            async ({
                ctx: { prisma, organizationId },
                input: { notificationProviderId },
            }) => {
                try {
                    return await prisma.notificationProvider.delete({
                        where: {
                            id: notificationProviderId,
                            organizations: {
                                some: {
                                    id: organizationId,
                                },
                            },
                        },
                        select: {
                            id: true,
                        },
                    });
                } catch (e) {
                    console.error(e);
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                    });
                }
            }
        ),
});
