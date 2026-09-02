export function formatDateKey(value) {
  if (!value) return null;

  if (typeof value === "string") {
    const datePart = value.split("T")[0];

    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatTime(value) {
  if (!value) return "Time TBD";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time TBD";
  }

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function startOfWeek(date) {
  const result = new Date(date);
  result.setDate(result.getDate() - result.getDay());
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getWeekDays(date) {
  const start = startOfWeek(date);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export function getMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();

  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - startDay);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

export function hasPriorityDelivery(booking) {
  return Boolean(booking.priorityDelivery);
}

export function getPriorityDeliveryLabel(booking) {
  if (!hasPriorityDelivery(booking)) return null;

  if (booking.deliveryTime) {
    return `Priority by ${formatTime(booking.deliveryTime)}`;
  }

  return "Priority delivery";
}

export function getBookingEventsForDate(bookings, date) {
  const dateKey = formatDateKey(date);
  const events = [];

  bookings.forEach((booking) => {
    const deliveryDateKey = formatDateKey(booking.deliveryDate);
    const pickupDateKey = formatDateKey(booking.pickupDate);

    if (deliveryDateKey === dateKey) {
      events.push({
        id: `${booking.id}-delivery`,
        bookingId: booking.id,
        type: "delivery",
        label: "Delivery",
        date: booking.deliveryDate,
        time: formatTime(booking.deliveryDate),
        dateKey: deliveryDateKey,
        relatedLabel: "Pickup",
        relatedDate: booking.pickupDate,
        relatedDateKey: pickupDateKey,
        booking,
      });
    }

    if (
      booking.pickupDate &&
      !booking.pickupDateUnknown &&
      pickupDateKey === dateKey
    ) {
      events.push({
        id: `${booking.id}-pickup`,
        bookingId: booking.id,
        type: "pickup",
        label: "Pickup",
        date: booking.pickupDate,
        time: formatTime(booking.pickupDate),
        dateKey: pickupDateKey,
        relatedLabel: "Delivered",
        relatedDate: booking.deliveryDate,
        relatedDateKey: deliveryDateKey,
        booking,
      });
    }
  });

  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}
