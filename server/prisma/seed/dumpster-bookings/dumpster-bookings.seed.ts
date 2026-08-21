import type { PrismaClient } from "../../../src/generated/prisma/client.js";

import { dumpsterBookingsData } from "./dumpster-bookings.data.js";

export async function seedDumpsterBookings(prisma: PrismaClient) {
  console.log("📅 Seeding dumpster bookings...");

  for (const booking of dumpsterBookingsData) {
    const { dumpsterId, totalPrice, concreteSurcharge, ...data } = booking;

    const bookingData = {
      ...data,

      total: totalPrice,

      dumpster: {
        connect: {
          id: dumpsterId,
        },
      },
    };

    await prisma.booking.upsert({
      where: {
        bookingNumber: booking.bookingNumber,
      },

      update: bookingData,
      create: bookingData,
    });
  }

  console.log(`   ✓ ${dumpsterBookingsData.length} bookings seeded`);
}
