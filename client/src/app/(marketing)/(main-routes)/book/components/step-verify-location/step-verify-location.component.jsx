"use client";

import StepShell from "../step-shell/step-shell.component";

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

function PlacementButton({
  value,
  title,
  description,
  selectedValue,
  onSelect,
}) {
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`rounded-2xl border p-4 text-left transition ${
        isSelected
          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
          : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm opacity-80">{description}</p>
    </button>
  );
}

export default function StepVerifyLocation({
  bookingForm,
  updateBookingForm,
  goToNextStep,
  goToPreviousStep,
  formErrors = {},
}) {
  return (
    <StepShell
      title="Verify dumpster location"
      description="Confirm where the dumpster should go and share any delivery notes."
      onNext={goToNextStep}
      onBack={goToPreviousStep}
      errors={formErrors}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Delivery Address</p>
          <p className="mt-2 text-base font-medium text-gray-900">
            {bookingForm.address.fullAddress || "No address selected yet"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <PlacementButton
            value="driveway"
            title="Driveway"
            description="Most common for residential delivery."
            selectedValue={bookingForm.location.placement}
            onSelect={(value) => updateBookingForm("location.placement", value)}
          />

          <PlacementButton
            value="street"
            title="Street"
            description="Usually requires permit depending on city."
            selectedValue={bookingForm.location.placement}
            onSelect={(value) => updateBookingForm("location.placement", value)}
          />

          <PlacementButton
            value="alley"
            title="Alley"
            description="Good for rear access properties."
            selectedValue={bookingForm.location.placement}
            onSelect={(value) => updateBookingForm("location.placement", value)}
          />

          <PlacementButton
            value="other"
            title="Other"
            description="Use notes below to explain placement."
            selectedValue={bookingForm.location.placement}
            onSelect={(value) => updateBookingForm("location.placement", value)}
          />
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
            <p className="font-semibold text-amber-800">
              Street placement notice
            </p>
            <p className="mt-1 text-sm text-amber-700">
              Street placement may require a permit depending on the city and
              exact location.
            </p>
          </div>
        )}
      </div>
    </StepShell>
  );
}
