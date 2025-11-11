/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest/presets/js-with-ts-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
    testPathIgnorePatterns: ['<rootDir>/src/__tests__/utils/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/__tests__/**',
        '!src/**/index.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transformIgnorePatterns: ['/node_modules/(?!copy-anything|is-what)/'],
    transform: {
        '^.+\\.[tj]sx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: {
                    allowJs: true,
                    incremental: false,
                    composite: false,
                },
            },
        ],
    },
};
