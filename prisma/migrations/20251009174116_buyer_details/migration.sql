/*
  Warnings:

  - Added the required column `ds_wash_length_max` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ds_wash_length_min` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ds_wash_width_max` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ds_wash_width_min` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Buyer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Buyer" ADD COLUMN     "bursting_strength_kpa" INTEGER,
ADD COLUMN     "cf_dye_transfer" DOUBLE PRECISION,
ADD COLUMN     "cf_persp_cc_acd" DOUBLE PRECISION,
ADD COLUMN     "cf_persp_cc_alk" DOUBLE PRECISION,
ADD COLUMN     "cf_persp_cs_acd" DOUBLE PRECISION,
ADD COLUMN     "cf_persp_cs_alk" DOUBLE PRECISION,
ADD COLUMN     "cf_rub_dry" DOUBLE PRECISION,
ADD COLUMN     "cf_rub_wet" DOUBLE PRECISION,
ADD COLUMN     "cf_wash_cc" DOUBLE PRECISION,
ADD COLUMN     "cf_wash_cs" DOUBLE PRECISION,
ADD COLUMN     "cf_water_cc" DOUBLE PRECISION,
ADD COLUMN     "cf_water_cs" DOUBLE PRECISION,
ADD COLUMN     "ds_wash_length_max" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ds_wash_length_min" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ds_wash_width_max" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ds_wash_width_min" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fabric_f_dia" INTEGER,
ADD COLUMN     "fabric_f_gsm" INTEGER,
ADD COLUMN     "fabric_r_dia" INTEGER,
ADD COLUMN     "fabric_r_gsm" INTEGER,
ADD COLUMN     "ph_max" DECIMAL(65,30),
ADD COLUMN     "ph_min" DECIMAL(65,30),
ADD COLUMN     "piling_max" DOUBLE PRECISION,
ADD COLUMN     "piling_min" DOUBLE PRECISION,
ADD COLUMN     "spirality_max" DOUBLE PRECISION,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Buyer" ADD CONSTRAINT "Buyer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
