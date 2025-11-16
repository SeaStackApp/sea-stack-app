-- AlterTable
ALTER TABLE "Network" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "Volume" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mountPath" TEXT NOT NULL,
    "readOnly" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Volume_pkey" PRIMARY KEY ("id")
);
