/*
  Warnings:

  - You are about to drop the `_NetworkToServer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_NetworkToServer" DROP CONSTRAINT "_NetworkToServer_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_NetworkToServer" DROP CONSTRAINT "_NetworkToServer_B_fkey";

-- DropTable
DROP TABLE "public"."_NetworkToServer";

-- CreateTable
CREATE TABLE "_NetworkToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NetworkToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_NetworkToService_B_index" ON "_NetworkToService"("B");

-- AddForeignKey
ALTER TABLE "_NetworkToService" ADD CONSTRAINT "_NetworkToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Network"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NetworkToService" ADD CONSTRAINT "_NetworkToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
