import { describe, expect, test } from '@jest/globals';
import { parseEnvVarsForDocker } from '../utils/envVars/parseEnvVarsForDocker';

describe('parseEnvVarsForDocker', () => {
    test('should parse simple key=value pairs', () => {
        const input = 'KEY1=value1\nKEY2=value2';
        const expected = ['KEY1=value1', 'KEY2=value2'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle empty input', () => {
        expect(parseEnvVarsForDocker('')).toEqual([]);
        expect(parseEnvVarsForDocker('   ')).toEqual([]);
    });

    test('should skip comments', () => {
        const input = 'KEY1=value1\n# This is a comment\nKEY2=value2';
        const expected = ['KEY1=value1', 'KEY2=value2'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should skip empty lines', () => {
        const input = 'KEY1=value1\n\nKEY2=value2\n\n';
        const expected = ['KEY1=value1', 'KEY2=value2'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle double-quoted values', () => {
        const input = 'KEY1="quoted value"\nKEY2="value with spaces"';
        const expected = ['KEY1=quoted value', 'KEY2=value with spaces'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle single-quoted values', () => {
        const input = "KEY1='quoted value'\nKEY2='value with spaces'";
        const expected = ['KEY1=quoted value', 'KEY2=value with spaces'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle values with special characters', () => {
        const input = 'DATABASE_URL=postgresql://user:pass@localhost:5432/db';
        const expected = ['DATABASE_URL=postgresql://user:pass@localhost:5432/db'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle export syntax', () => {
        const input = 'export KEY1=value1\nexport KEY2=value2';
        const expected = ['KEY1=value1', 'KEY2=value2'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle multiline string with newline escapes in double quotes', () => {
        const input = 'KEY1="line1\\nline2"';
        const expected = ['KEY1=line1\nline2'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle escaped double quotes in double-quoted values', () => {
        const input = 'MESSAGE="He said \\"hello\\""';
        const expected = ['MESSAGE=He said "hello"'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle complex real-world example', () => {
        const input = `# Application settings
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# API Keys
export API_KEY=abc123xyz
SECRET_KEY='my-secret-key'

# Empty values
EMPTY_VAR=`;
        const expected = [
            'NODE_ENV=production',
            'PORT=3000',
            'DATABASE_URL=postgresql://user:password@localhost:5432/mydb',
            'API_KEY=abc123xyz',
            'SECRET_KEY=my-secret-key',
            'EMPTY_VAR=',
        ];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should interpolate variables using $VAR syntax', () => {
        const input = 'BASE_URL=https://example.com\nFULL_URL=$BASE_URL/api';
        const expected = ['BASE_URL=https://example.com', 'FULL_URL=https://example.com/api'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should interpolate variables using ${VAR} syntax', () => {
        const input = 'HOST=localhost\nPORT=3000\nSERVER_URL=${HOST}:${PORT}';
        const expected = ['HOST=localhost', 'PORT=3000', 'SERVER_URL=localhost:3000'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle default values with ${VAR:-default} syntax', () => {
        const input = 'DEFINED=value\nUSE_DEFINED=${DEFINED:-default}\nUSE_DEFAULT=${UNDEFINED:-default}';
        const expected = ['DEFINED=value', 'USE_DEFINED=value', 'USE_DEFAULT=default'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle default values with ${VAR-default} syntax', () => {
        const input = 'DEFINED=value\nEMPTY=\nUSE_DEFINED=${DEFINED-default}\nUSE_EMPTY=${EMPTY-default}\nUSE_DEFAULT=${UNDEFINED-default}';
        const expected = ['DEFINED=value', 'EMPTY=', 'USE_DEFINED=value', 'USE_EMPTY=', 'USE_DEFAULT=default'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should not interpolate variables in single-quoted strings', () => {
        const input = "BASE_URL=https://example.com\nQUOTED='$BASE_URL/api'";
        const expected = ['BASE_URL=https://example.com', 'QUOTED=$BASE_URL/api'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should interpolate variables in double-quoted strings', () => {
        const input = 'BASE_URL=https://example.com\nQUOTED="$BASE_URL/api"';
        const expected = ['BASE_URL=https://example.com', 'QUOTED=https://example.com/api'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle multiple variable references in one value', () => {
        const input = 'FIRST=Hello\nSECOND=World\nCOMBINED=$FIRST $SECOND!';
        const expected = ['FIRST=Hello', 'SECOND=World', 'COMBINED=Hello World!'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle undefined variables as empty strings', () => {
        const input = 'DEFINED=value\nUSE_UNDEFINED=$UNDEFINED\nCOMBINED=$DEFINED-$UNDEFINED-end';
        const expected = ['DEFINED=value', 'USE_UNDEFINED=', 'COMBINED=value--end'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });

    test('should handle complex interpolation with defaults', () => {
        const input = 'HOST=localhost\nPROTOCOL=${PROTOCOL:-http}\nURL=${PROTOCOL}://${HOST}:${PORT:-3000}';
        const expected = ['HOST=localhost', 'PROTOCOL=http', 'URL=http://localhost:3000'];
        expect(parseEnvVarsForDocker(input)).toEqual(expected);
    });
});
