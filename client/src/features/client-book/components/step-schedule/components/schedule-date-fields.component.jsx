import { getPickupMaxDate } from "../utils/schedule-date.utils";

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 ${
        props.className || ""
      }`}
    />
  );
}

export default function ScheduleDateFields({
  bookingForm,
  minDate,
  selectedDeliveryAvailability,
  onDeliveryDateChange,
  onPickupDateChange,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Delivery Date
        </label>

        <Input
          type="date"
          min={minDate}
          value={bookingForm.schedule.deliveryDate}
          onChange={(e) => onDeliveryDateChange(e.target.value)}
        />

        <p className="mt-2 text-xs text-gray-500">
          Online booking starts tomorrow. For same-day delivery, please call us.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Pickup Date
        </label>

        <Input
          type="date"
          min={bookingForm.schedule.deliveryDate || minDate}
          max={getPickupMaxDate(
            bookingForm.schedule.deliveryDate,
            selectedDeliveryAvailability?.maxAvailableDays,
          )}
          value={bookingForm.schedule.pickupDate}
          disabled={
            bookingForm.schedule.unknownPickup ||
            !bookingForm.schedule.deliveryDate
          }
          onChange={(e) => onPickupDateChange(e.target.value)}
        />

        <div className="mt-2 space-y-1 text-xs text-gray-500">
          <p>
            Pickup is automatically set 7 days after delivery when available, or
            the max available date when availability is limited. You can choose
            an earlier pickup date.
          </p>

          {selectedDeliveryAvailability?.isLimited ? (
            <p className="font-medium text-amber-700">
              This delivery date only supports up to{" "}
              {selectedDeliveryAvailability.maxAvailableDays} day
              {selectedDeliveryAvailability.maxAvailableDays === 1
                ? ""
                : "s"}{" "}
              because of current availability.
            </p>
          ) : (
            <p>
              Rentals longer than 7 days add a $25/day surcharge after the
              included rental period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
