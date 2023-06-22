/*
  Warnings:

  - The values [IntType,StringType,DecimalType,BooleanType,DateTimeType] on the enum `DataType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DataType_new" AS ENUM ('Int', 'String', 'Decimal', 'Boolean', 'DateTime');
ALTER TABLE "DataField" ALTER COLUMN "type" TYPE "DataType_new" USING ("type"::text::"DataType_new");
ALTER TYPE "DataType" RENAME TO "DataType_old";
ALTER TYPE "DataType_new" RENAME TO "DataType";
DROP TYPE "DataType_old";
COMMIT;
