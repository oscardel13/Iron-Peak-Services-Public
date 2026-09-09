"use client";

import { useEffect, useState } from "react";

import BookingCalendar from "../../components/booking-calendar/booking-calendar.component";
import CalendarTabs from "../../components/calendar-tabs/calendar-tabs.component";
import DumpsterTimeline from "../../components/dumpster-timeline/dumpster-timeline.component";

import { getAPI } from "@/utils/api";

function normalizeBookingsResponse(response) {
  if (Array.isArray(response?.data)) return response.data;

  return (
    response?.data?.bookings ||
    response?.data?.data ||
    response?.data?.results ||
    []
  );
}

function normalizeInventoryResponse(response) {
  if (Array.isArray(response?.data)) return response.data;

  return response?.data?.dumpsters || response?.data?.inventory || [];
}

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState("calendar");

  const [bookings, setBookings] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [selectedDumpsterId, setSelectedDumpsterId] = useState("ALL");

  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  const [hasFetchedInventory, setHasFetchedInventory] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [inventoryError, setInventoryError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoadingBookings(true);
        setBookingsError("");

        const response = await getAPI("/bookings");
        const nextBookings = normalizeBookingsResponse(response);

        setBookings(nextBookings);
      } catch (error) {
        console.error("Failed to fetch calendar bookings:", error);
        setBookingsError("Failed to load calendar bookings.");
      } finally {
        setLoadingBookings(false);
      }
    }

    fetchBookings();
  }, []);

  async function fetchInventoryOnce({ force = false } = {}) {
    if (!force && hasFetchedInventory) return;
    if (loadingInventory) return;

    try {
      setLoadingInventory(true);
      setInventoryError("");

      const response = await getAPI("/inventory/dumpsters");
      const nextInventory = normalizeInventoryResponse(response);

      setInventory(nextInventory);
      setHasFetchedInventory(true);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      setInventoryError("Failed to load dumpster timeline.");
    } finally {
      setLoadingInventory(false);
    }
  }

  async function handleTabChange(tab) {
    setActiveTab(tab);

    if (tab === "timeline") {
      await fetchInventoryOnce();
    }
  }

  async function handleRetryBookings() {
    try {
      setLoadingBookings(true);
      setBookingsError("");

      const response = await getAPI("/bookings");
      const nextBookings = normalizeBookingsResponse(response);

      setBookings(nextBookings);
    } catch (error) {
      console.error("Failed to retry calendar bookings:", error);
      setBookingsError("Failed to load calendar bookings.");
    } finally {
      setLoadingBookings(false);
    }
  }

  async function handleRetryInventory() {
    await fetchInventoryOnce({ force: true });
  }

  const isCalendarTab = activeTab === "calendar";
  const isTimelineTab = activeTab === "timeline";

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">Calendar</h1>

        <p className="mt-1 text-sm text-gray-500">
          View upcoming deliveries, pickups, and dumpster availability.
        </p>
      </div>

      <CalendarTabs activeTab={activeTab} onChange={handleTabChange} />

      {bookingsError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">{bookingsError}</p>

          <button
            type="button"
            onClick={handleRetryBookings}
            className="mt-3 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      ) : null}

      {loadingBookings ? (
        <div className="h-[600px] animate-pulse rounded-3xl bg-gray-100" />
      ) : null}

      {!loadingBookings && !bookingsError && isCalendarTab ? (
        <BookingCalendar
          bookings={bookings}
          allowedViews={["day", "week", "month"]}
          defaultView="month"
          title="Rental Calendar"
          description="Deliveries and pickups for your dumpster rentals."
          showDayDetails
        />
      ) : null}

      {!loadingBookings && !bookingsError && isTimelineTab ? (
        <div className="min-w-0">
          {loadingInventory ? (
            <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="h-10 animate-pulse rounded-xl bg-gray-100 sm:w-[220px]" />
                <div className="h-10 animate-pulse rounded-xl bg-gray-100 sm:w-[130px]" />
                <div className="h-10 animate-pulse rounded-xl bg-gray-100 sm:w-[220px]" />
              </div>

              <div className="h-72 animate-pulse rounded-3xl bg-gray-100" />
            </div>
          ) : inventoryError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                {inventoryError}
              </p>

              <p className="mt-1 text-sm text-red-600">
                Your bookings loaded, but the dumpster inventory could not be
                retrieved.
              </p>

              <button
                type="button"
                onClick={handleRetryInventory}
                className="mt-3 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : (
            <DumpsterTimeline
              bookings={bookings}
              dumpsters={inventory}
              selectedDumpsterId={selectedDumpsterId}
              onSelectedDumpsterIdChange={setSelectedDumpsterId}
              title="Dumpster Timeline"
              description="View rental windows by dumpster."
              defaultDays={30}
              routeBase="/dashboard/bookings"
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
