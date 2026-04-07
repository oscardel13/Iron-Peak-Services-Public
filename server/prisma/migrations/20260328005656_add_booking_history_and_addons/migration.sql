/*
  Warnings:

  - The values [ACTIVE] on the enum `DumpsterStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `rentalDays` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingNumber]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingNumber` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NoteVisibility" AS ENUM ('INTERNAL', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "BookingActorType" AS ENUM ('ADMIN', 'CUSTOMER_LINK', 'SYSTEM');

-- AlterEnum
BEGIN;
CREATE TYPE "DumpsterStatus_new" AS ENUM ('AVAILABLE', 'RESERVED', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE');
ALTER TABLE "public"."Dumpster" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Dumpster" ALTER COLUMN "status" TYPE "DumpsterStatus_new" USING ("status"::text::"DumpsterStatus_new");
ALTER TYPE "DumpsterStatus" RENAME TO "DumpsterStatus_old";
ALTER TYPE "DumpsterStatus_new" RENAME TO "DumpsterStatus";
DROP TYPE "public"."DumpsterStatus_old";
ALTER TABLE "Dumpster" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'AUTHORIZED';
ALTER TYPE "PaymentStatus" ADD VALUE 'PARTIALLY_REFUNDED';
ALTER TYPE "PaymentStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "rentalDays",
ADD COLUMN     "addonsTotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "bookingNumber" TEXT NOT NULL,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "customerNotes" TEXT,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "locationVerificationNote" TEXT,
ADD COLUMN     "locationVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "pickedUpAt" TIMESTAMP(3),
ADD COLUMN     "pickupDateUnknown" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productCode" TEXT,
ADD COLUMN     "quotedAt" TIMESTAMP(3),
ADD COLUMN     "rentalDaysIncluded" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ALTER COLUMN "pickupDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Dumpster" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Addon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingAddon" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "addonId" TEXT NOT NULL,
    "addonCodeSnapshot" TEXT NOT NULL,
    "addonNameSnapshot" TEXT NOT NULL,
    "addonPriceSnapshot" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingNote" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "visibility" "NoteVisibility" NOT NULL DEFAULT 'INTERNAL',
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingHistory" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "actorType" "BookingActorType" NOT NULL,
    "actorLabel" TEXT,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerAccessToken" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Addon_code_key" ON "Addon"("code");

-- CreateIndex
CREATE INDEX "BookingAddon_bookingId_idx" ON "BookingAddon"("bookingId");

-- CreateIndex
CREATE INDEX "BookingAddon_addonId_idx" ON "BookingAddon"("addonId");

-- CreateIndex
CREATE INDEX "BookingNote_bookingId_idx" ON "BookingNote"("bookingId");

-- CreateIndex
CREATE INDEX "BookingNote_visibility_idx" ON "BookingNote"("visibility");

-- CreateIndex
CREATE INDEX "BookingHistory_bookingId_idx" ON "BookingHistory"("bookingId");

-- CreateIndex
CREATE INDEX "BookingHistory_eventType_idx" ON "BookingHistory"("eventType");

-- CreateIndex
CREATE INDEX "BookingHistory_createdAt_idx" ON "BookingHistory"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAccessToken_tokenHash_key" ON "CustomerAccessToken"("tokenHash");

-- CreateIndex
CREATE INDEX "CustomerAccessToken_bookingId_idx" ON "CustomerAccessToken"("bookingId");

-- CreateIndex
CREATE INDEX "CustomerAccessToken_expiresAt_idx" ON "CustomerAccessToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingNumber_key" ON "Booking"("bookingNumber");

-- CreateIndex
CREATE INDEX "Booking_customerEmail_idx" ON "Booking"("customerEmail");

-- CreateIndex
CREATE INDEX "Booking_bookingNumber_idx" ON "Booking"("bookingNumber");

-- CreateIndex
CREATE INDEX "Dumpster_isActive_idx" ON "Dumpster"("isActive");

-- AddForeignKey
ALTER TABLE "BookingAddon" ADD CONSTRAINT "BookingAddon_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddon" ADD CONSTRAINT "BookingAddon_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "Addon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingNote" ADD CONSTRAINT "BookingNote_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHistory" ADD CONSTRAINT "BookingHistory_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAccessToken" ADD CONSTRAINT "CustomerAccessToken_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
