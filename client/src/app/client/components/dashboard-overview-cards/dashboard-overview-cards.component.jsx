"use client";

import StatCard from "../StatCard/statCard.component";

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function DashboardOverviewCards({ dashboardData }) {
  const activeCount = dashboardData?.activeBookings?.length || 0;
  const scheduledCount = dashboardData?.scheduledBookings?.length || 0;
  const pickupsTodayCount = dashboardData?.pickupsToday?.length || 0;
  const quoteCount = dashboardData?.quotesNeedingFollowUp?.length || 0;
  const unpaidBookings = dashboardData?.unpaidBookings || [];

  const balanceDue = unpaidBookings.reduce(
    (sum, booking) => sum + Number(booking.total || 0),
    0,
  );

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          A quick look at your rentals, payments, and upcoming service.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Current Rentals" value={activeCount} />

        <StatCard label="Upcoming Deliveries" value={scheduledCount} />

        <StatCard label="Pickups Today" value={pickupsTodayCount} />

        <StatCard label="Open Quotes" value={quoteCount} />

        <StatCard label="Balance Due" value={formatMoney(balanceDue)} />
      </div>
    </section>
  );
}
