import { z } from 'zod';

export const notificationProviderSchema = z
    .object({
        name: z
            .string()
            .describe(
                "Display name of the notification provider (e.g. 'Mail account', 'My Discord Server')"
            ),
    })
    .describe('Base schema for notification provider');

export const discordNotificationProviderSchema = notificationProviderSchema
    .extend({
        webhookUrl: z.string().url().describe('Discord webhook URL'),
    })
    .describe('Schema for creating a Discord notification provider');

export const notificationTypeSchema = z
    .enum([
        'SEASTACK_STARTED',
        'SEASTACK_UPDATE_AVAILABLE',
        'SERVICE_DEPLOYED',
        'SERVICE_DEPLOYMENT_FAILED',
    ])
    .describe('Type of notification event');

export type NotificationType = z.infer<typeof notificationTypeSchema>;

export const notificationProviderIdSchema = z
    .object({
        notificationProviderId: z
            .string()
            .describe('Unique identifier of the notification provider'),
    })
    .describe('Schema for identifying a notification provider by ID');

export const notificationSchema = notificationProviderIdSchema
    .extend({
        type: notificationTypeSchema,
    })
    .describe('Schema for a notification with provider and type');
