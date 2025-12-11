/*
  Warnings:

  - You are about to drop the column `registryId` on the `organization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "organization" DROP CONSTRAINT "organization_registryId_fkey";

-- AlterTable
ALTER TABLE "organization" DROP COLUMN "registryId";

-- CreateTable
CREATE TABLE "_OrganizationToRegistry" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrganizationToRegistry_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrganizationToRegistry_B_index" ON "_OrganizationToRegistry"("B");

-- AddForeignKey
ALTER TABLE "_OrganizationToRegistry" ADD CONSTRAINT "_OrganizationToRegistry_A_fkey" FOREIGN KEY ("A") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToRegistry" ADD CONSTRAINT "_OrganizationToRegistry_B_fkey" FOREIGN KEY ("B") REFERENCES "Registry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
