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

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 ${
        props.className || ""
      }`}
    />
  );
}

export default function StepVerifyLocation({
  bookingForm,
  updateBookingForm,
  goToNextStep,
  goToPreviousStep,
}) {
  return (
    <StepShell
      title="Verify dumpster location"
      description="Confirm where the dumpster should go and share any delivery notes."
      onNext={goToNextStep}
      onBack={goToPreviousStep}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Delivery Address</p>
          <p className="mt-2 text-base font-medium text-gray-900">
            {bookingForm.address.fullAddress || "No address selected yet"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => updateBookingForm("location.placement", "driveway")}
            className={`rounded-2xl border p-4 text-left transition ${
              bookingForm.location.placement === "driveway"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <p className="font-semibold">Driveway</p>
            <p className="mt-1 text-sm opacity-80">
              Most common for residential delivery.
            </p>
          </button>

          <button
            type="button"
            onClick={() => updateBookingForm("location.placement", "street")}
            className={`rounded-2xl border p-4 text-left transition ${
              bookingForm.location.placement === "street"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <p className="font-semibold">Street</p>
            <p className="mt-1 text-sm opacity-80">
              Usually requires permit depending on city.
            </p>
          </button>

          <button
            type="button"
            onClick={() => updateBookingForm("location.placement", "alley")}
            className={`rounded-2xl border p-4 text-left transition ${
              bookingForm.location.placement === "alley"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <p className="font-semibold">Alley</p>
            <p className="mt-1 text-sm opacity-80">
              Good for rear access properties.
            </p>
          </button>

          <button
            type="button"
            onClick={() => updateBookingForm("location.placement", "other")}
            className={`rounded-2xl border p-4 text-left transition ${
              bookingForm.location.placement === "other"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <p className="font-semibold">Other</p>
            <p className="mt-1 text-sm opacity-80">
              Use notes below to explain placement.
            </p>
          </button>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Placement Details / Instructions
          </label>
          <Textarea
            rows={5}
            placeholder="Example: Place on left side of driveway near garage. Gate will be open."
            value={bookingForm.location.instructions}
            onChange={(e) =>
              updateBookingForm("location.instructions", e.target.value)
            }
          />
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4">
          <input
            type="checkbox"
            checked={bookingForm.location.verified}
            onChange={(e) =>
              updateBookingForm("location.verified", e.target.checked)
            }
            className="mt-1 h-5 w-5"
          />
          <div>
            <p className="font-medium text-gray-900">
              I confirm the dumpster location details are correct
            </p>
            <p className="mt-1 text-sm text-gray-500">
              This helps avoid delivery issues and delays.
            </p>
          </div>
        </label>

        {bookingForm.location.placement === "street" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-semibold text-amber-800">Street placement notice</p>
            <p className="mt-1 text-sm text-amber-700">
              Street placement may require a permit depending on the city and exact
              location.
            </p>
          </div>
        )}
      </div>
    </StepShell>
  );
}