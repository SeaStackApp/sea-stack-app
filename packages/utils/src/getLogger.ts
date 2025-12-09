import pino from 'pino';
import pretty from 'pino-pretty';
import { LOG_LEVEL } from './configs';

export const getLogger = () => {
    const logs: string[] = [];

    const prettyStream =
        process.env.NODE_ENV === 'production'
            ? null
            : pretty({
                  colorize: true,
                  translateTime: 'HH:MM:ss',
              });
    const captureStream = {
        write(msg: string) {
            logs.push(msg); // store parsed logs
        },
    };
    const streams = [
        { stream: captureStream }, // capture logs
    ];

    if (prettyStream) {
        streams.push({ stream: prettyStream }); // pretty console output
    }

    const logger = pino(
        {
            level: LOG_LEVEL,
        },
        pino.multistream(streams)
    );

    return { logs, logger };
};
