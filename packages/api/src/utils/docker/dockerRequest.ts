import { request, RequestOptions } from 'node:http';
import { Client } from 'ssh2';

type Options = {
    method: 'POST' | 'GET' | 'HEAD' | 'DELETE';
    headers: Record<string, string>;
    body?: string;
    json?: boolean;
};

export const dockerRequest = (
    ssh: Client,
    path: string,
    opts: Options = {
        method: 'GET',
        headers: {},
    }
) => {
    return new Promise((resolve: (value: string) => void, reject) => {
        ssh.exec('docker system dial-stdio', (err, stream) => {
            if (err) return reject(err);

            const options = {
                socketPath: undefined,
                createConnection: () => stream,
                method: opts.method,
                path,
                headers: {
                    Host: 'docker',
                    'Content-Type': 'application/json',
                    'Content-Length': opts.body?.length || 0,
                    ...opts.headers,
                },
            } satisfies RequestOptions;

            const req = request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 400) reject(data);
                    else resolve(data);
                    stream.end();
                });
            });

            if (opts.body) req.write(opts.body);

            req.on('error', (err) => console.error('Request error:', err));
            req.end();
        });
    });
};

export const jsonDockerRequest = async (
    ssh: Client,
    path: string,
    opts: Options = {
        method: 'GET',
        headers: {},
    }
) => {
    return JSON.parse(await dockerRequest(ssh, path, opts));
};
