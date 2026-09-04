"use client";

import BookingSummaryCard from "../booking-summary-card/booking-summary-card.component";

export default function BookingMobileSummarySheet({
  open,
  onClose,
  bookingForm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close summary"
      />

      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-[#f7f7f7] p-4">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-gray-300" />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Booking Summary</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
          >
            Close
          </button>
        </div>

        <BookingSummaryCard bookingForm={bookingForm} />
      </div>
    </div>
  );
}