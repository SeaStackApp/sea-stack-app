import { Client, ConnectConfig } from 'ssh2';

export const execRemote = (config: ConnectConfig, command: string) => {
    let stream = new ReadableStream();
    const promise = new Promise(
        (
            resolve: (data: { stdout: string; stderr: string }) => void,
            reject: (reason: Error) => void
        ) => {
            const conn = new Client();
            let stdout = '',
                stderr = '';

            console.info(command);

            conn.on('ready', () => {
                console.info('ready');
                conn.exec(command, (err, stream) => {
                    if (err) {
                        throw err;
                    }
                    stream
                        .on('close', (code: number, _signal: string) => {
                            conn.end();
                            if (code === 0) {
                                resolve({ stdout, stderr });
                            } else {
                                reject(
                                    new Error(
                                        `Command "${command}" exited with code ${code}: ${stderr}`
                                    )
                                );
                            }
                        })
                        .on('data', (data: string) => {
                            stdout += data.toString();
                        })
                        .stderr.on('data', (data) => {
                            stderr += data.toString();
                        });
                });
            });

            conn.on('error', (err) => {
                conn.end();
                reject(new Error(`${err.level}: ${err.message}`));
            });

            conn.connect(config);
        }
    );
    return { stream, promise };
};
