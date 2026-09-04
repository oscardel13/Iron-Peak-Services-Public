"use client";

import DumpsterTimelineBar from "./dumpster-timeline-bar.component";

import {
  getBookingsForDumpster,
  getDumpsterLabel,
} from "./dumpster-timeline.utils";

import {
  getDumpsterAccent,
  getSecondaryDumpsterAccent,
  getDumpsterPattern,
} from "../booking-calendar/booking-calendar.colors";

function getStatusClasses(status) {
  const map = {
    AVAILABLE: "bg-green-100 text-green-700",
    RESERVED: "bg-blue-100 text-blue-700",
    IN_USE: "bg-amber-100 text-amber-700",
    MAINTENANCE: "bg-orange-100 text-orange-700",
    OUT_OF_SERVICE: "bg-red-100 text-red-700",
  };

  return map[status] || "bg-slate-100 text-slate-700";
}

function DumpsterLabelCell({ dumpster, onSelectDumpster }) {
  return (
    <button
      type="button"
      onClick={() => onSelectDumpster?.(dumpster)}
      className="sticky left-0 z-30 min-w-0 border-r border-gray-100 bg-white p-3 text-left transition hover:bg-gray-50 md:p-4"
    >
      <div className="min-w-0">
        <p className="truncate text-xs font-black text-gray-900 md:text-sm">
          {getDumpsterLabel(dumpster)}
        </p>

        <div className="mt-2 flex min-w-0 flex-col items-start gap-1 md:flex-row md:flex-wrap md:items-center md:gap-2">
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusClasses(
              dumpster.status,
            )}`}
          >
            {dumpster.status?.replaceAll("_", " ") || "Unknown"}
          </span>

          {dumpster.serialNumber ? (
            <span className="truncate text-xs text-gray-500 md:inline">
              {dumpster.serialNumber}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export default function DumpsterTimelineRow({
  dumpster,
  bookings = [],
  timelineDays = [],
  timelineStart,
  numberOfDays,
  focusedBookingId,
  setFocusedBookingId,
  onSelectDumpster,
  routeBase,
}) {
  const dumpsterBookings = getBookingsForDumpster(bookings, dumpster.id);

  return (
    <div className="grid min-w-[760px] grid-cols-[115px_1fr] border-b border-gray-100 last:border-b-0 md:min-w-[920px] md:grid-cols-[210px_1fr]">
      {" "}
      <DumpsterLabelCell
        dumpster={dumpster}
        onSelectDumpster={onSelectDumpster}
      />
      <div className="relative min-h-[68px] bg-white">
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${numberOfDays}, minmax(0, 1fr))`,
          }}
        >
          {timelineDays.map((day) => (
            <div
              key={day.toISOString()}
              className="border-r border-gray-100 last:border-r-0"
            />
          ))}
        </div>

        {dumpsterBookings.length === 0 ? (
          <div className="relative z-10 flex min-h-[68px] items-center px-4 text-sm font-medium text-gray-400">
            No rentals scheduled
          </div>
        ) : null}

        {dumpsterBookings.map((booking) => (
          <DumpsterTimelineBar
            key={booking.id}
            booking={booking}
            timelineStart={timelineStart}
            numberOfDays={numberOfDays}
            focusedBookingId={focusedBookingId}
            setFocusedBookingId={setFocusedBookingId}
            routeBase={routeBase}
          />
        ))}
      </div>
    </div>
  );
}
