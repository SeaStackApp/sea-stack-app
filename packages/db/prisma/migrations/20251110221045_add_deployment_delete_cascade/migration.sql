-- DropForeignKey
ALTER TABLE "public"."Deployment" DROP CONSTRAINT "Deployment_serviceId_fkey";

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
