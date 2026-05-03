import cron from "node-cron";
import {
  DumpsterStatus,
  BookingStatus,
} from "../generated/prisma/client.js";
import { prisma } from "../libs/prisma.ts";

async function updateDumpsterStatus() {
  console.log("Updating dumpster statuses...", new Date().toISOString());

  const now = new Date();

  try {
    const dumpsters = await prisma.dumpster.findMany({
      where: {
        isActive: true,
        status: {
          notIn: [
            DumpsterStatus.MAINTENANCE,
            DumpsterStatus.OUT_OF_SERVICE,
          ],
        },
      },
      include: {
        bookings: {
          where: {
            bookingStatus: {
              in: [BookingStatus.SCHEDULED, BookingStatus.ACTIVE],
            },
          },
        },
      },
    });

    for (const dumpster of dumpsters) {
      const hasActiveBooking = dumpster.bookings.some((booking) => {
        const deliveryDate = new Date(booking.deliveryDate);
        const pickupDate = booking.pickupDate
          ? new Date(booking.pickupDate)
          : null;

        // deliveryDate <= now AND pickupDate >= now
        if (pickupDate) {
          return deliveryDate <= now && pickupDate >= now;
        }

        // unknown pickup = in use after delivery starts
        return booking.pickupDateUnknown && deliveryDate <= now;
      });

      const newStatus = hasActiveBooking
        ? DumpsterStatus.IN_USE
        : DumpsterStatus.AVAILABLE;

      if (dumpster.status !== newStatus) {
        await prisma.dumpster.update({
          where: { id: dumpster.id },
          data: { status: newStatus },
        });

        console.log(
          `Updated ${dumpster.label}: ${dumpster.status} -> ${newStatus}`
        );
      }
    }

    console.log("Dumpster status update complete.");
  } catch (error) {
    console.error("Failed to update dumpster statuses:", error);
  }
}

export function startDumpsterStatusCronJob() {

// 🔥 Run immediately on server start
  updateDumpsterStatus();

  // Run every day at 6:00 AM
  cron.schedule("0 6 * * *", updateDumpsterStatus, {
    timezone: "America/Denver",
  });

  // Run every day at 7:00 AM as backup
  cron.schedule("0 7 * * *", updateDumpsterStatus, {
    timezone: "America/Denver",
  });

  console.log("Dumpster status cron jobs scheduled for 6 AM and 7 AM.");
}