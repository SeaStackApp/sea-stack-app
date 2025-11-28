-- CreateEnum
CREATE TYPE "BackupRunStatus" AS ENUM ('FAILED', 'SUCCESS', 'RUNNING');

-- CreateTable
CREATE TABLE "StorageDestination" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "StorageDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "S3Storage" (
    "id" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "region" TEXT,
    "accessKeyId" TEXT NOT NULL,
    "secretAccessKey" TEXT NOT NULL,
    "usePathStyle" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "S3Storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolumeBackupSchedule" (
    "id" TEXT NOT NULL,
    "storageDestinationId" TEXT NOT NULL,
    "cron" TEXT NOT NULL,
    "retention" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "VolumeBackupSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackupRun" (
    "id" TEXT NOT NULL,
    "status" "BackupRunStatus" NOT NULL DEFAULT 'RUNNING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artifactLocation" TEXT,
    "volumeBackupScheduleId" TEXT,

    CONSTRAINT "BackupRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrganizationToStorageDestination" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrganizationToStorageDestination_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrganizationToStorageDestination_B_index" ON "_OrganizationToStorageDestination"("B");

-- AddForeignKey
ALTER TABLE "S3Storage" ADD CONSTRAINT "S3Storage_id_fkey" FOREIGN KEY ("id") REFERENCES "StorageDestination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolumeBackupSchedule" ADD CONSTRAINT "VolumeBackupSchedule_storageDestinationId_fkey" FOREIGN KEY ("storageDestinationId") REFERENCES "StorageDestination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackupRun" ADD CONSTRAINT "BackupRun_volumeBackupScheduleId_fkey" FOREIGN KEY ("volumeBackupScheduleId") REFERENCES "VolumeBackupSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToStorageDestination" ADD CONSTRAINT "_OrganizationToStorageDestination_A_fkey" FOREIGN KEY ("A") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToStorageDestination" ADD CONSTRAINT "_OrganizationToStorageDestination_B_fkey" FOREIGN KEY ("B") REFERENCES "StorageDestination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
