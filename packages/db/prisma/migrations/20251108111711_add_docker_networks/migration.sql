-- CreateTable
CREATE TABLE "Network" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "driver" TEXT NOT NULL DEFAULT 'overlay',
    "subnet" TEXT,
    "gateway" TEXT,
    "attachable" BOOLEAN NOT NULL DEFAULT false,
    "labels" JSONB,
    "options" JSONB,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);
