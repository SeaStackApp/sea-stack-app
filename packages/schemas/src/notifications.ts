import { z } from 'zod';

export const notificationProviderSchema = z.object({
    name: z
        .string()
        .describe(
            "Display name of the notification provider (e.g. 'Mail account', 'My Discord Server')"
        ),
});

export const discordNotificationProviderSchema =
    notificationProviderSchema.extend({
        webhookUrl: z.string().url().describe('Discord webhook URL'),
    });

export const notificationTypeSchema = z.enum([
    'SEASTACK_STARTED',
    'SEASTACK_UPDATE_AVAILABLE',
    'SERVICE_DEPLOYED',
    'SERVICE_DEPLOYMENT_FAILED',
]);

export const notificationProviderIdSchema = z.object({
    notificationProviderId: z.string(),
});

export const notificationSchema = notificationProviderIdSchema.extend({
    type: notificationTypeSchema,
});
