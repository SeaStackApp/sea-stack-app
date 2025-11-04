import { Client, ConnectConfig } from 'ssh2';

export const getInteractiveRemoteConnection = (config: ConnectConfig) => {
    return new Promise(
        (resolve: (data: Client) => void, reject: (reason: Error) => void) => {
            const conn = new Client();

            conn.on('ready', () => {
                resolve(conn);
            });

            conn.on('error', (err) => {
                conn.end();
                reject(new Error(`${err.level}: ${err.message}`));
            });

            conn.connect(config);
        }
    );
};

export const remoteExec = (
    client: Client,
    command: string,
    transform: (a: string) => string = (x) => x.trim()
) => {
    let stdout = '',
        stderr = '';

    return new Promise(
        (resolve: (data: string) => void, reject: (reason: Error) => void) => {
            client.exec(command, (err, stream) => {
                if (err) {
                    reject(err);
                    return;
                }

                stream.on('data', (data: string) => {
                    stdout += data.toString();
                });

                stream.on('close', (code: number, _signal: string) => {
                    if (code === 0) {
                        resolve(transform(stdout));
                    } else {
                        reject(
                            new Error(
                                `Command "${command}" exited with code ${code}: ${stderr}`
                            )
                        );
                    }
                });
            });
        }
    );
};
