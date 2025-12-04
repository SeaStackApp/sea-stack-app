export type DiscordWebhookPayload = {
    content?: string; // plain text message
    username?: string; // override webhook name
    avatar_url?: string; // override webhook avatar
    embeds?: DiscordEmbed[]; // list of embeds
    attachments?: DiscordAttachment[]; // optional file refs
};

export type DiscordEmbed = {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string; // ISO8601
    color?: number; // integer color
    footer?: {
        text: string;
        icon_url?: string;
    };
    image?: {
        url: string;
    };
    thumbnail?: {
        url: string;
    };
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
    };
    fields?: Array<{
        name: string;
        value: string;
        inline?: boolean;
    }>;
};

export type DiscordAttachment = {
    id: number;
    filename: string;
    description?: string;
    content_type?: string;
};

export const sendDiscordNotification = (
    webhook: string,
    payload: DiscordWebhookPayload
) => {
    return fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
};
