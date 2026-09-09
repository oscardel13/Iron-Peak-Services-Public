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
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="flex min-h-dvh items-stretch justify-center sm:items-center sm:p-6">
        <div className="flex h-dvh w-full flex-col bg-white shadow-xl sm:h-auto sm:max-h-[calc(100dvh-3rem)] sm:max-w-6xl sm:overflow-hidden sm:rounded-3xl">
          <div className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                New Rental
              </p>
              <h2 className="text-lg font-bold text-gray-900">
                Book a Dumpster
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
              aria-label="Close booking modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <BookingFlow
              mode="modal"
              source={source}
              autoScroll
              onComplete={() => {
                // keep open for now, or redirect later
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
