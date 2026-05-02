"use client";

import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard/statCard.component";
import {
    formatCurrency,
} from "@/utils/helpers"

import {
  MOCK_BOOKINGS,
} from "@/data/mock-bookings";
import BookingCardSection from "../components/booking-card-section/booking-card-section.component";
import BookingsListSection from "../components/bookings-section/bookings-section.component"
import { getAPI, patchAPI } from "../../../../utils/api";
import { getChangedFields } from "../../../../utils/helpers";

export default function BookingsPage() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(MOCK_BOOKINGS[0]?.id || null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try{
        const response = await getAPI("/bookings");
        console.log("Fetched bookings:", response.data);
        setBookings(response.data);
      }
      catch(error){
        console.error("Failed to fetch bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  const selectedBooking = bookings.find((b) => b.id === selectedId) || null;

  const [draft, setDraft] = useState(selectedBooking);

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return bookings;

    return bookings.filter((booking) => {
      const haystack = [
        booking.id,
        booking.customerName,
        booking.customerPhone,
        booking.customerEmail,
        booking.serviceType,
        booking.address1,
        booking.city,
        booking.state,
        booking.zip,
        booking.dumpsterLabel,
        booking.bookingStatus,
        booking.paymentStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [bookings, search]);

  const summary = useMemo(() => {
    const active = bookings.filter((b) => b.bookingStatus === "ACTIVE").length;
    const scheduled = bookings.filter(
      (b) => b.bookingStatus === "SCHEDULED"
    ).length;
    const quotes = bookings.filter((b) => b.bookingStatus === "QUOTE").length;
    const revenue = bookings
      .filter((b) => b.paymentStatus === "paid" || b.paymentStatus === "deposit_paid")
      .reduce((sum, b) => sum + (b.pricing.total || 0), 0);

    return { active, scheduled, quotes, revenue };
  }, [bookings]);

  function handleSelectBooking(booking) {
    setSelectedId(booking.id);
    setDraft(booking);
    setIsEditing(false);
  }

  function handleEdit() {
    if (!selectedBooking) return;
    setDraft(structuredClone(selectedBooking));
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setDraft(selectedBooking);
    setIsEditing(false);
  }

  async function handleSave() {
    const bookingToRender = bookings.find((b) => b.id === draft.id);
    if (!draft || !bookingToRender) return;

    try {
      const changes = getChangedFields(bookingToRender, draft);

      // nothing changed → don't call API
      if (Object.keys(changes).length === 0) {
        setIsEditing(false);
        return;
      }

      const response = await patchAPI(
        `/bookings/${draft.id}`,
        changes
      );

      console.log("Updated booking response:", response.data);

      // setBookings((prev) =>
      //   prev.map((booking) =>
      //     booking.id === draft.id ? response.data : booking
      //   )
      // );

      // setDraft(response.data);
      // setIsEditing(false);
  } catch (error) {
      console.error("Failed to update booking:", error);
  }
}

  function updateDraft(path, value) {
    setDraft((prev) => {
      if (!prev) return prev;

      const next = structuredClone(prev);
      const keys = path.split(".");
      let current = next;

      for (let i = 0; i < keys.length - 1; i += 1) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          View, manage, and edit dumpster rental bookings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active" value={summary.active} />
        <StatCard label="Scheduled" value={summary.scheduled} />
        <StatCard label="Quotes" value={summary.quotes} />
        <StatCard label="Collected / Promised" value={formatCurrency(summary.revenue)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
       <BookingsListSection
            search={search}
            setSearch={setSearch}
            filteredBookings={filteredBookings}
            selectedId={selectedId}
            handleSelectBooking={handleSelectBooking}
        />

        <BookingCardSection
            bookingToRender={isEditing ? draft : selectedBooking}
            selectedBooking={selectedBooking}
            draft={draft}
            isEditing={isEditing}
            handleEdit={handleEdit}
            handleCancelEdit={handleCancelEdit}
            handleSave={handleSave}
            updateDraft={updateDraft}
        />
      </div>
    </div>
  );
}