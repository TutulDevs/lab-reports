/*
  Warnings:

  - You are about to drop the column `bursting_strength_kpa` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `ds_wash_length_max` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `ds_wash_length_min` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `ds_wash_width_max` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `ds_wash_width_min` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `ph_max` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `ph_min` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `pilling_max` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `pilling_min` on the `Report` table. All the data in the column will be lost.
  - Added the required column `ds_wash_length` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ds_wash_width` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Buyer" DROP COLUMN "bursting_strength_kpa",
ADD COLUMN     "cc_dye_transfer" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "ds_wash_length_max",
DROP COLUMN "ds_wash_length_min",
DROP COLUMN "ds_wash_width_max",
DROP COLUMN "ds_wash_width_min",
DROP COLUMN "ph_max",
DROP COLUMN "ph_min",
DROP COLUMN "pilling_max",
DROP COLUMN "pilling_min",
ADD COLUMN     "cc_dye_transfer" DOUBLE PRECISION,
ADD COLUMN     "ds_wash_length" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ds_wash_width" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "gsm" INTEGER,
ADD COLUMN     "ph" DECIMAL(65,30),
ADD COLUMN     "pilling" DOUBLE PRECISION,
ALTER COLUMN "bursting_strength_kpa" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "BuyerBurstingRule" (
    "id" TEXT NOT NULL,
    "gsm" INTEGER NOT NULL,
    "bursting_strength_kpa" DOUBLE PRECISION NOT NULL,
    "buyerId" TEXT NOT NULL,

    CONSTRAINT "BuyerBurstingRule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BuyerBurstingRule" ADD CONSTRAINT "BuyerBurstingRule_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
