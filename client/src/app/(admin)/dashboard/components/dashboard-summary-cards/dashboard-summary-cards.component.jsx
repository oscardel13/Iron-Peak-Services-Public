"use client";

import StatCard from "../StatCard/statCard.component";

export default function DashboardSummaryCards({ dashboardData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <StatCard
        label="Active Rentals"
        value={dashboardData.activeBookings.length}
      />
      <StatCard
        label="Scheduled"
        value={dashboardData.scheduledBookings.length}
      />
      <StatCard
        label="Deliveries Today"
        value={dashboardData.deliveriesToday.length}
      />
      <StatCard
        label="Available Dumpsters"
        value={dashboardData.availableInventory.length}
      />
      <StatCard
        label="Payment Follow-Up"
        value={dashboardData.unpaidBookings.length}
      />
    </div>
  );
}