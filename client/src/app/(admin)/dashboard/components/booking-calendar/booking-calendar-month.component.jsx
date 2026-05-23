"use client";

import {
  formatDateKey,
  getBookingEventsForDate,
  hasPriorityDelivery,
} from "./booking-calendar.utils";

export default function BookingCalendarMonth({
  bookings = [],
  monthDays = [],
  selectedDate,
  onSelectDate,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <div className="grid grid-cols-7 border-b text-center text-xs font-medium text-gray-500 sm:text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="border-r p-2 last:border-r-0 sm:p-3">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {monthDays.map((day) => {
          const dateKey = formatDateKey(day);
          const selectedDateKey = formatDateKey(selectedDate);
          const events = getBookingEventsForDate(bookings, day);

          const isSelected = dateKey === selectedDateKey;
          const isCurrentMonth = day.getMonth() === selectedDate.getMonth();

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(day)}
              className={
                isSelected
                  ? "min-h-24 border-r border-b bg-gray-900 p-2 text-left text-white last:border-r-0 sm:min-h-32 sm:p-3"
                  : isCurrentMonth
                    ? "min-h-24 border-r border-b bg-white p-2 text-left hover:bg-gray-50 last:border-r-0 sm:min-h-32 sm:p-3"
                    : "min-h-24 border-r border-b bg-gray-50 p-2 text-left text-gray-400 hover:bg-gray-100 last:border-r-0 sm:min-h-32 sm:p-3"
              }
            >
              <div className="mb-2 text-sm font-medium">{day.getDate()}</div>

              <div className="space-y-1">
                {events.slice(0, 2).map((event) => {
                  const isPriorityDelivery =
                    event.type === "delivery" &&
                    hasPriorityDelivery(event.booking);

                  return (
                    <div
                      key={event.id}
                      className={
                        isSelected
                          ? "truncate rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white sm:text-xs"
                          : "truncate rounded-lg bg-gray-100 px-2 py-1 text-[10px] text-gray-700 sm:text-xs"
                      }
                    >
                      <span className="hidden sm:inline">{event.time} </span>
                      {event.label}
                      {isPriorityDelivery && <span className="ml-1">⚡</span>}
                    </div>
                  );
                })}

                {events.length > 2 && (
                  <div
                    className={
                      isSelected
                        ? "text-[10px] text-gray-200 sm:text-xs"
                        : "text-[10px] text-gray-500 sm:text-xs"
                    }
                  >
                    +{events.length - 2} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}