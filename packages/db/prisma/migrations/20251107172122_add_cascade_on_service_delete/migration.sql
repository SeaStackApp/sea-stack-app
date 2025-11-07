-- DropForeignKey
ALTER TABLE "public"."SwarmService" DROP CONSTRAINT "SwarmService_id_fkey";

-- AddForeignKey
ALTER TABLE "SwarmService" ADD CONSTRAINT "SwarmService_id_fkey" FOREIGN KEY ("id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
