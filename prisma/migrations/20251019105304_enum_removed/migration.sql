/*
  Warnings:

  - The `status` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sample_type` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sample_stage` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `result` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "status",
ADD COLUMN     "status" INTEGER DEFAULT 1,
DROP COLUMN "sample_type",
ADD COLUMN     "sample_type" INTEGER,
DROP COLUMN "sample_stage",
ADD COLUMN     "sample_stage" INTEGER,
DROP COLUMN "result",
ADD COLUMN     "result" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" INTEGER NOT NULL DEFAULT 2;

-- DropEnum
DROP TYPE "public"."ReportDryProcess";

-- DropEnum
DROP TYPE "public"."ReportOverallResult";

-- DropEnum
DROP TYPE "public"."ReportSampleStage";

-- DropEnum
DROP TYPE "public"."ReportSampleType";

-- DropEnum
DROP TYPE "public"."ReportStatus";

-- DropEnum
DROP TYPE "public"."Role";
