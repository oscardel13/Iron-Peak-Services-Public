"use client";

import { useEffect, useMemo, useState } from "react";

import { MOCK_BOOKINGS } from "@/data/mock-bookings";
import { MOCK_INVENTORY } from "@/data/inventory";

import BookingCalendar from "./components/booking-calendar/booking-calendar.component";
import DashboardOverviewCards from "./components/dashboard-overview-cards/dashboard-overview-cards.component";
import DashboardQuickActions from "./components/dashboard-quick-actions/dashboard-quick-actions.component";
import DashboardPaymentReceipt from "./components/dashboard-payment-receipt/dashboard-payment-receipt.component";
import DashboardUpcomingCurrent from "./components/dashboard-upcoming-current/dashboard-upcoming-current.component";

import { getAPI } from "@/utils/api";

function formatDateKey(value) {
  if (!value) return null;

  const date = new Date(value);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [inventory, setInventory] = useState(MOCK_INVENTORY);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAPI("/client/bookings");

        const nextBookings = Array.isArray(response.data)
          ? response.data
          : (response.data?.bookings ?? []);

        setBookings(nextBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    const fetchInventory = async () => {
      try {
        const response = await getAPI("/inventory/dumpsters");

        const nextInventory = Array.isArray(response.data)
          ? response.data
          : (response.data?.dumpsters ?? response.data?.inventory ?? []);

        setInventory(nextInventory);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      }
    };

    fetchBookings();
    fetchInventory();
  }, []);

  const dashboardData = useMemo(() => {
    const todayKey = formatDateKey(new Date());

    const activeBookings = bookings.filter(
      (booking) => booking.bookingStatus === "ACTIVE",
    );

    const scheduledBookings = bookings.filter(
      (booking) => booking.bookingStatus === "SCHEDULED",
    );

    const unpaidBookings = bookings.filter((booking) =>
      ["UNPAID", "PENDING", "DEPOSIT_PAID", "FAILED"].includes(
        booking.paymentStatus,
      ),
    );

    const deliveriesToday = bookings.filter(
      (booking) => formatDateKey(booking.deliveryDate) === todayKey,
    );

    const pickupsToday = bookings.filter(
      (booking) =>
        booking.pickupDate &&
        !booking.pickupDateUnknown &&
        formatDateKey(booking.pickupDate) === todayKey,
    );

    const availableInventory = inventory.filter(
      (item) => item.status === "AVAILABLE",
    );

    const maintenanceInventory = inventory.filter(
      (item) =>
        item.status === "MAINTENANCE" || item.status === "OUT_OF_SERVICE",
    );

    const reservedInventory = inventory.filter(
      (item) => item.status === "RESERVED",
    );

    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const urgentPaymentBookings = [...bookings]
      .filter((booking) => booking.paymentStatus === "UNPAID")
      .slice(0, 4);

    const quotesNeedingFollowUp = [...bookings]
      .filter((booking) => booking.bookingStatus === "QUOTE")
      .slice(0, 4);

    return {
      activeBookings,
      scheduledBookings,
      unpaidBookings,
      deliveriesToday,
      pickupsToday,
      availableInventory,
      maintenanceInventory,
      reservedInventory,
      recentBookings,
      urgentPaymentBookings,
      quotesNeedingFollowUp,
    };
  }, [bookings, inventory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
          Client Portal
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Manage your rentals, payments, receipts, and booking requests.
        </p>
      </div>

      <DashboardOverviewCards dashboardData={dashboardData} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardUpcomingCurrent bookings={bookings} />
        <DashboardQuickActions />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <DashboardPaymentReceipt bookings={bookings} />

        <BookingCalendar
          bookings={bookings}
          allowedViews={["week"]}
          defaultView="week"
          title="Schedule Preview"
          description="Your upcoming deliveries and pickups."
          compact
          showDayDetails
        />
      </div>
    </div>
  );
}
