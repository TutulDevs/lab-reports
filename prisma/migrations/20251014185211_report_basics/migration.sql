-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('IN_PROGRESS', 'PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ReportSampleType" AS ENUM ('FABRIC', 'GARMENT', 'YARN', 'MOCKUP');

-- CreateEnum
CREATE TYPE "ReportSampleStage" AS ENUM ('A_STENTER', 'A_COMPACTING', 'A_DRAYER', 'A_TUMBLE', 'SAMPLE', 'RND', 'KNITTING', 'WASHING');

-- CreateEnum
CREATE TYPE "ReportDryProcess" AS ENUM ('LINE', 'FLAT', 'TUBLE');

-- CreateEnum
CREATE TYPE "ReportOverallResult" AS ENUM ('PENDING', 'PASS', 'FAIL');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "sample_receive_date" TIMESTAMP(3),
    "report_id" TEXT NOT NULL,
    "status" "ReportStatus" DEFAULT 'IN_PROGRESS',
    "sample_type" "ReportSampleType",
    "sample_stage" "ReportSampleStage",
    "order_number" INTEGER NOT NULL,
    "batch_number" INTEGER NOT NULL,
    "color" TEXT,
    "fabric_type" TEXT,
    "roll_number" INTEGER NOT NULL,
    "result" "ReportOverallResult" DEFAULT 'PENDING',
    "fail_portions" TEXT,
    "remarks" TEXT,
    "userId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "ds_wash_length_min" DOUBLE PRECISION NOT NULL,
    "ds_wash_length_max" DOUBLE PRECISION NOT NULL,
    "ds_wash_width_min" DOUBLE PRECISION NOT NULL,
    "ds_wash_width_max" DOUBLE PRECISION NOT NULL,
    "spirality_max" DOUBLE PRECISION,
    "cf_wash_cs" DOUBLE PRECISION,
    "cf_wash_cc" DOUBLE PRECISION,
    "cf_rub_dry" DOUBLE PRECISION,
    "cf_rub_wet" DOUBLE PRECISION,
    "cf_water_cs" DOUBLE PRECISION,
    "cf_water_cc" DOUBLE PRECISION,
    "cf_persp_cs_acd" DOUBLE PRECISION,
    "cf_persp_cc_acd" DOUBLE PRECISION,
    "cf_persp_cs_alk" DOUBLE PRECISION,
    "cf_persp_cc_alk" DOUBLE PRECISION,
    "piling_min" DOUBLE PRECISION,
    "piling_max" DOUBLE PRECISION,
    "bursting_strength_kpa" INTEGER,
    "ph_min" DECIMAL(65,30),
    "ph_max" DECIMAL(65,30),
    "cf_dye_transfer" DOUBLE PRECISION,
    "fabric_r_dia" INTEGER,
    "fabric_f_dia" INTEGER,
    "fabric_r_gsm" INTEGER,
    "fabric_f_gsm" INTEGER,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
