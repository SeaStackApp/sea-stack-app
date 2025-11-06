-- CreateTable
CREATE TABLE "SwarmService" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "replicas" INTEGER,

    CONSTRAINT "SwarmService_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SwarmService" ADD CONSTRAINT "SwarmService_id_fkey" FOREIGN KEY ("id") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
