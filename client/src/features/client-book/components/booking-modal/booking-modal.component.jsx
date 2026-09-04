"use client";

import { X } from "lucide-react";

import BookingFlow from "../booking-flow/booking-flow.component";

export default function BookingModal({
  open,
  onClose,
  source = "client-dashboard",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-3 sm:p-6">
      <div className="mx-auto flex min-h-full max-w-6xl items-start justify-center">
        <div className="relative w-full overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
                New Rental
              </p>
              <h2 className="text-lg font-semibold text-gray-900">
                Book a Dumpster
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50"
              aria-label="Close booking modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-3 sm:p-5">
            <BookingFlow
              mode="modal"
              source={source}
              autoScroll={false}
              onComplete={() => {
                // Keep modal open after payment success so user can see confirmation.
                // You can close here later if preferred.
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
