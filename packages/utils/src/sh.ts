type ShellValue = string | number | boolean | null | undefined;

/**
 * Quote a value for use in a shell command
 * @param s The value to quote
 * @see https://github.com/ljharb/shell-quote for the original implementation
 */
function quoteValue(s: ShellValue): string {
    if (s === undefined || s === null) return "''";
    const val = String(s);

    if (val === '') {
        return "''";
    }

    if (/["\s\\]/.test(val) && !/'/.test(val)) {
        return "'" + val.replace(/(['])/g, '\\$1') + "'";
    }

    if (/["'\s]/.test(val)) {
        return '"' + val.replace(/(["\\$`!])/g, '\\$1') + '"';
    }

    return val.replace(
        /([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g,
        '$1\\$2'
    );
}

/**
 * Quote a value for use in a shell command
 * @param strings The template strings
 * @param values The values to quote
 */
export function sh(strings: TemplateStringsArray, ...values: ShellValue[]) {
    const xs: string[] = [];

    strings.forEach((str, i) => {
        xs.push(str);
        if (i < values.length) {
            xs.push(quoteValue(values[i]));
        }
    });

    return xs.join('');
}
