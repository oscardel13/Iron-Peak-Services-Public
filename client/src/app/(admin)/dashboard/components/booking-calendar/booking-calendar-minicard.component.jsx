"use client";

import { useRouter } from "next/navigation";

import { hasPriorityDelivery } from "./booking-calendar.utils";

import {
  getDumpsterAccent,
  getDumpsterLabel,
  getDumpsterPattern,
  getSecondaryDumpsterAccent,
} from "./booking-calendar.colors";

function getEventTypeClasses(type) {
  if (type === "delivery") {
    return "bg-blue-50 text-blue-700 border-blue-100";
  }

  if (type === "pickup") {
    return "bg-green-50 text-green-700 border-green-100";
  }

  return "bg-gray-50 text-gray-700 border-gray-100";
}

function formatShortDate(value) {
  if (!value) return "TBD";

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function MiniDumpsterMarker({ booking, isSelected }) {
  const primary = getDumpsterAccent(booking);
  const secondary = getSecondaryDumpsterAccent(booking);
  const pattern = getDumpsterPattern(booking);

  return (
    <span className="relative flex shrink-0 items-center gap-1">
      <span className={`h-2 w-2 rounded-full ${primary.dot}`} />

      {secondary ? (
        <span className={`h-2 w-2 rounded-full ${secondary.dot}`} />
      ) : null}

      {secondary && pattern === "STRIPE" ? (
        <span
          className={`absolute -bottom-1 left-0 h-0.5 w-full rounded-full ${secondary.stripe}`}
        />
      ) : null}

      {secondary && pattern === "SPLIT" ? (
        <span
          className={`absolute -right-0.5 -top-0.5 h-2 w-1 rounded-r-full ${secondary.stripe}`}
        />
      ) : null}

      {secondary && pattern === "DOT" ? (
        <span
          className={`absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full ring-1 ${
            isSelected ? "ring-white/40" : "ring-white"
          } ${secondary.dot}`}
        />
      ) : null}
    </span>
  );
}

export default function MiniCalendarEvent({
  event,
  isSelected,
  focusedBookingId,
  setFocusedBookingId,
}) {
  const router = useRouter();

  const booking = event.booking;
  const bookingId = event.bookingId || booking?.id;

  const primary = getDumpsterAccent(booking);
  const secondary = getSecondaryDumpsterAccent(booking);
  const pattern = getDumpsterPattern(booking);
  const dumpsterLabel = getDumpsterLabel(booking);

  const isFocused = focusedBookingId && focusedBookingId === bookingId;

  const isPriorityDelivery =
    event.type === "delivery" && hasPriorityDelivery(booking);

  const relatedDateLabel = event.relatedDate
    ? formatShortDate(event.relatedDate)
    : "TBD";

  const shortEventLabel = event.type === "delivery" ? "D" : "P";

  function handleClick(e) {
    e.stopPropagation();

    if (!bookingId) return;

    router.push(`/client/bookings/${bookingId}`);
  }

  function handleKeyDown(e) {
    if (e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    e.stopPropagation();

    if (!bookingId) return;

    router.push(`/client/bookings/${bookingId}`);
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setFocusedBookingId?.(bookingId)}
      onMouseLeave={() => setFocusedBookingId?.(null)}
      className={`relative min-w-0 cursor-pointer overflow-hidden rounded-xl border-l-4 px-2.5 py-2 text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${primary.border} ${
        isSelected
          ? "border border-white/30 bg-white/90 text-gray-900"
          : "border border-gray-100 bg-white text-gray-800 hover:bg-gray-50"
      } ${isFocused ? `ring-2 ${primary.ring} scale-[1.02]` : ""}`}
      title={`Open ${booking?.bookingNumber || "booking"}`}
    >
      {secondary && pattern === "STRIPE" ? (
        <div
          className={`absolute bottom-0 left-0 h-1 w-full ${secondary.stripe}`}
        />
      ) : null}

      {secondary && pattern === "SPLIT" ? (
        <div
          className={`absolute right-0 top-0 h-full w-1.5 ${secondary.stripe}`}
        />
      ) : null}

      <div className="relative min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <MiniDumpsterMarker booking={booking} isSelected={isSelected} />

          <span
            className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getEventTypeClasses(
              event.type,
            )}`}
          >
            <span className="hidden 2xl:inline">{event.label}</span>
            <span className="2xl:hidden">{shortEventLabel}</span>
          </span>

          {isPriorityDelivery ? (
            <span className="shrink-0" title="Priority delivery">
              ⚡
            </span>
          ) : null}

          <span className="ml-auto shrink-0 text-[11px] font-bold text-gray-900">
            {event.time}
          </span>
        </div>

        <div className="mt-1.5 min-w-0">
          <p className="truncate font-bold text-gray-900">
            {booking?.bookingNumber || "Booking"}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-gray-500">
            {dumpsterLabel}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-gray-500">
            <span className="hidden 2xl:inline">{event.relatedLabel}: </span>
            <span className="2xl:hidden">
              {event.relatedLabel === "Pickup" ? "P" : "D"}:{" "}
            </span>
            {relatedDateLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
