import { describe, expect, it } from '@jest/globals';
import { healthRouter } from '../../routers/health';
import { createCaller, createMockContext } from '../utils';

describe('health router', () => {
    describe('ping', () => {
        it('should return ok status', async () => {
            const ctx = createMockContext();
            const caller = createCaller(healthRouter, ctx);

            const result = await caller.ping();

            expect(result).toHaveProperty('status', 'ok');
            expect(result).toHaveProperty('timestamp');
        });

        it('should return a valid ISO timestamp', async () => {
            const ctx = createMockContext();
            const caller = createCaller(healthRouter, ctx);

            const result = await caller.ping();

            // Check if timestamp is a valid ISO string
            const timestamp = new Date(result.timestamp);
            expect(timestamp.toISOString()).toBe(result.timestamp);
        });

        it('should return a recent timestamp', async () => {
            const ctx = createMockContext();
            const caller = createCaller(healthRouter, ctx);

            const before = Date.now();
            const result = await caller.ping();
            const after = Date.now();

            const timestamp = new Date(result.timestamp).getTime();
            expect(timestamp).toBeGreaterThanOrEqual(before);
            expect(timestamp).toBeLessThanOrEqual(after);
        });
    });
});
