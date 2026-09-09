export default function ScheduleAvailabilityNotice({
  selectedDeliveryAvailability,
  hasExtraDaysFee,
  unknownPickup,
}) {
  return (
    <>
      {selectedDeliveryAvailability?.isLimited ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-800">
            Limited availability for this delivery date
          </p>

          <p className="mt-1 text-sm text-amber-700">
            {selectedDeliveryAvailability.availableCount} rental
            {selectedDeliveryAvailability.availableCount === 1 ? "" : "s"} can
            start on this date, but only{" "}
            {selectedDeliveryAvailability.maxAvailableItemCount} can support up
            to {selectedDeliveryAvailability.maxAvailableDays} day
            {selectedDeliveryAvailability.maxAvailableDays === 1 ? "" : "s"}.
          </p>
        </div>
      ) : null}

      {hasExtraDaysFee && !unknownPickup ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-800">
            Your rental is longer than 7 days
          </p>
          <p className="mt-1 text-sm text-amber-700">
            Additional time is billed at $25 per day after the first 7 days.
            That fee has been added to your total.
          </p>
        </div>
      ) : null}
    </>
  );
}
