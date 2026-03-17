"use client";

import { formatCurrency, formatDate } from "@/utils/helpers";

function getStatusClasses(status) {
  const map = {
    quote: "bg-slate-100 text-slate-700",
    scheduled: "bg-blue-100 text-blue-700",
    active: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    unpaid: "bg-red-100 text-red-700",
    deposit_paid: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    refunded: "bg-slate-100 text-slate-700",
  };

  return map[status] || "bg-slate-100 text-slate-700";
}

export default function DashboardRecentBookings({ dashboardData }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Latest requests and newly created jobs.
        </p>
      </div>

      <div className="space-y-3">
        {dashboardData.recentBookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-xl border border-gray-200 bg-gray-50 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900">
                  {booking.customer.name}
                </p>
                <p className="text-sm text-gray-500">{booking.id}</p>
              </div>

              <div className="flex gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                    booking.bookingStatus
                  )}`}
                >
                  {booking.bookingStatus.replaceAll("_", " ")}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                    booking.paymentStatus
                  )}`}
                >
                  {booking.paymentStatus.replaceAll("_", " ")}
                </span>
              </div>
            </div>

            <div className="mt-3 grid gap-2 text-sm text-gray-600">
              <p>{booking.service.projectType}</p>
              <p>
                Delivery: {formatDate(booking.schedule.deliveryDate)} · Pickup:{" "}
                {formatDate(booking.schedule.pickupDate)}
              </p>
              <p>Total: {formatCurrency(booking.pricing.total)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}