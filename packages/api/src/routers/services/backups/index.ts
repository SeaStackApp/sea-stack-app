import { router } from '../../../trpc';
import { createVolumeBackup } from './createVolumeBackup';
import { listBackups } from './listBackups';
import { startBackup } from './startBackup';

export const backupsRouter = router({
    createVolumeBackup,
    listBackups,
    startBackup,
});
