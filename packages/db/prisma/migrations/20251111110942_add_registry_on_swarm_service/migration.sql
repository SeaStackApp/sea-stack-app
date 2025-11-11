-- AlterTable
ALTER TABLE "SwarmService" ADD COLUMN     "registryId" TEXT;

-- AddForeignKey
ALTER TABLE "SwarmService" ADD CONSTRAINT "SwarmService_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Registry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
