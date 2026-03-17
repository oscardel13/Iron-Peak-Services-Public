"use client";

import { useMemo } from "react";
import { MOCK_BOOKINGS } from "@/data/mock-bookings";
import { MOCK_INVENTORY } from "@/data/inventory";

import DashboardSummaryCards from "./components/dashboard-summary-cards/dashboard-summary-cards.component";
import DashboardQuickActions from "./components/dashboard-quick-actions/dashboard-quick-actions.component";
import DashboardTodayBoard from "./components/dashboard-today-board/dashboard-today-board.component";
import DashboardAttentionSection from "./components/dashboard-attention-section/dashboard-attention-section.component";
import DashboardRecentBookings from "./components/dashboard-recent-bookings/dashboard-recent-bookings.component";

export default function DashboardPage() {
  const dashboardData = useMemo(() => {
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);

    const activeBookings = MOCK_BOOKINGS.filter(
      (booking) => booking.bookingStatus === "active"
    );

    const scheduledBookings = MOCK_BOOKINGS.filter(
      (booking) => booking.bookingStatus === "scheduled"
    );

    const unpaidBookings = MOCK_BOOKINGS.filter(
      (booking) =>
        booking.paymentStatus === "unpaid" ||
        booking.paymentStatus === "deposit_paid"
    );

    const deliveriesToday = MOCK_BOOKINGS.filter(
      (booking) => booking.schedule.deliveryDate === todayKey
    );

    const pickupsToday = MOCK_BOOKINGS.filter(
      (booking) => booking.schedule.pickupDate === todayKey
    );

    const availableInventory = MOCK_INVENTORY.filter(
      (item) => item.status === "available"
    );

    const maintenanceInventory = MOCK_INVENTORY.filter(
      (item) =>
        item.status === "maintenance" || item.status === "out_of_service"
    );

    const reservedInventory = MOCK_INVENTORY.filter(
      (item) => item.status === "reserved"
    );

    const recentBookings = [...MOCK_BOOKINGS]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const urgentPaymentBookings = [...MOCK_BOOKINGS]
      .filter((booking) => booking.paymentStatus === "unpaid")
      .slice(0, 4);

    const quotesNeedingFollowUp = [...MOCK_BOOKINGS]
      .filter((booking) => booking.bookingStatus === "quote")
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
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Quick view of bookings, inventory, and today’s work.
        </p>
      </div>

      <DashboardSummaryCards dashboardData={dashboardData} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardTodayBoard dashboardData={dashboardData} />
        <DashboardQuickActions />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <DashboardAttentionSection dashboardData={dashboardData} />
        <DashboardRecentBookings dashboardData={dashboardData} />
      </div>
    </div>
  );
}