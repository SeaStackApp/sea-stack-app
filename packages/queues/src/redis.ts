import IORedis from 'ioredis';

declare global {
    // eslint-disable-next-line no-var
    var __redis: IORedis | undefined;
}

globalThis.__redis ??= new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || 'devpassword',
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: true,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

export const redis = globalThis.__redis;

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redis.on('connect', () => {
    console.log('Redis connected successfully');
});
