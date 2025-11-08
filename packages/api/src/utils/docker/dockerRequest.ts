import { request } from 'node:http';
import { Client } from 'ssh2';

type Options = {
    method: 'POST' | 'GET' | 'HEAD' | 'DELETE';
    headers: Record<string, string>;
};

export const dockerRequest = (
    ssh: Client,
    path: string,
    opts: Options = {
        method: 'GET',
        headers: {},
    }
) => {
    console.log('Docker', path);
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
                    ...opts.headers,
                },
            };

            const req = request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    console.log('Response:', res.statusCode, data);
                    resolve(data);
                    stream.end();
                });
            });

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
