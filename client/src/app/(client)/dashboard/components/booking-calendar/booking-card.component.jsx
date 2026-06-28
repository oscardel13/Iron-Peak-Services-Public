"use client";

import {
  getPriorityDeliveryLabel,
  hasPriorityDelivery,
} from "./booking-calendar.utils";

export default function BookingCard({ event }) {
  const booking = event.booking;
  const isPriorityDelivery =
    event.type === "delivery" && hasPriorityDelivery(booking);

  const priorityLabel = getPriorityDeliveryLabel(booking);

  return (
    <div className="rounded-xl border bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={
              event.type === "delivery"
                ? "rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"
                : "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
            }
          >
            {event.label}
          </span>

          {isPriorityDelivery && (
            <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
              Priority
            </span>
          )}
        </div>

        <span className="shrink-0 text-sm text-gray-500">{event.time}</span>
      </div>

      <h4 className="font-semibold text-gray-900">
        {booking.dumpsterLabel || `${booking.dumpsterSize} Yard Dumpster`}
      </h4>

      <div className="mt-2 space-y-1 text-sm text-gray-500">
        <p>{booking.bookingNumber}</p>
        <p>{booking.customerName}</p>
        <p className="line-clamp-2">
          {booking.address1}, {booking.city}, {booking.state} {booking.zip}
        </p>
      </div>

      {isPriorityDelivery && (
        <div className="mt-3 rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-700">
          <p>{priorityLabel}</p>

          {booking.priorityDeliveryNote && (
            <p className="mt-1">{booking.priorityDeliveryNote}</p>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-white px-2 py-1 text-xs text-gray-600 ring-1 ring-gray-200">
          {booking.bookingStatus}
        </span>

        <span className="rounded-full bg-white px-2 py-1 text-xs text-gray-600 ring-1 ring-gray-200">
          {booking.paymentStatus}
        </span>
      </div>
    </div>
  );
}