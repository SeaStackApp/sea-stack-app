// Using dotenvx's parsing capabilities to properly parse .env format
// Note: Since @dotenvx/dotenvx is CommonJS and we're in ESM context, we'll use a simple parser
// that follows the same .env format conventions

/**
 * Parse environment variables from .env format string to array format for Docker
 * Supports standard .env format conventions including comments, export syntax, quoted values, escape sequences, and variable interpolation
 * Example input: "KEY1=value1\nKEY2=value2\n# comment\nKEY3=\"quoted value\"\nKEY4=$KEY1"
 * Example output: ["KEY1=value1", "KEY2=value2", "KEY3=quoted value", "KEY4=value1"]
 */
export function parseEnvVarsForDocker(envVarsString: string): string[] {
    if (!envVarsString || envVarsString.trim() === '') {
        return [];
    }

    const LINE = /^\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?$/mg;
    const lines = envVarsString.replace(/\r\n?/mg, '\n'); // normalize line endings
    const envVars: string[] = [];
    const parsedVars: Record<string, string> = {};
    const rawValues: Array<{ key: string; value: string; isSingleQuoted: boolean }> = [];

    // First pass: parse all variables
    let match;
    while ((match = LINE.exec(lines)) !== null) {
        const key = match[1];
        let value = (match[2] || '').trim();

        if (!key) continue;

        const isSingleQuoted = match[2]?.trim().startsWith("'");

        // Clean the value (remove surrounding quotes and handle escape sequences)
        value = value.replace(/^(['"`])([\s\S]*)\1$/g, '$2');

        // Handle escape sequences in double-quoted strings
        if (match[2]?.trim().startsWith('"')) {
            value = value.replace(/\\n/g, '\n');
            value = value.replace(/\\r/g, '\r');
            value = value.replace(/\\t/g, '\t');
            value = value.replace(/\\"/g, '"');
        }

        rawValues.push({ key, value, isSingleQuoted });
        parsedVars[key] = value;
    }

    // Second pass: resolve variable interpolations (except in single-quoted values)
    for (const { key, value, isSingleQuoted } of rawValues) {
        let resolvedValue = value;

        // Skip interpolation for single-quoted strings
        if (!isSingleQuoted) {
            resolvedValue = expandVariables(value, parsedVars);
            // Update parsedVars with resolved value for subsequent references
            parsedVars[key] = resolvedValue;
        }

        envVars.push(`${key}=${resolvedValue}`);
    }

    return envVars;
}

/**
 * Expand variable references in a value
 * Supports: $VAR, ${VAR}, ${VAR:-default}, ${VAR-default}
 */
function expandVariables(value: string, vars: Record<string, string>): string {
    // Match ${VAR:-default}, ${VAR-default}, ${VAR}, or $VAR
    const regex = /\$\{([A-Za-z_][A-Za-z0-9_]*)(:-|-)([^}]*)\}|\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g;
    
    return value.replace(regex, (match, varWithDefault, operator, defaultValue, varBraces, varSimple) => {
        let varName: string;
        let useDefault = false;
        let defaultVal = '';

        if (varWithDefault) {
            // ${VAR:-default} or ${VAR-default}
            varName = varWithDefault;
            useDefault = true;
            defaultVal = defaultValue || '';
        } else if (varBraces) {
            // ${VAR}
            varName = varBraces;
        } else {
            // $VAR
            varName = varSimple;
        }

        const varValue = vars[varName];
        
        // Check if the variable value is the same as the match (self-reference)
        // This handles cases like PROTOCOL=${PROTOCOL:-http} where PROTOCOL is undefined
        const isSelfReference = varValue === match || varValue?.includes(match);

        if (varValue !== undefined && varValue !== '' && !isSelfReference) {
            return varValue;
        } else if (useDefault) {
            // Use default value if variable is undefined, empty (for :-), or self-referencing
            if (operator === ':-' || varValue === undefined || isSelfReference) {
                return defaultVal;
            }
            return varValue;
        }

        // Variable not found and no default - return empty string
        return '';
    });
}
