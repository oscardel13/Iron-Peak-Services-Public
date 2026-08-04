"use client";

import { useEffect, useState } from "react";

import BookingCalendar from "../components/booking-calendar/booking-calendar.component";
import { getAPI } from "@/utils/api";

export default function ClientCalendarPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setError("");

        const response = await getAPI("/client/bookings");

        const nextBookings = Array.isArray(response.data)
          ? response.data
          : (response.data?.bookings ?? []);

        setBookings(nextBookings);
      } catch (err) {
        console.error("Failed to fetch calendar bookings:", err);
        setError("Failed to load calendar.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
          Client Portal
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">Calendar</h1>
        <p className="mt-1 text-sm text-gray-500">
          View upcoming deliveries, pickups, and rental dates.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="h-[600px] animate-pulse rounded-3xl bg-gray-100" />
      ) : (
        <BookingCalendar
          bookings={bookings}
          allowedViews={["day", "week", "month"]}
          defaultView="month"
          title="Rental Calendar"
          description="Deliveries and pickups for your dumpster rentals."
          showDayDetails
        />
      )}
    </div>
  );
}
