export const retentionUnits = [
    'latest',
    'days',
    'weeks',
    'months',
    'years',
] as const;

export type RetentionUnit = (typeof retentionUnits)[number];

export type RetentionRule = {
    unit: RetentionUnit;
    value: number;
};

export type RetentionConfig = {
    rules: RetentionRule[];
};

export const DEFAULT_RETENTION_CONFIG: RetentionConfig = {
    rules: [{ unit: 'latest', value: 7 }],
};

/**
 * Build a retention string from a RetentionConfig object
 * @param config The retention config to build from
 */
export const buildRetentionString = (config: RetentionConfig) =>
    config.rules.map(({ unit, value }) => `@${unit}:${value}`).join(' ');

/**
 * Parse a retention string into a RetentionConfig object
 * @param retentionString The retention string to parse
 */
export const parseRetentionString = (
    retentionString: string
): RetentionConfig => {
    return {
        rules: retentionString
            .split(' ')
            .filter((rule) => rule.startsWith('@'))
            .map((rule) => rule.replace('@', ''))
            .map((rule) => rule.split(':'))
            .map(([unit, value]) => ({
                unit,
                value: value ? parseInt(value) : 0,
            }))
            .filter((rule) =>
                retentionUnits.includes(rule.unit as RetentionUnit)
            )
            .filter((rule) => rule.value > 0) as RetentionRule[],
    };
};
