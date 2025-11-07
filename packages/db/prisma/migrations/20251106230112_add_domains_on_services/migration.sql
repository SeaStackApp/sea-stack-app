-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "internalPort" INTEGER NOT NULL,
    "internalContainer" TEXT,
    "https" BOOLEAN NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
