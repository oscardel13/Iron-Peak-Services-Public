"use client";

import Link from "next/link";

function formatDate(value) {
  if (!value) return "Not scheduled";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateKey(value) {
  if (!value) return null;

  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getBookingStatusLabel(status) {
  const labels = {
    QUOTE: "Quote",
    SCHEDULED: "Scheduled",
    ACTIVE: "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  return labels[status] || status || "Unknown";
}

function getBookingStatusClasses(status) {
  const classes = {
    QUOTE: "border-amber-200 bg-amber-50 text-amber-700",
    SCHEDULED: "border-blue-200 bg-blue-50 text-blue-700",
    ACTIVE: "border-green-200 bg-green-50 text-green-700",
    COMPLETED: "border-gray-200 bg-gray-50 text-gray-700",
    CANCELLED: "border-red-200 bg-red-50 text-red-700",
  };

  return classes[status] || "border-gray-200 bg-gray-50 text-gray-700";
}

function BookingStatusPill({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getBookingStatusClasses(
        status,
      )}`}
    >
      {getBookingStatusLabel(status)}
    </span>
  );
}

function getBookingTimingLabel(booking) {
  const todayKey = formatDateKey(new Date());
  const deliveryKey = formatDateKey(booking.deliveryDate);
  const pickupKey = formatDateKey(booking.pickupDate);

  if (booking.bookingStatus === "ACTIVE") {
    return "Currently active";
  }

  if (deliveryKey === todayKey) {
    return "Delivery today";
  }

  if (pickupKey === todayKey) {
    return "Pickup today";
  }

  if (booking.bookingStatus === "SCHEDULED") {
    return `Delivery ${formatDate(booking.deliveryDate)}`;
  }

  if (booking.bookingStatus === "QUOTE") {
    return "Quote pending";
  }

  return formatDate(booking.deliveryDate);
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
      <p className="font-semibold text-gray-900">No current bookings</p>
      <p className="mt-1 text-sm text-gray-500">
        When you book a dumpster, your active and upcoming rentals will appear
        here.
      </p>

      <Link
        href="/book"
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover"
      >
        Book a new dumpster
      </Link>
    </div>
  );
}

function BookingRow({ booking }) {
  return (
    <Link
      href={`/client/bookings/${booking.id}`}
      className="block rounded-2xl border border-gray-200 p-4 transition hover:border-brand-primary/40 hover:bg-gray-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-gray-900">
              {booking.bookingNumber}
            </p>
            <BookingStatusPill status={booking.bookingStatus} />
          </div>

          <p className="mt-2 text-sm text-gray-500">
            {booking.dumpsterLabel || "Dumpster rental"}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {booking.address1}
            {booking.city ? `, ${booking.city}` : ""}
            {booking.state ? `, ${booking.state}` : ""}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-gray-900">
            {getBookingTimingLabel(booking)}
          </p>

          {booking.pickupDate && !booking.pickupDateUnknown ? (
            <p className="mt-1 text-xs text-gray-500">
              Pickup {formatDate(booking.pickupDate)}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Pickup TBD</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function DashboardUpcomingCurrent({ bookings = [] }) {
  const activeBookings = bookings.filter(
    (booking) => booking.bookingStatus === "ACTIVE",
  );

  const scheduledBookings = bookings.filter(
    (booking) => booking.bookingStatus === "SCHEDULED",
  );

  const quoteBookings = bookings.filter(
    (booking) => booking.bookingStatus === "QUOTE",
  );

  const currentAndUpcomingBookings = [
    ...activeBookings,
    ...scheduledBookings,
    ...quoteBookings,
  ]
    .sort((a, b) => {
      const aDate = new Date(a.deliveryDate || a.createdAt);
      const bDate = new Date(b.deliveryDate || b.createdAt);

      return aDate - bDate;
    })
    .slice(0, 5);

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-gray-900">
            Current & Upcoming
          </p>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">
            Your rentals
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track active rentals, scheduled deliveries, and pending quotes.
          </p>
        </div>

        <Link
          href="/client/bookings"
          className="shrink-0 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          View all
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-gray-950 p-4 text-white">
          <p className="text-sm text-gray-300">Active</p>
          <p className="mt-2 text-2xl font-bold">{activeBookings.length}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Scheduled</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {scheduledBookings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Quotes</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {quoteBookings.length}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {currentAndUpcomingBookings.length > 0 ? (
          currentAndUpcomingBookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
