// Using dotenvx's parsing capabilities to properly parse .env format
// Note: Since @dotenvx/dotenvx is CommonJS and we're in ESM context, we'll use a simple parser
// that follows the same .env format conventions

/**
 * Parse environment variables from .env format string to array format for Docker
 * This follows dotenv format conventions
 * Example input: "KEY1=value1\nKEY2=value2\n# comment\nKEY3=\"quoted value\""
 * Example output: ["KEY1=value1", "KEY2=value2", "KEY3=quoted value"]
 */
export function parseEnvVarsForDocker(envVarsString: string): string[] {
    if (!envVarsString || envVarsString.trim() === '') {
        return [];
    }

    const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    const lines = envVarsString.replace(/\r\n?/mg, '\n'); // normalize line endings
    const envVars: string[] = [];

    let match;
    while ((match = LINE.exec(lines)) !== null) {
        const key = match[1];
        let value = (match[2] || '').trim();

        if (!key) continue;

        // Clean the value (remove surrounding quotes and handle escape sequences)
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2');

        // Handle newlines in double-quoted strings
        if (match[2]?.trim().startsWith('"')) {
            value = value.replace(/\\n/g, '\n');
            value = value.replace(/\\r/g, '\r');
            value = value.replace(/\\t/g, '\t');
        }

        envVars.push(`${key}=${value}`);
    }

    return envVars;
}
