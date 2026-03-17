"use client";

import { useMemo, useState } from "react";
import StatCard from "../components/StatCard/statCard.component";
import {
    formatCurrency,
} from "@/utils/helpers"

import {
  MOCK_BOOKINGS,
} from "@/data/mock-bookings";
import BookingCardSection from "../components/booking-card-section/booking-card-section.component";
import BookingsListSection from "../components/bookings-section/bookings-section.component"

export default function BookingsPage() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(MOCK_BOOKINGS[0]?.id || null);
  const [isEditing, setIsEditing] = useState(false);

  const selectedBooking = bookings.find((b) => b.id === selectedId) || null;

  const [draft, setDraft] = useState(selectedBooking);

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return bookings;

    return bookings.filter((booking) => {
      const haystack = [
        booking.id,
        booking.customer.name,
        booking.customer.phone,
        booking.customer.email,
        booking.service.projectType,
        booking.service.address1,
        booking.service.city,
        booking.service.state,
        booking.service.zip,
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
    const active = bookings.filter((b) => b.bookingStatus === "active").length;
    const scheduled = bookings.filter(
      (b) => b.bookingStatus === "scheduled"
    ).length;
    const quotes = bookings.filter((b) => b.bookingStatus === "quote").length;
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

  function handleSave() {
    if (!draft) return;

    const updatedBooking = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );

    setDraft(updatedBooking);
    setIsEditing(false);
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