"use client";

import StepShell from "../step-shell/step-shell.component";

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

function getDateInputValueFromDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTomorrowDateInputValue() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getDateInputValueFromDate(tomorrow);
}

function addDaysToDateInputValue(dateValue, days) {
  if (!dateValue) return "";

  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  date.setDate(date.getDate() + days);

  return getDateInputValueFromDate(date);
}

export default function StepSchedule({
  bookingForm,
  updateScheduleField,
  goToNextStep,
  goToPreviousStep,
  formErrors = {},
}) {
  const hasExtraDaysFee = bookingForm.schedule.extraDays > 0;
  const minDate = getTomorrowDateInputValue();

  function handleDeliveryDateChange(value) {
    updateScheduleField("schedule.deliveryDate", value);

    if (!bookingForm.schedule.unknownPickup && value) {
      const defaultPickupDate = addDaysToDateInputValue(value, 7);
      updateScheduleField("schedule.pickupDate", defaultPickupDate);
    }
  }

  function handlePickupDateChange(value) {
    updateScheduleField("schedule.pickupDate", value);
  }

  return (
    <StepShell
      title="Choose your dates"
      description="Pick your delivery date and expected pickup date."
      onNext={goToNextStep}
      onBack={goToPreviousStep}
      errors={formErrors}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Delivery Date
            </label>
            <Input
              type="date"
              min={minDate}
              value={bookingForm.schedule.deliveryDate}
              onChange={(e) => handleDeliveryDateChange(e.target.value)}
            />
            <p className="mt-2 text-xs text-gray-500">
              Online booking starts tomorrow. For same-day delivery, please call
              us.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Pickup Date
            </label>
            <Input
              type="date"
              min={bookingForm.schedule.deliveryDate || minDate}
              value={bookingForm.schedule.pickupDate}
              disabled={bookingForm.schedule.unknownPickup}
              onChange={(e) => handlePickupDateChange(e.target.value)}
            />
            <p className="mt-2 text-xs text-gray-500">
              Pickup is automatically set 7 days after delivery, but you can
              change it.
            </p>
          </div>
        </div>

        {/* <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={bookingForm.schedule.unknownPickup}
            onChange={(e) =>
              updateScheduleField("schedule.unknownPickup", e.target.checked)
            }
            className="mt-1 h-5 w-5"
          />
          <div>
            <p className="font-medium text-gray-900">I don't know pickup yet</p>
            <p className="mt-1 text-sm text-gray-500">
              You can leave pickup open-ended for now.
            </p>
          </div>
        </label> */}

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

        {hasExtraDaysFee && !bookingForm.schedule.unknownPickup && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-semibold text-amber-800">
              Your rental is longer than 7 days
            </p>
            <p className="mt-1 text-sm text-amber-700">
              Additional time is billed at $25 per day after the first 7 days.
              That fee has been added to your total.
            </p>
          </div>
        )}
      </div>
    </StepShell>
  );
}
