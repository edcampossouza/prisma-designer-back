-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('IntType', 'StringType', 'DecimalType', 'BooleanType', 'DateTimeType');

-- CreateEnum
CREATE TYPE "DataFieldAttribute" AS ENUM ('idAttribute', 'defaultAttribute', 'uniqueAttribute', 'relationAttribute');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSchema" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DataSchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "schemaId" INTEGER NOT NULL,

    CONSTRAINT "DataModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataField" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DataType" NOT NULL,

    CONSTRAINT "DataField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyRelation" (
    "id" SERIAL NOT NULL,
    "fieldFrom" INTEGER NOT NULL,
    "fieldTo" INTEGER NOT NULL,

    CONSTRAINT "KeyRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DataSchema_userId_name_key" ON "DataSchema"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "DataModel_schemaId_name_key" ON "DataModel"("schemaId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "KeyRelation_fieldFrom_key" ON "KeyRelation"("fieldFrom");

-- AddForeignKey
ALTER TABLE "DataSchema" ADD CONSTRAINT "DataSchema_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataModel" ADD CONSTRAINT "DataModel_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "DataSchema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyRelation" ADD CONSTRAINT "KeyRelation_fieldFrom_fkey" FOREIGN KEY ("fieldFrom") REFERENCES "DataField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyRelation" ADD CONSTRAINT "KeyRelation_fieldTo_fkey" FOREIGN KEY ("fieldTo") REFERENCES "DataField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
