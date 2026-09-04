"use client";

import BookingCard from "./booking-card.component";
import { getBookingEventsForDate } from "./booking-calendar.utils";

function groupEventsByBooking(events) {
  return events.reduce((acc, event) => {
    const bookingId = event.bookingId || event.booking?.id || event.id;

    if (!acc[bookingId]) {
      acc[bookingId] = {
        bookingId,
        booking: event.booking,
        events: [],
      };
    }

    acc[bookingId].events.push(event);

    return acc;
  }, {});
}

export default function BookingCalendarDay({
  bookings = [],
  selectedDate,
  compact = false,
  focusedBookingId,
  setFocusedBookingId,

  // Optional later: pass real API handlers from parent
  onMarkDelivered,
  onMarkPickedUp,
}) {
  const activeDate = selectedDate ? new Date(selectedDate) : new Date();

  const events = getBookingEventsForDate(bookings, activeDate);
  const groupedEvents = Object.values(groupEventsByBooking(events));

  if (events.length === 0) {
    return (
      <div
        className={
          compact
            ? "rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6 text-center"
            : "rounded-3xl border border-dashed border-gray-200 bg-gray-50/80 p-8 text-center"
        }
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
          📅
        </div>

        <p className="mt-4 text-sm font-semibold text-gray-900">
          No bookings today
        </p>

        <p className="mt-1 text-sm text-gray-500">
          There are no scheduled deliveries or pickups for this day.
        </p>

        {compact ? (
          <p className="mt-3 text-xs font-medium text-gray-400">
            Switch to Week view or open the Dumpster Timeline to see what’s
            coming up.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <section className="min-w-0">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          {activeDate.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {events.length} scheduled item{events.length === 1 ? "" : "s"} from{" "}
          {groupedEvents.length} order{groupedEvents.length === 1 ? "" : "s"}
        </p>
      </div>

      <div
        className={
          compact
            ? "grid min-w-0 gap-4 md:grid-cols-2"
            : "grid min-w-0 gap-4 lg:grid-cols-2"
        }
      >
        {groupedEvents.map((group) => (
          <BookingCard
            key={group.bookingId}
            group={group}
            focusedBookingId={focusedBookingId}
            setFocusedBookingId={setFocusedBookingId}
            onMarkDelivered={onMarkDelivered}
            onMarkPickedUp={onMarkPickedUp}
          />
        ))}
      </div>
    </section>
  );
}
