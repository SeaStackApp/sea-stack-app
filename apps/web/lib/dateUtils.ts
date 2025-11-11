/**
 * Format a date to a relative time string (e.g., "in 2 days", "2 hours ago")
 * Using native JavaScript APIs
 */
export function formatDistanceToNow(date: Date): string {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffSec = Math.floor(Math.abs(diffMs) / 1000);
    
    const isPast = diffMs < 0;
    const prefix = isPast ? '' : 'in ';
    const suffix = isPast ? 'ago' : '';

    const intervals = [
        { seconds: 31536000, label: 'year' },
        { seconds: 2592000, label: 'month' },
        { seconds: 604800, label: 'week' },
        { seconds: 86400, label: 'day' },
        { seconds: 3600, label: 'hour' },
        { seconds: 60, label: 'minute' },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffSec / interval.seconds);
        if (count > 0) {
            const plural = count > 1 ? 's' : '';
            return `${prefix}${count} ${interval.label}${plural} ${suffix}`.trim();
        }
    }
    
    return 'just now';
}
