/*
  Warnings:

  - You are about to alter the column `x` on the `ScreenCoordinate` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `y` on the `ScreenCoordinate` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "ScreenCoordinate" ALTER COLUMN "x" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "y" SET DATA TYPE DOUBLE PRECISION;
