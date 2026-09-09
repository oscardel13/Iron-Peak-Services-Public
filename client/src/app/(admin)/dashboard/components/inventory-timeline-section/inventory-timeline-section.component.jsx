"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import DumpsterTimeline from "../dumpster-timeline/dumpster-timeline.component";

import { getAPI } from "@/utils/api";

import { normalizeBookingsResponse } from "../dumpster-timeline/dumpster-timeline.utils";

export default function InventoryTimelineSection({
  inventory = [],
  selectedTimelineDumpsterId,
  onSelectedDumpsterIdChange,
  onSelectDumpster,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState("");

  async function fetchBookingsOnce() {
    if (hasFetched || loadingBookings) return;

    try {
      setLoadingBookings(true);
      setError("");

      const response = await getAPI("/bookings");
      const nextBookings = normalizeBookingsResponse(response);

      setBookings(nextBookings);
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to fetch timeline bookings:", error);
      setError("Failed to load dumpster timeline.");
    } finally {
      setLoadingBookings(false);
    }
  }

  async function handleToggle() {
    const nextExpanded = !isExpanded;

    setIsExpanded(nextExpanded);

    if (nextExpanded) {
      await fetchBookingsOnce();
    }
  }

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full min-w-0 items-start justify-between gap-4 p-5 text-left transition hover:bg-gray-50"
      >
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Dumpster Availability
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            View all dumpsters or focus on one dumpster across upcoming rental
            windows.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {loadingBookings ? (
            <span className="hidden text-sm font-medium text-gray-500 sm:inline">
              Loading...
            </span>
          ) : null}

          <span className="rounded-xl border border-gray-200 bg-white p-2">
            <ChevronDown
              className={`h-5 w-5 text-gray-600 transition ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </span>
        </div>
      </button>

      {isExpanded ? (
        <div className="min-w-0 border-t border-gray-100 p-5">
          {loadingBookings ? (
            <div className="space-y-4">
              <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-72 animate-pulse rounded-3xl bg-gray-100" />
            </div>
          ) : error ? (
            <div>
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>

              <button
                type="button"
                onClick={fetchBookingsOnce}
                className="mt-3 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : (
            <DumpsterTimeline
              bookings={bookings}
              dumpsters={inventory}
              selectedDumpsterId={selectedTimelineDumpsterId}
              onSelectedDumpsterIdChange={onSelectedDumpsterIdChange}
              onSelectDumpster={onSelectDumpster}
              title="Dumpster Availability"
              description="Timeline view of scheduled rentals by dumpster."
              defaultDays={30}
              routeBase="/dashboard/bookings"
              embedded
            />
          )}
        </div>
      ) : null}
    </section>
  );
}
