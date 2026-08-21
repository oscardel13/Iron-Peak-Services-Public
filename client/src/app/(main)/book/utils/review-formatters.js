export function formatLabel(value) {
  if (!value) return "";

  return String(value)
    .split("-")
    .join("_")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export function formatDate(value) {
  if (!value) return "";

  if (typeof value === "string") {
    return value.split("T")[0];
  }

  return value.toISOString().split("T")[0];
}

export function getDistanceFromWarehouse(address) {
  return address.distanceFromWarehouse ?? null;
}

export function getServerOrFormPrice(serverBooking, bookingForm, field) {
  return serverBooking?.[field] ?? bookingForm.pricing[field] ?? 0;
}

export function getServerOrFormTotal(serverBooking, bookingForm) {
  return serverBooking?.total ?? bookingForm.pricing.total ?? 0;
}
