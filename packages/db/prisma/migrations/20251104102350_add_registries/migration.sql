-- CreateEnum
CREATE TYPE "Proxy" AS ENUM ('SEASTACK_TREAFIK', 'SEASTACK_NGINX');

-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "proxy" "Proxy" NOT NULL DEFAULT 'SEASTACK_TREAFIK';

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "registryId" TEXT;

-- CreateTable
CREATE TABLE "Registry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RegistryToServer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RegistryToServer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RegistryToServer_B_index" ON "_RegistryToServer"("B");

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Registry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RegistryToServer" ADD CONSTRAINT "_RegistryToServer_A_fkey" FOREIGN KEY ("A") REFERENCES "Registry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RegistryToServer" ADD CONSTRAINT "_RegistryToServer_B_fkey" FOREIGN KEY ("B") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
