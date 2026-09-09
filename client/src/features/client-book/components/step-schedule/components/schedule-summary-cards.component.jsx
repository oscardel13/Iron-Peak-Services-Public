export default function ScheduleSummaryCards({ bookingForm }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Rental Days</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {bookingForm.schedule.unknownPickup
            ? "—"
            : bookingForm.schedule.rentalDays || 0}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Extra Days</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {bookingForm.schedule.unknownPickup
            ? "—"
            : bookingForm.schedule.extraDays || 0}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Extra Days Fee</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          ${(bookingForm.pricing.extraDaysFee || 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
