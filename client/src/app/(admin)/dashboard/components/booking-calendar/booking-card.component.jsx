"use client";

import { useRouter } from "next/navigation";

import {
  getDumpsterAccent,
  getDumpsterLabel,
  getDumpsterPattern,
  getSecondaryDumpsterAccent,
} from "./booking-calendar.colors";

function formatShortDate(value) {
  if (!value) return "TBD";

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatStatus(value) {
  if (!value) return null;

  return String(value).toLowerCase().replaceAll("_", " ");
}

function formatAddress(booking) {
  return [booking?.address1, booking?.city, booking?.state, booking?.zip]
    .filter(Boolean)
    .join(", ");
}

function getDirectionsUrl(booking) {
  const address = formatAddress(booking);

  if (!address) return null;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;
}

function getEventStyles(type) {
  if (type === "delivery") {
    return {
      label: "Delivery today",
      shortLabel: "Delivery",
      chip: "bg-blue-100 text-blue-700 ring-blue-200",
      panel: "border-blue-200 bg-blue-50/60",
      dot: "bg-blue-500",
      text: "text-blue-700",
      actionLabel: "Mark delivered",
    };
  }

  if (type === "pickup") {
    return {
      label: "Pickup today",
      shortLabel: "Pickup",
      chip: "bg-green-100 text-green-700 ring-green-200",
      panel: "border-green-200 bg-green-50/60",
      dot: "bg-green-500",
      text: "text-green-700",
      actionLabel: "Mark picked up",
    };
  }

  return {
    label: "Scheduled today",
    shortLabel: "Event",
    chip: "bg-gray-100 text-gray-700 ring-gray-200",
    panel: "border-gray-200 bg-gray-50",
    dot: "bg-gray-500",
    text: "text-gray-700",
    actionLabel: null,
  };
}

function DumpsterBadge({ booking }) {
  const primary = getDumpsterAccent(booking);
  const secondary = getSecondaryDumpsterAccent(booking);
  const pattern = getDumpsterPattern(booking);
  const label = getDumpsterLabel(booking);

  return (
    <span
      className={`relative inline-flex max-w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-full px-2.5 py-1 text-xs font-bold ${primary.bg} ${primary.text}`}
    >
      {secondary && pattern === "STRIPE" ? (
        <span
          className={`absolute bottom-0 left-0 h-1 w-full ${secondary.stripe}`}
        />
      ) : null}

      {secondary && pattern === "SPLIT" ? (
        <span
          className={`absolute right-0 top-0 h-full w-2 ${secondary.stripe}`}
        />
      ) : null}

      <span
        className={`relative h-2 w-2 shrink-0 rounded-full ${primary.dot}`}
      />

      {secondary ? (
        <span
          className={`relative h-2 w-2 shrink-0 rounded-full ${secondary.dot}`}
        />
      ) : null}

      <span className="relative min-w-0 truncate">{label}</span>
    </span>
  );
}

function StatusPill({ value }) {
  if (!value) return null;

  return (
    <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium capitalize text-gray-700 ring-1 ring-gray-200">
      {formatStatus(value)}
    </span>
  );
}

function DateBlock({ label, date, active }) {
  return (
    <div
      className={`min-w-0 rounded-2xl px-4 py-3 ${
        active ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <p
        className={`text-xs font-bold uppercase tracking-wide ${
          active ? "text-white/70" : "text-gray-500"
        }`}
      >
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold">
        {date ? formatShortDate(date) : "TBD"}
      </p>

      {active ? (
        <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-white/70">
          This day
        </p>
      ) : null}
    </div>
  );
}

function TodayEventPanel({ event, onMarkDelivered, onMarkPickedUp }) {
  const booking = event.booking;
  const styles = getEventStyles(event.type);

  const canMarkDelivered = event.type === "delivery" && onMarkDelivered;
  const canMarkPickedUp = event.type === "pickup" && onMarkPickedUp;
  const canMarkComplete = canMarkDelivered || canMarkPickedUp;

  async function handleAction(e) {
    e.stopPropagation();

    if (event.type === "delivery") {
      await onMarkDelivered?.(booking?.id || event.bookingId);
      return;
    }

    if (event.type === "pickup") {
      await onMarkPickedUp?.(booking?.id || event.bookingId);
    }
  }

  return (
    <div
      className={`min-w-0 rounded-2xl border p-4 ${styles.panel}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`h-3 w-3 shrink-0 rounded-full ${styles.dot}`} />

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles.chip}`}
          >
            {styles.label}
          </span>
        </div>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-900 ring-1 ring-gray-200">
          {event.time}
        </span>
      </div>

      <div className="mt-3 flex min-w-0 items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm font-semibold text-gray-800">
          {styles.shortLabel} scheduled for this selected day.
        </p>

        {canMarkComplete ? (
          <button
            type="button"
            onClick={handleAction}
            className="shrink-0 rounded-xl bg-gray-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-gray-800"
          >
            {styles.actionLabel}
          </button>
        ) : (
          <span className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-gray-500 ring-1 ring-gray-200">
            Action later
          </span>
        )}
      </div>
    </div>
  );
}

export default function BookingCard({
  group,
  focusedBookingId,
  setFocusedBookingId,
  onMarkDelivered,
  onMarkPickedUp,
}) {
  const router = useRouter();

  const booking = group.booking;
  const bookingId = group.bookingId || booking?.id;

  const accent = getDumpsterAccent(booking);
  const isFocused = focusedBookingId === bookingId;

  const deliveryEvent = group.events.find((event) => event.type === "delivery");
  const pickupEvent = group.events.find((event) => event.type === "pickup");

  const activeEvents = group.events;
  const directionsUrl = getDirectionsUrl(booking);

  function handleOpenBooking() {
    if (!bookingId) return;
    router.push(`/dashboard/bookings/${bookingId}`);
  }

  function handleKeyDown(e) {
    if (e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    handleOpenBooking();
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={handleOpenBooking}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setFocusedBookingId?.(bookingId)}
      onMouseLeave={() => setFocusedBookingId?.(null)}
      className={`min-w-0 cursor-pointer overflow-hidden rounded-3xl border border-gray-200 border-l-4 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        accent.border
      } ${isFocused ? `ring-2 ${accent.ring}` : ""}`}
    >
      <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-gray-900">
            {booking?.bookingNumber || "Booking"}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <StatusPill value={booking?.bookingStatus} />
            <StatusPill value={booking?.paymentStatus} />
          </div>
        </div>

        <div className="min-w-0 max-w-[55%] shrink">
          <DumpsterBadge booking={booking} />
        </div>
      </div>

      <div className="mb-4 grid min-w-0 gap-2 sm:grid-cols-2">
        <DateBlock
          label="Delivery"
          date={booking?.deliveryDate}
          active={Boolean(deliveryEvent)}
        />

        <DateBlock
          label="Pickup"
          date={booking?.pickupDateUnknown ? null : booking?.pickupDate}
          active={Boolean(pickupEvent)}
        />
      </div>

      <div className="mb-4 rounded-2xl bg-gray-50 px-4 py-3">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {booking?.customerName || "Customer not listed"}
            </p>

            {formatAddress(booking) ? (
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                {formatAddress(booking)}
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-400">Address not listed</p>
            )}
          </div>

          {directionsUrl ? (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 rounded-xl bg-white px-3 py-2 text-center text-xs font-bold text-gray-800 ring-1 ring-gray-200 transition hover:bg-gray-100"
            >
              Directions
            </a>
          ) : null}
        </div>
      </div>

      <div className="min-w-0 space-y-3">
        {activeEvents.map((event) => (
          <TodayEventPanel
            key={event.id}
            event={event}
            onMarkDelivered={onMarkDelivered}
            onMarkPickedUp={onMarkPickedUp}
          />
        ))}
      </div>
    </article>
  );
}
