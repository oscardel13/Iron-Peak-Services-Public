"use client";

import { useMemo, useState } from "react";

import DumpsterTimelineRow from "./dumpster-timeline-row.component";

import {
  addDays,
  formatDateKey,
  getDefaultTimelineStart,
  getTimelineDays,
} from "./dumpster-timeline.utils";

function normalizeTimelineDumpsters(value) {
  if (Array.isArray(value)) return value;

  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.dumpsters)) return value.dumpsters;
  if (Array.isArray(value?.inventory)) return value.inventory;
  if (Array.isArray(value?.data?.dumpsters)) return value.data.dumpsters;
  if (Array.isArray(value?.data?.inventory)) return value.data.inventory;

  return [];
}

export default function DumpsterTimeline({
  bookings = [],
  dumpsters = [],
  selectedDumpsterId = "ALL",
  onSelectedDumpsterIdChange,
  onSelectDumpster,
  title = "Dumpster Timeline",
  description = "View rental windows by dumpster.",
  defaultDays = 30,
  routeBase = "/dashboard/bookings",
  embedded = false,
}) {
  const [timelineStart, setTimelineStart] = useState(() =>
    getDefaultTimelineStart(),
  );
  const [numberOfDays, setNumberOfDays] = useState(defaultDays);
  const [focusedBookingId, setFocusedBookingId] = useState(null);

  const [hoveredDateKey, setHoveredDateKey] = useState("");
  const [selectedDateKey, setSelectedDateKey] = useState(
    formatDateKey(new Date()),
  );

  const dayColumnWidth = numberOfDays <= 14 ? 72 : numberOfDays <= 30 ? 60 : 44;

  const timelineWidth = numberOfDays * dayColumnWidth;

  const timelineDays = useMemo(() => {
    return getTimelineDays(timelineStart, numberOfDays);
  }, [timelineStart, numberOfDays]);

  const activeDateKey = hoveredDateKey || selectedDateKey;

  const normalizedDumpsters = useMemo(() => {
    return normalizeTimelineDumpsters(dumpsters);
  }, [dumpsters]);

  const visibleDumpsters = useMemo(() => {
    if (selectedDumpsterId === "ALL") return normalizedDumpsters;

    return normalizedDumpsters.filter((dumpster) => {
      return dumpster.id === selectedDumpsterId;
    });
  }, [normalizedDumpsters, selectedDumpsterId]);

  function handlePrevious() {
    setTimelineStart((previous) => addDays(previous, -numberOfDays));
  }

  function handleToday() {
    setTimelineStart(getDefaultTimelineStart());
    setSelectedDateKey(formatDateKey(new Date()));
  }

  function handleNext() {
    setTimelineStart((previous) => addDays(previous, numberOfDays));
  }

  function handleDayClick(day) {
    const dateKey = formatDateKey(day);

    setSelectedDateKey((previous) => {
      return previous === dateKey ? "" : dateKey;
    });
  }

  return (
    <section
      className={
        embedded
          ? "min-w-0 max-w-full bg-transparent"
          : "min-w-0 max-w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
      }
    >
      <div className={embedded ? "space-y-4" : "space-y-4 p-5"}>
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            ) : null}

            {description ? (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2 xl:justify-end">
            <select
              value={selectedDumpsterId}
              onChange={(event) =>
                onSelectedDumpsterIdChange?.(event.target.value)
              }
              className="min-w-[160px] rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 outline-none"
            >
              <option value="ALL">All Dumpsters</option>

              {normalizedDumpsters.map((dumpster) => (
                <option key={dumpster.id} value={dumpster.id}>
                  {dumpster.label}
                </option>
              ))}
            </select>

            <select
              value={numberOfDays}
              onChange={(event) => setNumberOfDays(Number(event.target.value))}
              className="min-w-[110px] rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 outline-none"
            >
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
            </select>

            <button
              type="button"
              onClick={handlePrevious}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
            >
              Prev
            </button>

            <button
              type="button"
              onClick={handleToday}
              className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              Today
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="w-full min-w-0 overflow-x-auto overflow-y-hidden">
        <div
          className="w-max"
          style={{
            "--timeline-width": `${timelineWidth}px`,
            "--day-column-width": `${dayColumnWidth}px`,
          }}
        >
          <div className="grid grid-cols-[128px_var(--timeline-width)] border-y border-gray-100 bg-gray-50 md:grid-cols-[210px_var(--timeline-width)]">
            <div className="sticky left-0 z-30 border-r border-gray-100 bg-gray-50 px-3 py-3 md:px-4">
              <p className="text-xs font-black uppercase tracking-wide text-gray-500">
                Dumpster
              </p>
            </div>

            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${numberOfDays}, var(--day-column-width))`,
              }}
            >
              {timelineDays.map((day, index) => {
                const dateKey = formatDateKey(day);
                const previousDay = timelineDays[index - 1];

                const monthLabel = day.toLocaleDateString("en-US", {
                  month: "short",
                });

                const previousMonthLabel = previousDay
                  ? previousDay.toLocaleDateString("en-US", { month: "short" })
                  : "";

                const shouldShowMonth =
                  index === 0 || monthLabel !== previousMonthLabel;

                const isActive = activeDateKey === dateKey;
                const isSelected = selectedDateKey === dateKey;
                const isTodayColumn = formatDateKey(new Date()) === dateKey;

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onMouseEnter={() => setHoveredDateKey(dateKey)}
                    onMouseLeave={() => setHoveredDateKey("")}
                    onClick={() => handleDayClick(day)}
                    className={`min-h-[62px] border-r border-gray-100 px-1 py-2 text-center transition last:border-r-0 ${
                      isActive
                        ? "bg-indigo-50"
                        : isTodayColumn
                          ? "bg-gray-100"
                          : "hover:bg-gray-100"
                    }`}
                  >
                    <p
                      className={`h-4 text-[10px] font-black uppercase leading-none ${
                        isActive ? "text-indigo-700" : "text-gray-500"
                      }`}
                    >
                      {shouldShowMonth ? monthLabel : ""}
                    </p>

                    <p
                      className={`mx-auto mt-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-black leading-none ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : isTodayColumn
                            ? "bg-black text-white"
                            : isActive
                              ? "text-indigo-700"
                              : "text-gray-800"
                      }`}
                    >
                      {day.getDate()}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {visibleDumpsters.length === 0 ? (
            <div className="grid grid-cols-[128px_var(--timeline-width)] border-b border-gray-100 md:grid-cols-[210px_var(--timeline-width)]">
              <div className="sticky left-0 z-30 border-r border-gray-100 bg-white px-3 py-6 md:px-4" />

              <div className="flex min-h-[90px] items-center px-4 text-sm font-medium text-gray-400">
                No dumpsters to show.
              </div>
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
                activeDateKey={activeDateKey}
                selectedDateKey={selectedDateKey}
                hoveredDateKey={hoveredDateKey}
                onDayHover={setHoveredDateKey}
                onDayClick={handleDayClick}
                timelineWidth={timelineWidth}
                dayColumnWidth={dayColumnWidth}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
