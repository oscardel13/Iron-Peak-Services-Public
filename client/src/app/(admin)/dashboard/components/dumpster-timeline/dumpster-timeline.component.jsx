"use client";

import { useMemo, useState } from "react";

import DumpsterTimelineRow from "./dumpster-timeline-row.component";

import {
  addDays,
  formatTimelineDay,
  getDefaultTimelineStart,
  getTimelineDays,
} from "./dumpster-timeline.utils";

function Select(props) {
  return (
    <select
      {...props}
      className={`rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 outline-none transition focus:border-black ${
        props.className || ""
      }`}
    />
  );
}

function TimelineButton({ children, onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white"
          : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      }
    >
      {children}
    </button>
  );
}

export default function DumpsterTimeline({
  bookings = [],
  dumpsters = [],
  selectedDumpsterId = "ALL",
  onSelectedDumpsterIdChange,
  onSelectDumpster,
  title = "Dumpster Availability",
  description = "Timeline view of scheduled rentals by dumpster.",
  defaultDays = 30,
  routeBase = "/dashboard/bookings",
  embedded = false,
}) {
  const [timelineStart, setTimelineStart] = useState(getDefaultTimelineStart);
  const [numberOfDays, setNumberOfDays] = useState(defaultDays);
  const [focusedBookingId, setFocusedBookingId] = useState(null);

  const timelineDays = useMemo(() => {
    return getTimelineDays(timelineStart, numberOfDays);
  }, [timelineStart, numberOfDays]);

  const visibleDumpsters = useMemo(() => {
    if (!selectedDumpsterId || selectedDumpsterId === "ALL") {
      return dumpsters;
    }

    return dumpsters.filter((dumpster) => dumpster.id === selectedDumpsterId);
  }, [dumpsters, selectedDumpsterId]);

  function goPrevious() {
    setTimelineStart((current) => addDays(current, -7));
  }

  function goNext() {
    setTimelineStart((current) => addDays(current, 7));
  }

  function goToday() {
    setTimelineStart(getDefaultTimelineStart());
  }

  return (
    <section
      className={
        embedded
          ? "min-w-0 overflow-hidden bg-white"
          : "min-w-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
      }
    >
      <div
        className={`flex flex-col gap-4 p-5 xl:flex-row xl:items-center xl:justify-between ${
          embedded ? "" : "border-b border-gray-100"
        }`}
      >
        {!embedded ? (
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              Timeline Controls
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Select a dumpster and timeline range.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
          <Select
            value={selectedDumpsterId}
            onChange={(e) => onSelectedDumpsterIdChange?.(e.target.value)}
            className="w-full sm:w-[220px]"
          >
            <option value="ALL">All Dumpsters</option>

            {dumpsters.map((dumpster) => (
              <option key={dumpster.id} value={dumpster.id}>
                {dumpster.label || dumpster.sizeLabel || dumpster.id}
              </option>
            ))}
          </Select>

          <Select
            value={numberOfDays}
            onChange={(e) => setNumberOfDays(Number(e.target.value))}
            className="w-full sm:w-[130px]"
          >
            <option value={14}>14 Days</option>
            <option value={30}>30 Days</option>
            <option value={60}>60 Days</option>
          </Select>

          <div className="grid grid-cols-3 gap-2 sm:flex">
            <TimelineButton onClick={goPrevious}>Prev</TimelineButton>
            <TimelineButton onClick={goToday} active>
              Today
            </TimelineButton>
            <TimelineButton onClick={goNext}>Next</TimelineButton>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-[115px_1fr] md:grid-cols-[210px_1fr] border-b border-gray-100 bg-gray-50">
            <div className="sticky left-0 z-30 border-r border-gray-100 bg-gray-50 p-3 text-xs font-bold uppercase tracking-wide text-gray-500">
              Dumpster
            </div>

            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${numberOfDays}, minmax(0, 1fr))`,
              }}
            >
              {timelineDays.map((day, index) => {
                const shouldShowLabel =
                  numberOfDays <= 14
                    ? index % 2 === 0
                    : numberOfDays <= 30
                      ? index % 4 === 0
                      : index % 7 === 0;

                return (
                  <div
                    key={day.toISOString()}
                    className="border-r border-gray-100 p-2 text-center text-[11px] font-bold text-gray-500 last:border-r-0"
                  >
                    {shouldShowLabel ? formatTimelineDay(day) : ""}
                  </div>
                );
              })}
            </div>
          </div>

          {visibleDumpsters.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No dumpsters found for this timeline.
            </div>
          ) : (
            visibleDumpsters.map((dumpster) => (
              <DumpsterTimelineRow
                key={dumpster.id}
                dumpster={dumpster}
                bookings={bookings}
                timelineDays={timelineDays}
                timelineStart={timelineStart}
                numberOfDays={numberOfDays}
                focusedBookingId={focusedBookingId}
                setFocusedBookingId={setFocusedBookingId}
                onSelectDumpster={onSelectDumpster}
                routeBase={routeBase}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
