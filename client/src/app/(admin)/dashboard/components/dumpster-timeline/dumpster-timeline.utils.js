export function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function formatDateKey(value) {
  if (!value) return null;

  if (typeof value === "string") {
    const datePart = value.split("T")[0];

    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDefaultTimelineStart() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return addDays(today, -3);
}

export function getTimelineDays(startDate, numberOfDays) {
  const start = startOfDay(startDate);

  return Array.from({ length: numberOfDays }, (_, index) =>
    addDays(start, index),
  );
}

export function formatTimelineDay(date) {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatShortDate(value) {
  if (!value) return "TBD";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "TBD";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function getDumpsterId(booking) {
  return booking?.dumpsterId || booking?.dumpster?.id || null;
}

export function getDumpsterLabel(dumpster) {
  return (
    dumpster?.label ||
    dumpster?.dumpsterLabel ||
    dumpster?.sizeLabel ||
    `${dumpster?.size || "—"} Yard Dumpster`
  );
}

export function getBookingTimelineRange(booking) {
  if (!booking?.deliveryDate) return null;

  const start = startOfDay(booking.deliveryDate);

  let end;

  if (booking.pickupDateUnknown) {
    end = addDays(start, Number(booking.rentalDaysIncluded || 7));
  } else if (booking.pickupDate) {
    end = startOfDay(booking.pickupDate);
  } else {
    end = addDays(start, Number(booking.rentalDaysIncluded || 7));
  }

  if (end < start) {
    end = start;
  }

  return { start, end };
}

export function doesBookingOverlapTimeline(
  booking,
  timelineStart,
  timelineEnd,
) {
  const range = getBookingTimelineRange(booking);

  if (!range) return false;

  return range.start <= timelineEnd && range.end >= timelineStart;
}

export function getBookingsForDumpster(bookings, dumpsterId) {
  return bookings.filter((booking) => getDumpsterId(booking) === dumpsterId);
}

export function getTimelinePosition({ booking, timelineStart, numberOfDays }) {
  const range = getBookingTimelineRange(booking);

  if (!range) return null;

  const timelineEnd = addDays(timelineStart, numberOfDays - 1);

  if (!doesBookingOverlapTimeline(booking, timelineStart, timelineEnd)) {
    return null;
  }

  const visibleStart =
    range.start < timelineStart ? timelineStart : range.start;
  const visibleEnd = range.end > timelineEnd ? timelineEnd : range.end;

  const startOffsetDays = Math.max(
    0,
    Math.round((visibleStart - timelineStart) / 86400000),
  );

  const durationDays = Math.round((visibleEnd - visibleStart) / 86400000) + 1;

  return {
    left: `${(startOffsetDays / numberOfDays) * 100}%`,
    width: `${Math.max((durationDays / numberOfDays) * 100, 2)}%`,
    startsBeforeTimeline: range.start < timelineStart,
    endsAfterTimeline: range.end > timelineEnd,
  };
}

export function normalizeBookingsResponse(response) {
  if (Array.isArray(response?.data)) return response.data;

  return (
    response?.data?.bookings ||
    response?.data?.data ||
    response?.data?.results ||
    []
  );
}

export function normalizeInventoryResponse(response) {
  if (Array.isArray(response?.data)) return response.data;

  return response?.data?.dumpsters || response?.data?.inventory || [];
}

export function getShortDumpsterLabel(dumpster) {
  const size = dumpster?.size || dumpster?.sizeLabel?.replace(/\D/g, "");
  const label = dumpster?.label || "";

  const numberMatch = label.match(/#\s*(\d+)/);
  const number = numberMatch?.[1];

  if (size && number) {
    return `${size}Y #${number}`;
  }

  if (number) {
    return `#${number}`;
  }

  if (size) {
    return `${size}Y`;
  }

  return dumpster?.serialNumber || dumpster?.id || "Dumpster";
}
