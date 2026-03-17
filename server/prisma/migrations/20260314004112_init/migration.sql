-- CreateEnum
CREATE TYPE "DumpsterStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'ACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('QUOTE', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'DEPOSIT_PAID', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('DUMPSTER_RENTAL', 'JUNK_REMOVAL', 'DEMOLITION');

-- CreateTable
CREATE TABLE "Dumpster" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "sizeLabel" TEXT NOT NULL,
    "serialNumber" TEXT,
    "color" TEXT,
    "status" "DumpsterStatus" NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dumpster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "dumpsterId" TEXT,
    "dumpsterSize" INTEGER NOT NULL,
    "dumpsterLabel" TEXT,
    "serviceType" "ServiceType" NOT NULL DEFAULT 'DUMPSTER_RENTAL',
    "projectType" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "placement" TEXT,
    "instructions" TEXT,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "pickupDate" TIMESTAMP(3) NOT NULL,
    "rentalDays" INTEGER NOT NULL,
    "bookingStatus" "BookingStatus" NOT NULL DEFAULT 'QUOTE',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "basePrice" DECIMAL(10,2) NOT NULL,
    "deliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "mileageFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "extraDaysFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "overageFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dumpster_serialNumber_key" ON "Dumpster"("serialNumber");

-- CreateIndex
CREATE INDEX "Dumpster_size_idx" ON "Dumpster"("size");

-- CreateIndex
CREATE INDEX "Dumpster_status_idx" ON "Dumpster"("status");

-- CreateIndex
CREATE INDEX "Booking_dumpsterId_idx" ON "Booking"("dumpsterId");

-- CreateIndex
CREATE INDEX "Booking_bookingStatus_idx" ON "Booking"("bookingStatus");

-- CreateIndex
CREATE INDEX "Booking_paymentStatus_idx" ON "Booking"("paymentStatus");

-- CreateIndex
CREATE INDEX "Booking_deliveryDate_idx" ON "Booking"("deliveryDate");

-- CreateIndex
CREATE INDEX "Booking_pickupDate_idx" ON "Booking"("pickupDate");

-- CreateIndex
CREATE INDEX "Booking_serviceType_idx" ON "Booking"("serviceType");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_dumpsterId_fkey" FOREIGN KEY ("dumpsterId") REFERENCES "Dumpster"("id") ON DELETE SET NULL ON UPDATE CASCADE;
