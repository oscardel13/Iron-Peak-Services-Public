import { INVENTORY } from "./inventory";
import { MOCK_BOOKINGS } from "./mock-bookings";

export const getDashboardStats = () => {
  const today = "2026-03-17";

  const pickupsToday = MOCK_BOOKINGS.filter(
    (b) => b.schedule.pickupDate === today && b.bookingStatus !== "cancelled",
  ).length;

  const dropoffsToday = MOCK_BOOKINGS.filter(
    (b) => b.schedule.deliveryDate === today && b.bookingStatus !== "cancelled",
  ).length;

  const activeRentals = MOCK_BOOKINGS.filter(
    (b) => b.bookingStatus === "active",
  ).length;

  const availableDumpsters = INVENTORY.filter(
    (d) => d.status === "available",
  ).length;

  return {
    pickupsToday,
    dropoffsToday,
    activeRentals,
    availableDumpsters,
  };
};