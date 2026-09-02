export const DUMPSTER_COLOR_STYLES = {
  BLUE: {
    border: "border-l-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-500/30",
    dot: "bg-blue-500",
    stripe: "bg-blue-500",
  },
  EMERALD: {
    border: "border-l-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-500/30",
    dot: "bg-emerald-500",
    stripe: "bg-emerald-500",
  },
  VIOLET: {
    border: "border-l-violet-500",
    bg: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-500/30",
    dot: "bg-violet-500",
    stripe: "bg-violet-500",
  },
  ORANGE: {
    border: "border-l-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-700",
    ring: "ring-orange-500/30",
    dot: "bg-orange-500",
    stripe: "bg-orange-500",
  },
  ROSE: {
    border: "border-l-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-500/30",
    dot: "bg-rose-500",
    stripe: "bg-rose-500",
  },
  CYAN: {
    border: "border-l-cyan-500",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    ring: "ring-cyan-500/30",
    dot: "bg-cyan-500",
    stripe: "bg-cyan-500",
  },
  AMBER: {
    border: "border-l-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-500/30",
    dot: "bg-amber-500",
    stripe: "bg-amber-500",
  },
  FUCHSIA: {
    border: "border-l-fuchsia-500",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
    ring: "ring-fuchsia-500/30",
    dot: "bg-fuchsia-500",
    stripe: "bg-fuchsia-500",
  },
  INDIGO: {
    border: "border-l-indigo-500",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-500/30",
    dot: "bg-indigo-500",
    stripe: "bg-indigo-500",
  },
  TEAL: {
    border: "border-l-teal-500",
    bg: "bg-teal-50",
    text: "text-teal-700",
    ring: "ring-teal-500/30",
    dot: "bg-teal-500",
    stripe: "bg-teal-500",
  },
  LIME: {
    border: "border-l-lime-500",
    bg: "bg-lime-50",
    text: "text-lime-700",
    ring: "ring-lime-500/30",
    dot: "bg-lime-500",
    stripe: "bg-lime-500",
  },
  PINK: {
    border: "border-l-pink-500",
    bg: "bg-pink-50",
    text: "text-pink-700",
    ring: "ring-pink-500/30",
    dot: "bg-pink-500",
    stripe: "bg-pink-500",
  },
  SLATE: {
    border: "border-l-slate-500",
    bg: "bg-slate-50",
    text: "text-slate-700",
    ring: "ring-slate-500/30",
    dot: "bg-slate-500",
    stripe: "bg-slate-500",
  },
};

export function normalizeDumpsterColor(value) {
  if (!value) return "SLATE";
  return String(value).trim().toUpperCase();
}

export function getDumpsterPrimaryColor(bookingOrDumpster) {
  return normalizeDumpsterColor(
    bookingOrDumpster?.primaryColor ||
      bookingOrDumpster?.dumpsterPrimaryColor ||
      bookingOrDumpster?.dumpster?.primaryColor ||
      bookingOrDumpster?.color ||
      bookingOrDumpster?.dumpster?.color ||
      "SLATE",
  );
}

export function getDumpsterSecondaryColor(bookingOrDumpster) {
  const value =
    bookingOrDumpster?.secondaryColor ||
    bookingOrDumpster?.dumpsterSecondaryColor ||
    bookingOrDumpster?.dumpster?.secondaryColor;

  if (!value) return null;

  return normalizeDumpsterColor(value);
}

export function getDumpsterPattern(bookingOrDumpster) {
  return String(
    bookingOrDumpster?.colorPattern ||
      bookingOrDumpster?.dumpsterColorPattern ||
      bookingOrDumpster?.dumpster?.colorPattern ||
      "SOLID",
  )
    .trim()
    .toUpperCase();
}

export function getDumpsterAccent(bookingOrDumpster) {
  const primaryColor = getDumpsterPrimaryColor(bookingOrDumpster);
  return DUMPSTER_COLOR_STYLES[primaryColor] || DUMPSTER_COLOR_STYLES.SLATE;
}

export function getSecondaryDumpsterAccent(bookingOrDumpster) {
  const secondaryColor = getDumpsterSecondaryColor(bookingOrDumpster);

  if (!secondaryColor) return null;

  return DUMPSTER_COLOR_STYLES[secondaryColor] || null;
}

export function getDumpsterLabel(bookingOrDumpster) {
  return (
    bookingOrDumpster?.dumpsterLabel ||
    bookingOrDumpster?.label ||
    bookingOrDumpster?.dumpster?.label ||
    `${bookingOrDumpster?.dumpsterSize || bookingOrDumpster?.size || "—"} Yard Dumpster`
  );
}
