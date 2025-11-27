-- DropForeignKey
ALTER TABLE "BackupRun" DROP CONSTRAINT "BackupRun_volumeBackupScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "DiscordNotificationProvider" DROP CONSTRAINT "DiscordNotificationProvider_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_notificationProviderId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "S3Storage" DROP CONSTRAINT "S3Storage_id_fkey";

-- DropForeignKey
ALTER TABLE "SMTPNotificationProvider" DROP CONSTRAINT "SMTPNotificationProvider_id_fkey";

-- DropForeignKey
ALTER TABLE "TelegramNotificationProvider" DROP CONSTRAINT "TelegramNotificationProvider_id_fkey";

-- DropForeignKey
ALTER TABLE "Volume" DROP CONSTRAINT "Volume_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "VolumeBackupSchedule" DROP CONSTRAINT "VolumeBackupSchedule_storageDestinationId_fkey";

-- AddForeignKey
ALTER TABLE "Volume" ADD CONSTRAINT "Volume_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMTPNotificationProvider" ADD CONSTRAINT "SMTPNotificationProvider_id_fkey" FOREIGN KEY ("id") REFERENCES "NotificationProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordNotificationProvider" ADD CONSTRAINT "DiscordNotificationProvider_id_fkey" FOREIGN KEY ("id") REFERENCES "NotificationProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramNotificationProvider" ADD CONSTRAINT "TelegramNotificationProvider_id_fkey" FOREIGN KEY ("id") REFERENCES "NotificationProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notificationProviderId_fkey" FOREIGN KEY ("notificationProviderId") REFERENCES "NotificationProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "S3Storage" ADD CONSTRAINT "S3Storage_id_fkey" FOREIGN KEY ("id") REFERENCES "StorageDestination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolumeBackupSchedule" ADD CONSTRAINT "VolumeBackupSchedule_storageDestinationId_fkey" FOREIGN KEY ("storageDestinationId") REFERENCES "StorageDestination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackupRun" ADD CONSTRAINT "BackupRun_volumeBackupScheduleId_fkey" FOREIGN KEY ("volumeBackupScheduleId") REFERENCES "VolumeBackupSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
