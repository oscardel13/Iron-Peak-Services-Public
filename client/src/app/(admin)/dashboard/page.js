"use client";

import { useEffect, useMemo, useState } from "react";
import { MOCK_BOOKINGS } from "@/data/mock-bookings";
import { MOCK_INVENTORY } from "@/data/inventory";

import DashboardSummaryCards from "./components/dashboard-summary-cards/dashboard-summary-cards.component";
import DashboardQuickActions from "./components/dashboard-quick-actions/dashboard-quick-actions.component";
import DashboardTodayBoard from "./components/dashboard-today-board/dashboard-today-board.component";
import DashboardAttentionSection from "./components/dashboard-attention-section/dashboard-attention-section.component";
import DashboardRecentBookings from "./components/dashboard-recent-bookings/dashboard-recent-bookings.component";

import { getAPI } from "@/utils/api";

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
      const fetchBookings = async () => {
        try{
          console.log("Fetching bookings...");
          const response = await getAPI("/bookings");
          console.log("Fetched bookings:", response.data);
          setBookings(response.data);
        }
        catch(error){
          console.error("Failed to fetch bookings:", error);
        }
      };
      const fetchInventory = async () => {
            try {
              console.log("Fetching inventory...");
              const response = await getAPI("/inventory/dumpsters");
              console.log("Fetched inventory:", response.data);
      
              const nextInventory = Array.isArray(response.data)
                ? response.data
                : response.data?.dumpsters ?? response.data?.inventory ?? [];
      
              setInventory(nextInventory);
      
              if (nextInventory.length > 0) {
                setSelectedId((prev) => prev ?? nextInventory[0].id);
                setDraft((prev) => prev ?? nextInventory[0]);
              }
            } catch (error) {
              console.error("Failed to fetch inventory:", error);
            }
          };
      fetchBookings();
      fetchInventory();
    }, []);
  
  const dashboardData = useMemo(() => {
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);

    const activeBookings = bookings.filter(
      (booking) => booking.bookingStatus === "ACTIVE"
    );

    const scheduledBookings = bookings.filter(
      (booking) => booking.bookingStatus === "SCHEDULED"
    );

    const unpaidBookings = bookings.filter(
      (booking) =>
        booking.paymentStatus === "UNPAID" ||
        booking.paymentStatus === "DEPOSIT_PAID"
    );

    const deliveriesToday = bookings.filter(
      (booking) => booking.deliveryDate === todayKey
    );

    const pickupsToday = bookings.filter(
      (booking) => booking.pickupDate === todayKey
    );

    const availableInventory = inventory.filter(
      (item) => item.status === "AVAILABLE"
    );

    const maintenanceInventory = inventory.filter(
      (item) =>
        item.status === "MAINTENANCE" || item.status === "OUT_OF_SERVICE"
    );

    const reservedInventory = inventory.filter(
      (item) => item.status === "RESERVED"
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