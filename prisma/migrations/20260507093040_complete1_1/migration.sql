/*
  Warnings:

  - You are about to drop the column `amount` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Testimonial` table. All the data in the column will be lost.
  - Added the required column `type` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Testimonial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problem` to the `Testimonial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profession` to the `Testimonial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `realAmount` to the `Testimonial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usualAmount` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('GENERATED', 'CORRECTED');

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "amount",
ADD COLUMN     "billId" TEXT,
ADD COLUMN     "billedAmount" INTEGER,
ADD COLUMN     "hash" TEXT,
ADD COLUMN     "meterId" TEXT,
ADD COLUMN     "realAmount" INTEGER,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "txHash" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "meterNumber" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Testimonial" DROP COLUMN "amount",
DROP COLUMN "message",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "problem" TEXT NOT NULL,
ADD COLUMN     "profession" TEXT NOT NULL,
ADD COLUMN     "realAmount" INTEGER NOT NULL,
ADD COLUMN     "usualAmount" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "address" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compteur" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "userId" TEXT,
    "status" TEXT NOT NULL,
    "response" TEXT,

    CONSTRAINT "Compteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consommation" (
    "id" TEXT NOT NULL,
    "compteurId" TEXT NOT NULL,
    "valeurKwh" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAddress" TEXT,
    "hash" TEXT,
    "txHash" TEXT,

    CONSTRAINT "Consommation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" TEXT NOT NULL,
    "consommationId" TEXT,
    "montant" DOUBLE PRECISION NOT NULL,
    "status" "BillStatus" NOT NULL DEFAULT 'GENERATED',
    "hash" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "txHash" TEXT,
    "userId" TEXT NOT NULL,
    "qrCode" TEXT,
    "anomalyFlag" BOOLEAN NOT NULL DEFAULT false,
    "anomalyScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meterId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "parentId" TEXT,
    "totalKwh" DOUBLE PRECISION NOT NULL,
    "isCorrected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anomalie" (
    "id" TEXT NOT NULL,
    "consommationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" TEXT,
    "txHash" TEXT,
    "billId" TEXT,
    "severity" TEXT,

    CONSTRAINT "Anomalie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alerte" (
    "id" TEXT NOT NULL,
    "meterId" TEXT,
    "type" TEXT,
    "severity" TEXT,
    "userId" TEXT,
    "message" TEXT,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alerte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Compteur_numero_key" ON "Compteur"("numero");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Facture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compteur" ADD CONSTRAINT "Compteur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consommation" ADD CONSTRAINT "Consommation_compteurId_fkey" FOREIGN KEY ("compteurId") REFERENCES "Compteur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_meterId_fkey" FOREIGN KEY ("meterId") REFERENCES "Compteur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anomalie" ADD CONSTRAINT "Anomalie_consommationId_fkey" FOREIGN KEY ("consommationId") REFERENCES "Consommation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anomalie" ADD CONSTRAINT "Anomalie_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Facture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
