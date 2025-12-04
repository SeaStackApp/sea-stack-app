/*
  Warnings:

  - Added the required column `volumeId` to the `VolumeBackupSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VolumeBackupSchedule" ADD COLUMN     "volumeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "VolumeBackupSchedule" ADD CONSTRAINT "VolumeBackupSchedule_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "Volume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
