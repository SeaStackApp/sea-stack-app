/*
  Warnings:

  - Added the required column `url` to the `Registry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registry" ADD COLUMN     "url" TEXT NOT NULL;
