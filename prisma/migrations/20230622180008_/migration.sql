/*
  Warnings:

  - The values [idAttribute,defaultAttribute,uniqueAttribute,relationAttribute] on the enum `DataFieldAttribute` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DataFieldAttribute_new" AS ENUM ('id', 'default', 'unique', 'updatedAt');
ALTER TYPE "DataFieldAttribute" RENAME TO "DataFieldAttribute_old";
ALTER TYPE "DataFieldAttribute_new" RENAME TO "DataFieldAttribute";
DROP TYPE "DataFieldAttribute_old";
COMMIT;

-- AlterTable
ALTER TABLE "DataField" ADD COLUMN     "default" TEXT;
