export function getDateInputValueFromDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDateFromInputValue(value) {
  if (!value) return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;

    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  const stringValue = String(value);

  const dateOnlyMatch = stringValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;

    const date = new Date(Number(year), Number(month) - 1, Number(day));
    date.setHours(0, 0, 0, 0);

    return date;
  }

  const fallbackDate = new Date(stringValue);

  if (Number.isNaN(fallbackDate.getTime())) return null;

  fallbackDate.setHours(0, 0, 0, 0);
  return fallbackDate;
}

export function addDaysToDate(date, days) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;

  const next = new Date(date);
  next.setDate(next.getDate() + days);
  next.setHours(0, 0, 0, 0);

  return next;
}

export function addDaysToDateInputValue(dateValue, days) {
  const date = getDateFromInputValue(dateValue);

  if (!date) return "";

  const next = addDaysToDate(date, days);

  return getDateInputValueFromDate(next);
}

export function getTomorrowDateInputValue() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return getDateInputValueFromDate(tomorrow);
}

export function getUpcomingDateOptions(days = 21) {
  const dates = [];
  const start = new Date();

  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);

  for (let index = 0; index < days; index += 1) {
    const date = addDaysToDate(start, index);

    dates.push({
      value: getDateInputValueFromDate(date),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      monthDay: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    });
  }

  return dates;
}

export function getRentalDays(deliveryDate, pickupDate) {
  const delivery = getDateFromInputValue(deliveryDate);
  const pickup = getDateFromInputValue(pickupDate);

  if (!delivery || !pickup) return 0;

  const diff = pickup.getTime() - delivery.getTime();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getPickupMaxDate(deliveryDate, maxAvailableDays) {
  if (!deliveryDate || !maxAvailableDays) return undefined;

  return addDaysToDateInputValue(deliveryDate, maxAvailableDays);
}
