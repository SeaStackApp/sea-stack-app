/*
  Warnings:

  - Added the required column `serviceId` to the `Volume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Volume" ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Volume" ADD CONSTRAINT "Volume_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
