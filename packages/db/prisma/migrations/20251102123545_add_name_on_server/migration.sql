/*
  Warnings:

  - You are about to drop the column `sSHKeyId` on the `Server` table. All the data in the column will be lost.
  - Added the required column `SSHKeyId` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Server" DROP CONSTRAINT "Server_sSHKeyId_fkey";

-- AlterTable
ALTER TABLE "Server" DROP COLUMN "sSHKeyId",
ADD COLUMN     "SSHKeyId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_SSHKeyId_fkey" FOREIGN KEY ("SSHKeyId") REFERENCES "SSHKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
