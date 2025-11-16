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
});
