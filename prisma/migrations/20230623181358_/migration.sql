-- CreateTable
CREATE TABLE "ScreenCoordinate" (
    "id" SERIAL NOT NULL,
    "modelId" INTEGER NOT NULL,
    "x" DECIMAL(65,30) NOT NULL,
    "y" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ScreenCoordinate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScreenCoordinate_modelId_key" ON "ScreenCoordinate"("modelId");

-- AddForeignKey
ALTER TABLE "ScreenCoordinate" ADD CONSTRAINT "ScreenCoordinate_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "DataModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
