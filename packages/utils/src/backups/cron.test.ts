import { describe, expect, it } from '@jest/globals';
import { cron6Regex } from '@repo/schemas';

describe('CRON regex', () => {
    it('should match a valid 6 slot cron', async () => {
        expect(cron6Regex.test('1 1 1 1 1 1')).toEqual(true);
    });

    it('should not match an invalid cron', async () => {
        expect(cron6Regex.test('1 1 1 1 1 1a')).toEqual(false);
    });

    it('should allow ranges', () => {
        expect(cron6Regex.test('0-10 1 1 1 1 1')).toEqual(true);
    });

    it('should allow step', () => {
        expect(cron6Regex.test('*/10 1 1 1 1 1')).toEqual(true);
    });

    it('should allow multiple ranges', () => {
        expect(cron6Regex.test('0-10,20-30 1 1 1 1 1')).toEqual(true);
    });
});
