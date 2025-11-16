/*
  Warnings:

  - You are about to drop the `_NetworkToServer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `serverId` to the `Network` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_NetworkToServer" DROP CONSTRAINT "_NetworkToServer_A_fkey";

-- DropForeignKey
ALTER TABLE "_NetworkToServer" DROP CONSTRAINT "_NetworkToServer_B_fkey";

-- AlterTable
ALTER TABLE "Network" ADD COLUMN     "serverId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_NetworkToServer";

-- AddForeignKey
ALTER TABLE "Network" ADD CONSTRAINT "Network_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
