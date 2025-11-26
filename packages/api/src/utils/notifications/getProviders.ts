import { PrismaClient } from '@repo/db';

export const getProviders = (prisma: PrismaClient, organizationId: string) =>
    prisma.notificationProvider.findMany({
        where: {
            organizations: {
                some: {
                    id: organizationId,
                },
            },
        },
        include: {
            DiscordNotificationProvider: true,
            SMTPNotificationProvider: true,
            TelegramNotificationProvider: true,
        },
    });
