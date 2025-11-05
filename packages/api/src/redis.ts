import IORedis from 'ioredis';

export const redis = new IORedis({
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});
