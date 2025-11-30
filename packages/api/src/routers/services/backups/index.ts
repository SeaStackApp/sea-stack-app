import { router } from '../../../trpc';
import { createVolumeBackup } from './createVolumeBackup';
import { listBackups } from './listBackups';

export const backupsRouter = router({
    createVolumeBackup,
    listBackups,
});
