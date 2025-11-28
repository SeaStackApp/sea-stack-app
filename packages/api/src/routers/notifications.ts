import { protectedProcedure, router } from '../trpc';
import {
    discordNotificationProviderSchema,
    notificationProviderIdSchema,
} from '@repo/schemas';
import { TRPCError } from '@trpc/server';
import { getProviders, sendDiscordNotification } from '@repo/utils';

export const notificationsRouter = router({
    listProviders: protectedProcedure.query(
        ({ ctx: { prisma, organizationId } }) => {
            return getProviders(prisma, organizationId);
        }
    ),
    createDiscordProvider: protectedProcedure
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
