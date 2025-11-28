import { PrismaClient } from '@repo/db';
import { NotificationType } from '@repo/schemas';
import { getProviders } from './getProviders';
import { sendDiscordNotification } from './discord';

export type BaseNotification = {
    message?: string;
};

export type Notification = BaseNotification & {
    type: Extract<
        NotificationType,
        'SERVICE_DEPLOYED' | 'SERVICE_DEPLOYMENT_FAILED'
    >;
    serviceId: string;
};

export const titles = {
    SERVICE_DEPLOYED: 'Service deployed',
    SERVICE_DEPLOYMENT_FAILED: 'Service deployment failed',
} as const;

export const colors = {
    SERVICE_DEPLOYED: 0x00ff00,
    SERVICE_DEPLOYMENT_FAILED: 0xff0000,
} as const;

export const notify = async (
    prisma: PrismaClient,
    notification: Notification,
    organizationId: string
) => {
    const providers = await getProviders(prisma, organizationId);
    let title: string = titles[notification.type];
    let color = colors[notification.type];

    switch (notification.type) {
        case 'SERVICE_DEPLOYED':
        case 'SERVICE_DEPLOYMENT_FAILED':
            const service = await prisma.service.findUniqueOrThrow({
                where: { id: notification.serviceId },
            });
            title = `${title} (${service.name})`;
            break;
    }

    for (const provider of providers) {
        if (provider.DiscordNotificationProvider) {
            const { webhook } = provider.DiscordNotificationProvider;
            try {
                await sendDiscordNotification(webhook, {
                    username: 'SeaStack Test',
                    content: notification.message,
                    embeds: [
                        {
                            title,
                            color,
                        },
                    ],
                });
            } catch (e) {
                console.error(e);
            }
        }
    }
};
