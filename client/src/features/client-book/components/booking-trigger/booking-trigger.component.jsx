"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import BookingModal from "../booking-modal/booking-modal.component";

export default function BookingTrigger({
  label = "Book New Dumpster",
  source = "client-dashboard",
  className = "",
  variant = "primary",
  children,
}) {
  const [open, setOpen] = useState(false);

  const buttonClasses =
    variant === "unstyled"
      ? className
      : variant === "secondary"
        ? `inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 ${className}`
        : `inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 ${className}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClasses}
      >
        {children ? (
          children
        ) : (
          <>
            <Plus className="h-4 w-4" />
            {label}
          </>
        )}
      </button>

      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        source={source}
      />
    </>
  );
}
