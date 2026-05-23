"use client";

import {
  formatDateKey,
  getBookingEventsForDate,
  hasPriorityDelivery,
} from "./booking-calendar.utils";

export default function BookingCalendarWeek({
  bookings = [],
  weekDays = [],
  selectedDate,
  onSelectDate,
  compact = false,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {weekDays.map((day) => {
        const dateKey = formatDateKey(day);
        const selectedDateKey = formatDateKey(selectedDate);
        const events = getBookingEventsForDate(bookings, day);
        const isSelected = dateKey === selectedDateKey;

        return (
          <button
            key={dateKey}
            type="button"
            onClick={() => onSelectDate(day)}
            className={
              isSelected
                ? "rounded-xl border bg-gray-900 p-3 text-left text-white"
                : "rounded-xl border bg-gray-50 p-3 text-left hover:bg-gray-100"
            }
          >
            <div className="flex items-center justify-between gap-2 lg:block">
              <div
                className={
                  isSelected
                    ? "text-xs font-medium text-gray-200"
                    : "text-xs font-medium text-gray-500"
                }
              >
                {day.toLocaleDateString(undefined, {
                  weekday: "short",
                })}
              </div>

              <div className="text-lg font-semibold">{day.getDate()}</div>
            </div>

            <div className="mt-3 space-y-2">
              {events.length === 0 ? (
                <p
                  className={
                    isSelected
                      ? "text-xs text-gray-300"
                      : "text-xs text-gray-400"
                  }
                >
                  No events
                </p>
              ) : (
                events.slice(0, compact ? 2 : 3).map((event) => (
                  <MiniCalendarEvent
                    key={event.id}
                    event={event}
                    isSelected={isSelected}
                  />
                ))
              )}

              {events.length > (compact ? 2 : 3) && (
                <p
                  className={
                    isSelected
                      ? "text-xs text-gray-300"
                      : "text-xs text-gray-500"
                  }
                >
                  +{events.length - (compact ? 2 : 3)} more
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function MiniCalendarEvent({ event, isSelected }) {
  const isPriorityDelivery =
    event.type === "delivery" && hasPriorityDelivery(event.booking);

  return (
    <div
      className={
        isSelected
          ? "rounded-lg bg-white/10 px-2 py-1.5 text-xs"
          : "rounded-lg bg-white px-2 py-1.5 text-xs"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <span>
          {event.label}
          {isPriorityDelivery && <span className="ml-1">⚡</span>}
        </span>

        <span>{event.time}</span>
      </div>
    </div>
  );
}