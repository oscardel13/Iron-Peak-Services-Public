"use client";

import { useEffect, useMemo, useState } from "react";

import { MOCK_BOOKINGS } from "@/data/mock-bookings";
import { getAPI, postAPI } from "@/utils/api";

import BookingCardSection from "../components/booking-card-section/booking-card-section.component";
import BookingsListSection from "../components/bookings-section/bookings-section.component";

function sortBookings(a, b) {
  const aDate = new Date(a.deliveryDate || a.createdAt);
  const bDate = new Date(b.deliveryDate || b.createdAt);

  return aDate - bDate;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [search, setSearch] = useState("");

  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingSelectedBooking, setLoadingSelectedBooking] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchBookingDetail(bookingId) {
    if (!bookingId) return;

    try {
      setLoadingSelectedBooking(true);
      setError("");

      const response = await getAPI(`/client/bookings/${bookingId}`);
      const booking = response.data?.booking ?? null;

      setSelectedBooking(booking);
    } catch (err) {
      console.error("Failed to fetch booking detail:", err);
      setError("Failed to load booking details.");
    } finally {
      setLoadingSelectedBooking(false);
    }
  }

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoadingBookings(true);
        setError("");

        const response = await getAPI("/client/bookings");
        const nextBookings = response.data?.bookings ?? [];

        const sortedBookings = [...nextBookings].sort(sortBookings);

        setBookings(sortedBookings);

        if (sortedBookings.length > 0) {
          await fetchBookingDetail(sortedBookings[0].id);
        } else {
          setSelectedBooking(null);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings.");
        setBookings([]);
        setSelectedBooking(null);
      } finally {
        setLoadingBookings(false);
      }
    }

    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return bookings;

    return bookings.filter((booking) => {
      const haystack = [
        booking.id,
        booking.bookingNumber,
        booking.customerName,
        booking.customerPhone,
        booking.customerEmail,
        booking.serviceType,
        booking.address1,
        booking.city,
        booking.state,
        booking.zip,
        booking.dumpsterLabel,
        booking.dumpsterSize,
        booking.material,
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
      (b) => b.bookingStatus === "SCHEDULED",
    ).length;
    const quotes = bookings.filter((b) => b.bookingStatus === "QUOTE").length;
    const balanceDue = bookings
      .filter((b) =>
        ["UNPAID", "PENDING", "DEPOSIT_PAID", "FAILED"].includes(
          b.paymentStatus,
        ),
      )
      .reduce((sum, b) => sum + Number(b.total || 0), 0);

    return {
      active,
      scheduled,
      quotes,
      balanceDue,
    };
  }, [bookings]);

  async function handleSelectBooking(booking) {
    setSelectedBooking(booking);
    await fetchBookingDetail(booking.id);
  }

  async function handleCreateNote(body) {
    if (!selectedBooking?.id) return;

    try {
      setActionLoading(true);
      setError("");

      const response = await postAPI(
        `/client/bookings/${selectedBooking.id}/notes`,
        {
          body,
        },
      );

      const note = response.data?.note;

      if (note) {
        setSelectedBooking((prev) => ({
          ...prev,
          notes: [note, ...(prev?.notes ?? [])],
        }));
      }
    } catch (err) {
      console.error("Failed to create note:", err);
      setError("Failed to add note.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCreateChangeRequest(payload) {
    if (!selectedBooking?.id) return;

    try {
      setActionLoading(true);
      setError("");

      const response = await postAPI(
        `/client/bookings/${selectedBooking.id}/change-request`,
        payload,
      );

      const note = response.data?.changeRequest?.note;

      if (note) {
        setSelectedBooking((prev) => ({
          ...prev,
          notes: [note, ...(prev?.notes ?? [])],
        }));
      }
    } catch (err) {
      console.error("Failed to create change request:", err);
      setError("Failed to send change request.");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
          Client Portal
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-500">
          View your rentals, payment status, notes, and booking requests.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Active</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {summary.active}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Scheduled</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {summary.scheduled}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Quotes</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {summary.quotes}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Balance Due</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            ${summary.balanceDue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <BookingsListSection
          search={search}
          setSearch={setSearch}
          bookings={filteredBookings}
          selectedId={selectedBooking?.id}
          loading={loadingBookings}
          onSelectBooking={handleSelectBooking}
        />

        <BookingCardSection
          booking={selectedBooking}
          loading={loadingSelectedBooking}
          actionLoading={actionLoading}
          onCreateNote={handleCreateNote}
          onCreateChangeRequest={handleCreateChangeRequest}
        />
      </div>
    </div>
  );
}
