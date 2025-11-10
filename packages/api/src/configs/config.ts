import * as os from 'node:os';

export const MAIN_DIRECTORY = '/etc/seastack';
export const LOGS_DIRECTORY =
    process.env.NODE_ENV === 'production'
        ? MAIN_DIRECTORY + '/logs'
        : os.tmpdir() + '/seastack/logs';
export const TRAEFIK_VERSION = 'v3.2';
export const TRAEFIK_NETWORK = 'seastack-traefik-public';
export const TRAEFIK_SERVICE_NAME = 'seastack-traefik';
export const TRAEFIK_DIRECTORY = MAIN_DIRECTORY + '/traefik';
export const TREAFIK_DYNAMIC_PATH = TRAEFIK_DIRECTORY + '/dynamic';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
