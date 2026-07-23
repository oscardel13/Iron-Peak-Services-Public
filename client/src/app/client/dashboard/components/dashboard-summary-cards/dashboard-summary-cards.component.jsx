"use client";

import StatCard from "../StatCard/statCard.component";

export default function DashboardSummaryCards({ dashboardData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <StatCard
        label="Active Rentals"
        value={dashboardData?.activeBookings?.length || 0}
      />
      <StatCard
        label="Scheduled"
        value={dashboardData?.scheduledBookings?.length || 0}
      />
      <StatCard
        label="Deliveries Today"
        value={dashboardData?.deliveriesToday?.length || 0}
      />
      <StatCard
        label="Available Dumpsters"
        value={dashboardData?.availableInventory?.length || 0}
      />
      <StatCard
        label="Payment Follow-Up"
        value={dashboardData?.unpaidBookings?.length || 0}
      />
    </div>
  );
}