import { describe, expect, it } from '@jest/globals';
import {
    buildRetentionString,
    DEFAULT_RETENTION_CONFIG,
    parseRetentionString,
} from './retention';

describe('Retention', () => {
    describe('buildRetentionString', () => {
        it('it should build the default retention string', async () => {
            expect(buildRetentionString(DEFAULT_RETENTION_CONFIG)).toEqual(
                '@latest:7'
            );
        });

        it('should build the retention string with custom values', async () => {
            expect(
                buildRetentionString({
                    rules: [
                        {
                            unit: 'days',
                            value: 6,
                        },
                    ],
                })
            ).toBe('@days:6');
        });

        it('should allow for multiple rules', async () => {
            expect(
                buildRetentionString({
                    rules: [
                        {
                            unit: 'days',
                            value: 6,
                        },
                        {
                            unit: 'weeks',
                            value: 1,
                        },
                    ],
                })
            ).toBe('@days:6 @weeks:1');
        });
    });

    describe('parseRetentionString', () => {
        it('should parse the default retention string', () => {
            const defaultRetentionString = buildRetentionString(
                DEFAULT_RETENTION_CONFIG
            );
            expect(parseRetentionString(defaultRetentionString)).toEqual(
                DEFAULT_RETENTION_CONFIG
            );
        });

        it('should parse the retention string with custom values', () => {
            expect(parseRetentionString('@days:6')).toEqual({
                rules: [
                    {
                        unit: 'days',
                        value: 6,
                    },
                ],
            });
        });

        it('should parse the retention string with multiple rules', () => {
            expect(parseRetentionString('@days:6 @weeks:1')).toEqual({
                rules: [
                    {
                        unit: 'days',
                        value: 6,
                    },
                    {
                        unit: 'weeks',
                        value: 1,
                    },
                ],
            });
        });

        it('should parse the retention string with multiple spaces', () => {
            expect(parseRetentionString('   @days:6    @weeks:1   ')).toEqual({
                rules: [
                    {
                        unit: 'days',
                        value: 6,
                    },
                    {
                        unit: 'weeks',
                        value: 1,
                    },
                ],
            });
        });

        it('should ignore invalid rules', () => {
            expect(parseRetentionString('@days:6 @weeks:1 @invalid:1')).toEqual(
                {
                    rules: [
                        {
                            unit: 'days',
                            value: 6,
                        },
                        {
                            unit: 'weeks',
                            value: 1,
                        },
                    ],
                }
            );
        });

        it('should ignore empty values for unit', () => {
            expect(parseRetentionString('@latest')).toEqual({
                rules: [],
            });
        });
    });
});
