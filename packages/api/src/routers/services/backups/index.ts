import { router } from '../../../trpc';
import { createVolumeBackup } from './createVolumeBackup';
import { listBackups } from './listBackups';
import { startBackup } from './startBackup';
import { deleteVolumeBackupSchedule } from './deleteVolumeBackupSchedule';

export const backupsRouter = router({
    createVolumeBackup,
    listBackups,
    startBackup,
    deleteVolumeBackupSchedule,
});
