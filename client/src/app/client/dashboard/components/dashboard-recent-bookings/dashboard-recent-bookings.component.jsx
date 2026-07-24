"use client";

import { formatCurrency, formatDate } from "@/utils/helpers";

function getStatusClasses(status) {
  const map = {
    QUOTE: "bg-slate-100 text-slate-700",
    SCHEDULED: "bg-blue-100 text-blue-700",
    ACTIVE: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    UNPAID: "bg-red-100 text-red-700",
    DEPOSIT_PAID: "bg-yellow-100 text-yellow-700",
    PAID: "bg-green-100 text-green-700",
    REFUNDED: "bg-slate-100 text-slate-700",
  };

  return map[status] || "bg-slate-100 text-slate-700";
}

export default function DashboardRecentBookings({ dashboardData }) {
  const recentBookings = dashboardData?.recentBookings || [];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Latest requests and newly created jobs.
        </p>
      </div>

      <div className="space-y-3">
        {recentBookings.length === 0 ? (
          <p className="text-sm text-gray-500">No recent bookings.</p>
        ) : (
          recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.customerName || "Unknown customer"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.bookingNumber || booking.id}
                  </p>
                </div>

                <div className="flex gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      booking.bookingStatus
                    )}`}
                  >
                    {booking.bookingStatus?.replaceAll("_", " ")}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      booking.paymentStatus
                    )}`}
                  >
                    {booking.paymentStatus?.replaceAll("_", " ")}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-gray-600">
                <p>{booking.projectType || "No project type"}</p>

                <p>
                  Delivery:{" "}
                  {booking.deliveryDate
                    ? formatDate(booking.deliveryDate)
                    : "N/A"}{" "}
                  · Pickup:{" "}
                  {booking.pickupDate
                    ? formatDate(booking.pickupDate)
                    : booking.pickupDateUnknown
                    ? "TBD"
                    : "N/A"}
                </p>

                <p>
                  Total: {formatCurrency(Number(booking.total || 0))}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}