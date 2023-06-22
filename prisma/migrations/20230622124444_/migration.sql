/*
  Warnings:

  - Added the required column `modelId` to the `DataField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataField" ADD COLUMN     "modelId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "DataModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
