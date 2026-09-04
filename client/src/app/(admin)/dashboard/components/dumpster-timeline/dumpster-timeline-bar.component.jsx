"use client";

import { useRouter } from "next/navigation";

import {
  formatShortDate,
  getTimelinePosition,
} from "./dumpster-timeline.utils";

import {
  getDumpsterAccent,
  getSecondaryDumpsterAccent,
  getDumpsterPattern,
} from "../booking-calendar/booking-calendar.colors";

export default function DumpsterTimelineBar({
  booking,
  timelineStart,
  numberOfDays,
  focusedBookingId,
  setFocusedBookingId,
  routeBase = "/dashboard/bookings",
}) {
  const router = useRouter();

  const bookingId = booking?.id;
  const isFocused = focusedBookingId === bookingId;

  const accent = getDumpsterAccent(booking);
  const secondary = getSecondaryDumpsterAccent(booking);
  const pattern = getDumpsterPattern(booking);

  const position = getTimelinePosition({
    booking,
    timelineStart,
    numberOfDays,
  });

  if (!position) return null;

  function handleClick() {
    if (!bookingId) return;
    router.push(`${routeBase}/${bookingId}`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setFocusedBookingId?.(bookingId)}
      onMouseLeave={() => setFocusedBookingId?.(null)}
      className={`absolute top-3 h-10 min-w-10 overflow-hidden rounded-xl px-3 text-left text-xs shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md ${
        accent.bg
      } ${accent.text} ${
        isFocused
          ? `z-30 scale-[1.02] ring-2 ${accent.ring}`
          : "z-20 ring-gray-200"
      }`}
      style={{
        left: position.left,
        width: position.width,
      }}
      title={`${booking.bookingNumber || "Booking"} · ${formatShortDate(
        booking.deliveryDate,
      )} - ${formatShortDate(booking.pickupDate)}`}
    >
      {secondary && pattern === "STRIPE" ? (
        <span
          className={`absolute bottom-0 left-0 h-1.5 w-full ${secondary.stripe}`}
        />
      ) : null}

      {secondary && pattern === "SPLIT" ? (
        <span
          className={`absolute right-0 top-0 h-full w-2 ${secondary.stripe}`}
        />
      ) : null}

      <div className="relative flex h-full min-w-0 items-center gap-2">
        {position.startsBeforeTimeline ? (
          <span className="shrink-0 font-black">←</span>
        ) : null}

        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${accent.dot}`} />

        {secondary ? (
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${secondary.dot}`}
          />
        ) : null}

        <div className="min-w-0">
          <p className="truncate font-black">
            {booking.bookingNumber || "Booking"}
          </p>

          <p className="truncate text-[10px] opacity-80">
            {formatShortDate(booking.deliveryDate)} -{" "}
            {booking.pickupDateUnknown
              ? "TBD"
              : formatShortDate(booking.pickupDate)}
          </p>
        </div>

        {position.endsAfterTimeline ? (
          <span className="ml-auto shrink-0 font-black">→</span>
        ) : null}
      </div>
    </button>
  );
}
