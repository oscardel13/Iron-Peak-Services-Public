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

export default function StepStartAddress({
  bookingForm,
  updateBookingForm,
  goToNextStep,
}) {
  return (
    <StepShell
      title="Start address"
      description="Enter the delivery address to begin your booking."
      onNext={goToNextStep}
      hideBack
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search Address
          </label>
          <Input
            placeholder="Start typing an address..."
            value={bookingForm.address.query}
            onChange={(e) => updateBookingForm("address.query", e.target.value)}
          />
          <p className="mt-2 text-xs text-gray-500">
            Later this can connect to Google Maps autocomplete.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Address
            </label>
            <Input
              value={bookingForm.address.fullAddress}
              onChange={(e) =>
                updateBookingForm("address.fullAddress", e.target.value)
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address Line 1
            </label>
            <Input
              value={bookingForm.address.address1}
              onChange={(e) =>
                updateBookingForm("address.address1", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              City
            </label>
            <Input
              value={bookingForm.address.city}
              onChange={(e) => updateBookingForm("address.city", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              State
            </label>
            <Input
              value={bookingForm.address.state}
              onChange={(e) =>
                updateBookingForm("address.state", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              ZIP
            </label>
            <Input
              value={bookingForm.address.zip}
              onChange={(e) => updateBookingForm("address.zip", e.target.value)}
            />
          </div>
        </div>
      </div>
    </StepShell>
  );
}