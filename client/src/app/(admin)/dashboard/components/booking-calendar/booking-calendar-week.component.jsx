"use client";

import MiniCalendarEvent from "./booking-calendar-minicard.component";
import {
  formatDateKey,
  getBookingEventsForDate,
} from "./booking-calendar.utils";

import { getDumpsterAccent } from "./booking-calendar.colors";

function EventDots({ events = [], isSelected }) {
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-1">
      {events.slice(0, 4).map((event) => {
        const accent = getDumpsterAccent(event.booking);

        return (
          <span
            key={event.id}
            className={`h-2 w-2 rounded-full ${accent.dot} ${
              isSelected ? "ring-1 ring-white" : ""
            }`}
          />
        );
      })}

      {events.length > 4 ? (
        <span
          className={`text-[10px] font-bold ${
            isSelected ? "text-white" : "text-gray-500"
          }`}
        >
          +{events.length - 4}
        </span>
      ) : null}
    </div>
  );
}

function MobileWeekDay({ day, events, isSelected, isToday, onSelectDate }) {
  return (
    <button
      type="button"
      onClick={() => onSelectDate(day)}
      className={`w-[76px] shrink-0 snap-start rounded-2xl border px-3 py-3 text-center transition ${
        isSelected
          ? "border-brand-primary bg-brand-primary text-white shadow-sm"
          : "border-gray-200 bg-white hover:border-brand-primary/30 hover:bg-gray-50"
      }`}
    >
      <p
        className={`text-[11px] font-bold uppercase tracking-wide ${
          isSelected ? "text-white/80" : "text-gray-500"
        }`}
      >
        {day.toLocaleDateString(undefined, {
          weekday: "short",
        })}
      </p>

      <div
        className={`mx-auto mt-1 flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold ${
          isSelected
            ? "bg-white text-brand-primary"
            : isToday
              ? "bg-gray-950 text-white"
              : "bg-gray-100 text-gray-900"
        }`}
      >
        {day.getDate()}
      </div>

      {events.length > 0 ? (
        <EventDots events={events} isSelected={isSelected} />
      ) : (
        <p
          className={`mt-2 text-[10px] ${
            isSelected ? "text-white/70" : "text-gray-400"
          }`}
        >
          —
        </p>
      )}
    </button>
  );
}

function DesktopWeekDay({
  day,
  events,
  isSelected,
  isToday,
  onSelectDate,
  maxVisibleEvents,
  focusedBookingId,
  setFocusedBookingId,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectDate(day)}
      className={`min-h-72 rounded-2xl border p-3 text-left transition ${
        isSelected
          ? "border-brand-primary bg-blue-50/60 ring-1 ring-brand-primary/20"
          : "border-gray-200 bg-white hover:border-brand-primary/30 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-wide ${
              isSelected ? "text-brand-primary" : "text-gray-500"
            }`}
          >
            {day.toLocaleDateString(undefined, {
              weekday: "short",
            })}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold ${
                isSelected
                  ? "bg-brand-primary text-white"
                  : isToday
                    ? "bg-gray-950 text-white"
                    : "bg-gray-100 text-gray-900"
              }`}
            >
              {day.getDate()}
            </span>

            {isToday ? (
              <span className="rounded-full bg-gray-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Today
              </span>
            ) : null}
          </div>
        </div>

        {events.length > 0 ? (
          <span
            className={`rounded-full px-2 py-1 text-xs font-bold ${
              isSelected
                ? "bg-white text-gray-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {events.length}
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-2">
        {events.length === 0 ? (
          <p
            className={
              isSelected
                ? "rounded-xl border border-dashed border-brand-primary/30 bg-white/70 p-3 text-xs text-gray-500"
                : "rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3 text-xs text-gray-400"
            }
          >
            No events
          </p>
        ) : (
          events
            .slice(0, maxVisibleEvents)
            .map((event) => (
              <MiniCalendarEvent
                key={event.id}
                event={event}
                isSelected={isSelected}
                focusedBookingId={focusedBookingId}
                setFocusedBookingId={setFocusedBookingId}
              />
            ))
        )}

        {events.length > maxVisibleEvents ? (
          <p
            className={
              isSelected
                ? "text-xs font-semibold text-gray-600"
                : "text-xs font-semibold text-gray-500"
            }
          >
            +{events.length - maxVisibleEvents} more
          </p>
        ) : null}
      </div>
    </button>
  );
}

export default function BookingCalendarWeek({
  bookings = [],
  weekDays = [],
  selectedDate,
  onSelectDate,
  compact = false,
  focusedBookingId,
  setFocusedBookingId,
}) {
  const selectedDateKey = formatDateKey(selectedDate);
  const todayKey = formatDateKey(new Date());
  const maxVisibleEvents = compact ? 2 : 3;

  return (
    <div className="w-full max-w-full min-w-0 space-y-4 overflow-hidden">
      <div className="max-w-screen min-w-0 overflow-x-auto overscroll-x-contain pb-2 lg:hidden">
        <div className="flex w-max snap-x snap-mandatory gap-2">
          {weekDays.map((day) => {
            const dateKey = formatDateKey(day);
            const events = getBookingEventsForDate(bookings, day);

            return (
              <MobileWeekDay
                key={dateKey}
                day={day}
                events={events}
                isSelected={dateKey === selectedDateKey}
                isToday={dateKey === todayKey}
                onSelectDate={onSelectDate}
              />
            );
          })}
        </div>
      </div>

      <div className="hidden grid-cols-7 gap-3 lg:grid">
        {weekDays.map((day) => {
          const dateKey = formatDateKey(day);
          const events = getBookingEventsForDate(bookings, day);

          return (
            <DesktopWeekDay
              key={dateKey}
              day={day}
              events={events}
              isSelected={dateKey === selectedDateKey}
              isToday={dateKey === todayKey}
              onSelectDate={onSelectDate}
              maxVisibleEvents={maxVisibleEvents}
              focusedBookingId={focusedBookingId}
              setFocusedBookingId={setFocusedBookingId}
            />
          );
        })}
      </div>
    </div>
  );
}
