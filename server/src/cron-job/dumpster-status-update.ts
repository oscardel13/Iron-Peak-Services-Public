import cron from "node-cron";
import {
  DumpsterStatus,
  BookingStatus,
} from "../generated/prisma/client.js";
import { prisma } from "../libs/prisma.ts";

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

async function updateBookingStatuses() {
  console.log("Updating booking statuses...", new Date().toISOString());

  const today = startOfDay(new Date());

  try {
    await prisma.booking.updateMany({
      where: {
        bookingStatus: BookingStatus.SCHEDULED,
        deliveryDate: {
          lte: today,
        },
      },
      data: {
        bookingStatus: BookingStatus.ACTIVE,
        deliveredAt: new Date(),
      },
    });

    await prisma.booking.updateMany({
      where: {
        bookingStatus: BookingStatus.ACTIVE,
        pickupDateUnknown: false,
        pickupDate: {
          lt: today,
        },
      },
      data: {
        bookingStatus: BookingStatus.COMPLETED,
        completedAt: new Date(),
        pickedUpAt: new Date(),
      },
    });

    console.log("Booking status update complete.");
  } catch (error) {
    console.error("Failed to update booking statuses:", error);
  }
}

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

async function runDailyStatusUpdates() {
  await updateBookingStatuses();
  await updateDumpsterStatus();
}

export function startStatusCronJobs() {
  runDailyStatusUpdates().catch((err) => {
    console.error("Initial daily status update failed:", err);
  });

  cron.schedule("0 6 * * *", runDailyStatusUpdates, {
    timezone: "America/Denver",
  });

  cron.schedule("0 7 * * *", runDailyStatusUpdates, {
    timezone: "America/Denver",
  });

  console.log("Status cron jobs scheduled for 6 AM and 7 AM.");
}