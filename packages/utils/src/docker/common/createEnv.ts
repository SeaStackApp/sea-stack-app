import * as dotenvx from '@dotenvx/dotenvx';
export const createEnv = (env: Record<string, string>) => {
    return {
        Env: Object.entries(env).map(([key, value]) => `${key}=${value}`),
    };
};

export const createEnvFromString = (envString: string) =>
    createEnv(
        dotenvx.parse(envString, {
            processEnv: {},
        })
    );
