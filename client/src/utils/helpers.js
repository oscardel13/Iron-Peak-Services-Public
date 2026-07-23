export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
};

export const formatDate = (value) => {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString();
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

export function getChangedFields(original, updated) {
  const changes = {};

  for (const key in updated) {
    const originalValue = original[key];
    const updatedValue = updated[key];

    // normalize Dates → strings
    const o =
      originalValue instanceof Date
        ? originalValue.toISOString()
        : originalValue;

    const u =
      updatedValue instanceof Date ? updatedValue.toISOString() : updatedValue;

    // simple deep compare fallback
    if (JSON.stringify(o) !== JSON.stringify(u)) {
      changes[key] = updatedValue;
    }
  }

  return changes;
}

export function getPhoneDigits(value) {
  return String(value || "")
    .replace(/\D/g, "")
    .slice(0, 10);
}

export function formatPhoneNumber(value) {
  const digits = getPhoneDigits(value);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
