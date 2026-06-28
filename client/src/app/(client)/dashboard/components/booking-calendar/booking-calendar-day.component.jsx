"use client";

import BookingCard from "./booking-card.component";
import { getBookingEventsForDate } from "./booking-calendar.utils";

export default function BookingCalendarDay({
  bookings = [],
  selectedDate,
  compact = false,
}) {
  const activeDate = selectedDate ? new Date(selectedDate) : new Date();

  const events = getBookingEventsForDate(bookings, activeDate);

  return (
    <div>
      <div className="mb-3 flex flex-col gap-1">
        <h3 className="text-base font-semibold text-gray-900">
          {activeDate.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>

        <p className="text-sm text-gray-500">
          {events.length} scheduled item{events.length === 1 ? "" : "s"}
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-400">
          No deliveries or pickups scheduled.
        </div>
      ) : (
        <div
          className={
            compact
              ? "grid gap-3 md:grid-cols-2"
              : "grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          }
        >
          {events.map((event) => (
            <BookingCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}