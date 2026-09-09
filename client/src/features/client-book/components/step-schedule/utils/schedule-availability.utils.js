import { addDaysToDate, getDateFromInputValue } from "./schedule-date.utils";

const BLOCKING_STATUSES = new Set([
  "DRAFT",
  "PENDING_PAYMENT",
  "SCHEDULED",
  "CONFIRMED",
  "ACTIVE",
  "IN_PROGRESS",
]);

function normalizeStatus(status = "") {
  return String(status).trim().toUpperCase();
}

function isBlockingBooking(booking) {
  const status = normalizeStatus(booking?.bookingStatus || booking?.status);

  if (!status) return true;

  return BLOCKING_STATUSES.has(status);
}

function getItemId(item) {
  return String(item?.id || item?.dumpsterId || item?.productId || "");
}

function getBookingItemId(booking) {
  return String(
    booking?.dumpsterId ||
      booking?.dumpster?.id ||
      booking?.productId ||
      booking?.selectedProductId ||
      booking?.product?.id ||
      "",
  );
}

function rangesOverlap(startA, endA, startB, endB) {
  if (!startA || !endA || !startB || !endB) return false;

  return startA < endB && startB < endA;
}

function getBookingStartDate(booking) {
  return getDateFromInputValue(
    booking?.deliveryDate ||
      booking?.schedule?.deliveryDate ||
      booking?.startDate ||
      "",
  );
}

function getBookingPickupDate(booking) {
  return getDateFromInputValue(
    booking?.pickupDate ||
      booking?.schedule?.pickupDate ||
      booking?.endDate ||
      "",
  );
}

function getBookingBlockedRange(booking) {
  const start = getBookingStartDate(booking);

  if (!start) {
    return {
      start: null,
      endExclusive: null,
    };
  }

  const pickupDate = getBookingPickupDate(booking);

  if (pickupDate) {
    return {
      start,
      // Pickup day is still blocked. Item is available the next day.
      endExclusive: addDaysToDate(pickupDate, 1),
    };
  }

  const fallbackDays =
    booking?.schedule?.rentalDays ||
    booking?.rentalDays ||
    booking?.rentalDaysIncluded ||
    7;

  return {
    start,
    endExclusive: addDaysToDate(start, fallbackDays + 1),
  };
}

function getRequestedBlockedRange(startDateValue, rentalDays) {
  const start = getDateFromInputValue(startDateValue);

  if (!start || !rentalDays || rentalDays <= 0) {
    return {
      start: null,
      endExclusive: null,
    };
  }

  return {
    start,
    // Requested pickup day is blocked too.
    endExclusive: addDaysToDate(start, rentalDays + 1),
  };
}

export function isItemAvailableForRange({
  item,
  bookings = [],
  startDateValue,
  days,
}) {
  const itemId = getItemId(item);

  if (!itemId) return false;

  const requestedRange = getRequestedBlockedRange(startDateValue, days);

  if (!requestedRange.start || !requestedRange.endExclusive) return false;

  return !bookings.some((booking) => {
    if (!isBlockingBooking(booking)) return false;

    const bookingItemId = getBookingItemId(booking);

    if (!bookingItemId || bookingItemId !== itemId) return false;

    const bookingRange = getBookingBlockedRange(booking);

    if (!bookingRange.start || !bookingRange.endExclusive) return false;

    return rangesOverlap(
      requestedRange.start,
      requestedRange.endExclusive,
      bookingRange.start,
      bookingRange.endExclusive,
    );
  });
}

export function getAvailableItemsForDate({
  items = [],
  bookings = [],
  dateValue,
  days,
}) {
  return items.filter((item) => {
    if (item?.isActive === false) return false;
    if (normalizeStatus(item?.status) === "OUT_OF_SERVICE") return false;
    if (normalizeStatus(item?.status) === "MAINTENANCE") return false;

    return isItemAvailableForRange({
      item,
      bookings,
      startDateValue: dateValue,
      days,
    });
  });
}

export function getDateAvailability({ items = [], bookings = [], dateValue }) {
  const activeItems = items.filter((item) => {
    if (item?.isActive === false) return false;
    if (normalizeStatus(item?.status) === "OUT_OF_SERVICE") return false;
    if (normalizeStatus(item?.status) === "MAINTENANCE") return false;

    return true;
  });

  const itemAvailability = activeItems.map((item) => {
    const itemId = getItemId(item);
    let maxDays = 0;

    for (let days = 1; days <= 30; days += 1) {
      const available = isItemAvailableForRange({
        item,
        bookings,
        startDateValue: dateValue,
        days,
      });

      if (!available) break;

      maxDays = days;
    }

    return {
      item,
      itemId,
      maxDays,
      canStart: maxDays > 0,
      canDoSevenDays: maxDays >= 7,
    };
  });

  const startableItems = itemAvailability.filter((entry) => entry.maxDays > 0);
  const sevenDayItems = itemAvailability.filter((entry) => entry.maxDays >= 7);

  const maxAvailableDays = startableItems.reduce((max, entry) => {
    return Math.max(max, entry.maxDays);
  }, 0);

  const defaultRentalDays = maxAvailableDays >= 7 ? 7 : maxAvailableDays;

  const availableForDefaultRental = itemAvailability.filter((entry) => {
    return defaultRentalDays > 0 && entry.maxDays >= defaultRentalDays;
  });

  return {
    isAvailable: availableForDefaultRental.length > 0,

    // Count for the exact range Step 2 will default to.
    availableCount: availableForDefaultRental.length,

    // Count that can start at all, even for fewer days.
    startableCount: startableItems.length,

    hasSevenDayAvailability: sevenDayItems.length > 0,
    sevenDayAvailableCount: sevenDayItems.length,

    maxAvailableDays,
    defaultRentalDays,

    isLimited: startableItems.length > 0 && sevenDayItems.length === 0,

    availableItems: availableForDefaultRental.map((entry) => entry.item),
    availableItemIds: availableForDefaultRental.map((entry) => entry.itemId),

    itemAvailability,
  };
}
