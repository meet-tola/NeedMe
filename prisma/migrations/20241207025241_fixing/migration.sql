/*
  Warnings:

  - You are about to drop the column `visits` on the `Form` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shareURL]` on the table `Form` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `Form` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appointmentDuration` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "visits",
ADD COLUMN     "appointmentDuration" INTEGER NOT NULL,
ADD COLUMN     "availability" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "businessId" INTEGER NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalAppointments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "logoURL" TEXT,
    "description" TEXT,
    "contactInfo" TEXT NOT NULL,
    "address" TEXT,
    "operatingHours" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDetails" (
    "id" SERIAL NOT NULL,
    "formId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserDetails_formId_idx" ON "UserDetails"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "Form_shareURL_key" ON "Form"("shareURL");

-- CreateIndex
CREATE UNIQUE INDEX "Form_name_userId_key" ON "Form"("name", "userId");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
