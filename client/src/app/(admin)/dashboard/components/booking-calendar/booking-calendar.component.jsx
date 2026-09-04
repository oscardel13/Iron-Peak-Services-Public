"use client";

import { useMemo, useState } from "react";

import BookingCalendarDay from "./booking-calendar-day.component";
import BookingCalendarWeek from "./booking-calendar-week.component";
import BookingCalendarMonth from "./booking-calendar-month.component";

import { getMonthDays, getWeekDays } from "./booking-calendar.utils";

export default function BookingCalendar({
  bookings = [],
  allowedViews = ["day", "week", "month"],
  defaultView = "day",
  initialDate = new Date(),
  showHeader = true,
  showControls = true,
  showDayDetails = true,
  compact = false,
  embedded = false,
  variant = "default",
  title = "Calendar",
  description = "View scheduled deliveries and pickups.",
}) {
  const normalizedDefaultView = allowedViews.includes(defaultView)
    ? defaultView
    : allowedViews[0];

  const [view, setView] = useState(normalizedDefaultView);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [focusedBookingId, setFocusedBookingId] = useState(null);

  const weekDays = useMemo(() => {
    return getWeekDays(selectedDate);
  }, [selectedDate]);

  const monthDays = useMemo(() => {
    return getMonthDays(selectedDate);
  }, [selectedDate]);

  function goToPrevious() {
    const next = new Date(selectedDate);

    if (view === "day") {
      next.setDate(next.getDate() - 1);
    }

    if (view === "week") {
      next.setDate(next.getDate() - 7);
    }

    if (view === "month") {
      next.setMonth(next.getMonth() - 1);
    }

    setSelectedDate(next);
  }

  function goToNext() {
    const next = new Date(selectedDate);

    if (view === "day") {
      next.setDate(next.getDate() + 1);
    }

    if (view === "week") {
      next.setDate(next.getDate() + 7);
    }

    if (view === "month") {
      next.setMonth(next.getMonth() + 1);
    }

    setSelectedDate(next);
  }

  const shouldShowHeader = showHeader && !embedded && (title || description);
  const shouldShowControls = showControls;
  const isDashboard = variant === "dashboard";

  return (
    <section
      className={
        embedded
          ? "min-w-0 bg-transparent"
          : "flex min-w-0 flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
      }
    >
      {shouldShowHeader ? (
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            ) : null}

            {description ? (
              <p className="text-sm text-gray-500">{description}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {shouldShowControls ? (
        <div
          className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
            embedded ? "" : "mb-2"
          }`}
        >
          <div>
            {isDashboard ? (
              <p className="text-sm font-semibold text-gray-900">
                {view === "day" ? "Today view" : "Week view"}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            {allowedViews.length > 1 ? (
              <div className="flex w-full rounded-xl border border-gray-200 bg-gray-50 p-1 sm:w-auto">
                {allowedViews.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setView(item)}
                    className={
                      view === item
                        ? "flex-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium capitalize text-white sm:flex-none"
                        : "flex-1 rounded-lg px-3 py-1.5 text-xs font-medium capitalize text-gray-600 hover:bg-white sm:flex-none"
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={goToPrevious}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Prev
              </button>

              <button
                type="button"
                onClick={() => setSelectedDate(new Date())}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Today
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {view === "month" ? (
        <div className="min-w-0 space-y-5">
          <BookingCalendarMonth
            bookings={bookings}
            monthDays={monthDays}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            focusedBookingId={focusedBookingId}
            setFocusedBookingId={setFocusedBookingId}
          />
        </div>
      ) : null}

      {view === "week" ? (
        <div className="min-w-0 space-y-5">
          <BookingCalendarWeek
            bookings={bookings}
            weekDays={weekDays}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            compact={compact}
            focusedBookingId={focusedBookingId}
            setFocusedBookingId={setFocusedBookingId}
          />
        </div>
      ) : null}

      {showDayDetails ? (
        <div
          className={
            view === "day"
              ? "min-w-0"
              : compact
                ? "min-w-0 border-t border-gray-100 pt-4"
                : "min-w-0 pt-2"
          }
        >
          <BookingCalendarDay
            bookings={bookings}
            selectedDate={selectedDate}
            compact={compact}
            focusedBookingId={focusedBookingId}
            setFocusedBookingId={setFocusedBookingId}
            variant={variant}
          />
        </div>
      ) : null}
    </section>
  );
}
