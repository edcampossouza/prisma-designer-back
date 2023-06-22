/*
  Warnings:

  - A unique constraint covering the columns `[modelId,name]` on the table `DataField` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DataField_modelId_name_key" ON "DataField"("modelId", "name");
