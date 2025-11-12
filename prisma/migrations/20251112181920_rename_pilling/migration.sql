/*
  Warnings:

  - You are about to drop the column `piling_max` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `piling_min` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `piling_max` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `piling_min` on the `Report` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[report_id]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_buyerId_fkey";

-- AlterTable
ALTER TABLE "Buyer" DROP COLUMN "piling_max",
DROP COLUMN "piling_min",
ADD COLUMN     "pilling_max" DOUBLE PRECISION,
ADD COLUMN     "pilling_min" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "piling_max",
DROP COLUMN "piling_min",
ADD COLUMN     "buyer" JSONB,
ADD COLUMN     "pilling_max" DOUBLE PRECISION,
ADD COLUMN     "pilling_min" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Report_report_id_key" ON "Report"("report_id");
