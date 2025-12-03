import { redis } from '@repo/queues';
import '@dotenvx/dotenvx/config';
import { setUpVolumeBackups } from './backups';

async function main() {
    const backupsWorker = setUpVolumeBackups();

    const shutdown = async (signal: string) => {
        console.log(`[workers] Received ${signal}, shutting down workers...`);
        await backupsWorker.close();
        await redis?.quit?.();
        process.exit(0);
    };

    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((err) => {
    console.error('[workers] Fatal error during bootstrap:', err);
    process.exit(1);
});
