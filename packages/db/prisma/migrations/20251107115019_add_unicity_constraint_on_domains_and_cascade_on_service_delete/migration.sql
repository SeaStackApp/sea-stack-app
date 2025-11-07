/*
  Warnings:

  - A unique constraint covering the columns `[domain]` on the table `Domain` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Domain" DROP CONSTRAINT "Domain_serviceId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Domain_domain_key" ON "Domain"("domain");

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
