"use client";

import MiniCalendarEvent from "./booking-calendar-minicard.component";
import {
  formatDateKey,
  getBookingEventsForDate,
} from "./booking-calendar.utils";

function MobileEventDots({ events = [], isSelected }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1 sm:hidden">
      {events.slice(0, 4).map((event) => (
        <span
          key={event.id}
          className={`h-2 w-2 rounded-full ${
            event.type === "delivery" ? "bg-blue-500" : "bg-green-500"
          } ${isSelected ? "ring-1 ring-white" : ""}`}
          title={`${event.label} ${event.time}`}
        />
      ))}

      {events.length > 4 ? (
        <span
          className={`text-[10px] font-semibold ${
            isSelected ? "text-gray-700" : "text-gray-500"
          }`}
        >
          +{events.length - 4}
        </span>
      ) : null}
    </div>
  );
}

export default function BookingCalendarMonth({
  bookings = [],
  monthDays = [],
  selectedDate,
  onSelectDate,
  focusedBookingId,
  setFocusedBookingId,
}) {
  const selectedDateKey = formatDateKey(selectedDate);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="grid grid-cols-7 border-b border-gray-200 text-center text-xs font-semibold text-gray-500 sm:text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="border-r border-gray-200 p-2 last:border-r-0 sm:p-3"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {monthDays.map((day) => {
          const dateKey = formatDateKey(day);
          const events = getBookingEventsForDate(bookings, day);

          const isSelected = dateKey === selectedDateKey;
          const isToday = dateKey === formatDateKey(new Date());
          const isCurrentMonth = day.getMonth() === selectedDate.getMonth();

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(day)}
              className={`min-h-24 border-r border-b border-gray-200 p-2 text-left transition last:border-r-0 sm:min-h-36 sm:p-3 ${
                isSelected
                  ? "bg-blue-50/60 ring-1 ring-inset ring-brand-primary/30"
                  : isCurrentMonth
                    ? "bg-white hover:bg-gray-50"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-1">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                    isSelected
                      ? "bg-brand-primary text-white"
                      : isToday
                        ? "bg-gray-950 text-white"
                        : isCurrentMonth
                          ? "text-gray-900"
                          : "text-gray-400"
                  }`}
                >
                  {day.getDate()}
                </span>

                {events.length > 0 ? (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold sm:hidden ${
                      isSelected
                        ? "bg-white text-gray-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {events.length}
                  </span>
                ) : null}
              </div>

              <MobileEventDots events={events} isSelected={isSelected} />

              <div className="hidden space-y-1 md:block">
                {events.slice(0, 2).map((event) => (
                  <MiniCalendarEvent
                    key={event.id}
                    event={event}
                    isSelected={isSelected}
                    focusedBookingId={focusedBookingId}
                    setFocusedBookingId={setFocusedBookingId}
                  />
                ))}

                {events.length > 2 ? (
                  <div
                    className={
                      isSelected
                        ? "text-[10px] font-semibold text-gray-600 sm:text-xs"
                        : "text-[10px] font-semibold text-gray-500 sm:text-xs"
                    }
                  >
                    +{events.length - 2} more
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
