export function splitCommand(cmd: string): string[] {
    const result: string[] = [];
    let current = '';
    let quote: "'" | '"' | null = null;
    let escaped = false;

    for (let i = 0; i < cmd.length; i++) {
        const c = cmd[i];

        if (escaped) {
            current += c;
            escaped = false;
            continue;
        }

        if (c === '\\') {
            escaped = true;
            continue;
        }

        if (quote) {
            if (c === quote) {
                quote = null;
            } else {
                current += c;
            }
            continue;
        }

        if (c === "'" || c === '"') {
            quote = c;
            continue;
        }

        if (c === ' ') {
            if (current.length > 0) {
                result.push(current);
                current = '';
            }
            continue;
        }

        current += c;
    }

    if (current.length > 0) {
        result.push(current);
    }

    return result;
}
