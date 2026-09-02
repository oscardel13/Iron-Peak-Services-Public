"use client";

import { useEffect, useState } from "react";
import BookingCalendar from "../components/booking-calendar/booking-calendar.component";
import { getAPI } from "@/utils/api";

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAPI("/bookings");

        const nextBookings = Array.isArray(response.data)
          ? response.data
          : (response.data?.bookings ?? []);

        setBookings(nextBookings);
      } catch (error) {
        console.error("Failed to fetch calendar bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <BookingCalendar
        bookings={bookings}
        allowedViews={["day", "week", "month"]}
        defaultView="month"
        title="Calendar"
        description="View scheduled dumpster deliveries and pickups."
        showDayDetails
      />
    </div>
  );
}
