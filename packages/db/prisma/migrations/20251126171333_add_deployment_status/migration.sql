-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "status" "DeploymentStatus" NOT NULL DEFAULT 'PENDING';
