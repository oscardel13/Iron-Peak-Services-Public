function toDateOnly(value) {
  if (!value) return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;

    return new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      0,
      0,
      0,
      0,
    );
  }

  if (typeof value !== "string") return null;

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) return null;

  const [, year, month, day] = match;

  return new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
}

function addDays(date, days) {
  if (!date) return null;

  const next = new Date(date);
  next.setDate(next.getDate() + days);
  next.setHours(0, 0, 0, 0);

  return next;
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

function normalizeStatus(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function getBookingDumpsterId(booking) {
  return (
    booking.dumpsterId ||
    booking.dumpster?.id ||
    booking.productId ||
    booking.product?.id ||
    booking.inventoryId ||
    null
  );
}

function getRentalDaysFromBooking(booking) {
  const value =
    booking.rentalDays ||
    booking.rentalDaysIncluded ||
    booking.schedule?.rentalDays ||
    booking.schedule?.rentalDaysIncluded ||
    7;

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0) return 7;

  return numberValue;
}

function getBookingRange(booking) {
  const start = toDateOnly(
    booking.deliveryDate || booking.schedule?.deliveryDate,
  );

  if (!start) {
    return {
      start: null,
      end: null,
    };
  }

  const pickupDate = toDateOnly(
    booking.pickupDate || booking.schedule?.pickupDate,
  );

  /**
   * Important:
   * The pickup day should still count as unavailable.
   *
   * Example:
   * Delivery Sep 28
   * Pickup Oct 5
   *
   * Dumpster should be blocked Sep 28, 29, 30, Oct 1, 2, 3, 4, and Oct 5.
   * So the exclusive end becomes Oct 6.
   */
  const end = pickupDate
    ? addDays(pickupDate, 1)
    : addDays(start, getRentalDaysFromBooking(booking) + 1);

  return {
    start,
    end,
  };
}

function isBlockingBooking(booking) {
  const bookingStatus = normalizeStatus(
    booking.bookingStatus ||
      booking.status ||
      booking.orderStatus ||
      booking.reservationStatus,
  );

  const paymentStatus = normalizeStatus(booking.paymentStatus);

  const nonBlockingStatuses = new Set([
    "CANCELLED",
    "CANCELED",
    "COMPLETED",
    "REFUNDED",
    "FAILED",
    "EXPIRED",
    "VOID",
  ]);

  if (nonBlockingStatuses.has(bookingStatus)) return false;

  /**
   * Drafts, quotes, pending payment, scheduled, confirmed, active, etc.
   * should all block inventory.
   *
   * Payment status should not decide availability by itself.
   * A QUOTE/PENDING booking can still be holding that dumpster.
   */
  if (!bookingStatus && paymentStatus === "FAILED") return false;
  if (!bookingStatus && paymentStatus === "REFUNDED") return false;

  return true;
}

function isDumpsterRentable(dumpster) {
  const status = normalizeStatus(dumpster.status);

  if (dumpster.isActive === false) return false;

  if (status === "OUT_OF_SERVICE") return false;
  if (status === "MAINTENANCE") return false;

  return true;
}

export function isDumpsterAvailableForRange({
  dumpster,
  bookings = [],
  startDate,
  rentalDays = 1,
}) {
  const start = toDateOnly(startDate);

  /**
   * Requested range should also include the pickup day.
   *
   * If customer wants 7 rental days starting Sep 28,
   * we block through pickup day Oct 5.
   */
  const end = addDays(start, rentalDays + 1);

  if (!start || !end) return false;

  if (!isDumpsterRentable(dumpster)) return false;

  return !bookings.some((booking) => {
    if (!isBlockingBooking(booking)) return false;

    const bookingDumpsterId = getBookingDumpsterId(booking);

    if (!bookingDumpsterId) return false;
    if (bookingDumpsterId !== dumpster.id) return false;

    const bookingRange = getBookingRange(booking);

    if (!bookingRange.start || !bookingRange.end) return false;

    return rangesOverlap(start, end, bookingRange.start, bookingRange.end);
  });
}

export function getDateAvailability({
  date,
  dumpsters = [],
  bookings = [],
  preferredRentalDays = 7,
  maxScanDays = 30,
}) {
  const activeDumpsters = dumpsters.filter((dumpster) => {
    return isDumpsterRentable(dumpster);
  });

  const startableDumpsters = activeDumpsters.filter((dumpster) =>
    isDumpsterAvailableForRange({
      dumpster,
      bookings,
      startDate: date,
      rentalDays: 1,
    }),
  );

  const availableForPreferredDays = activeDumpsters.filter((dumpster) =>
    isDumpsterAvailableForRange({
      dumpster,
      bookings,
      startDate: date,
      rentalDays: preferredRentalDays,
    }),
  );

  let maxAvailableDays = 0;

  for (let days = 1; days <= maxScanDays; days += 1) {
    const hasAnyDumpster = activeDumpsters.some((dumpster) =>
      isDumpsterAvailableForRange({
        dumpster,
        bookings,
        startDate: date,
        rentalDays: days,
      }),
    );

    if (!hasAnyDumpster) break;

    maxAvailableDays = days;
  }

  const defaultRentalDays =
    maxAvailableDays >= preferredRentalDays
      ? preferredRentalDays
      : maxAvailableDays;

  return {
    date,

    isAvailable: startableDumpsters.length > 0,

    availableCount: startableDumpsters.length,
    preferredAvailableCount: availableForPreferredDays.length,

    availableItemIds: startableDumpsters.map((dumpster) => dumpster.id),

    maxAvailableDays,
    defaultRentalDays,

    hasFullPreferredAvailability: availableForPreferredDays.length > 0,

    isLimited:
      startableDumpsters.length > 0 && availableForPreferredDays.length === 0,
  };
}
