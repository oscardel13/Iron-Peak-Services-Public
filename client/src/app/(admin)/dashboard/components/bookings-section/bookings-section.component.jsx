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

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black ${
        props.className || ""
      }`}
    />
  );
}

export default function BookingListSection({
  search,
  setSearch,
  filteredBookings,
  selectedId,
  handleSelectBooking,
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <Input
          placeholder="Search bookings, customer, address, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        {filteredBookings.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No bookings found.</div>
        ) : (
          filteredBookings.map((booking) => {
            const isSelected = booking.id === selectedId;

            return (
              <button
                key={booking.id}
                type="button"
                onClick={() => handleSelectBooking(booking)}
                className={`w-full border-b border-gray-100 p-4 text-left transition hover:bg-gray-50 ${
                  isSelected ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {booking.customerName}
                    </p>
                    <p className="text-sm text-gray-500">{booking.id}</p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      booking.bookingStatus
                    )}`}
                  >
                    {booking.bookingStatus.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p>{booking.projectType}</p>
                  <p>
                    {booking.city}, {booking.state}
                  </p>
                  <p>{formatDate(booking.deliveryDate)}</p>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      booking.paymentStatus
                    )}`}
                  >
                    {booking.paymentStatus.replaceAll("_", " ")}
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formatCurrency(booking.total)}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}