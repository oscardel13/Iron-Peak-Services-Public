"use client";

import StepShell from "../step-shell/step-shell.component";

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-right text-sm font-medium text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
}

function formatMaterial(material) {
  if (!material) return "";
  return material
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function StepReviewSubmit({
  bookingForm,
  goToPreviousStep,
  goToStep,
}) {
  return (
    <StepShell
      title="Review and submit"
      description="Make sure everything looks right before confirming your booking."
      onBack={goToPreviousStep}
      hideNext
      backLabel="Back"
    >
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Address</h3>
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="text-sm font-medium text-indigo-600 underline"
              >
                Edit
              </button>
            </div>

            <Row label="Full Address" value={bookingForm.address.fullAddress} />
            <Row label="Address Line 1" value={bookingForm.address.address1} />
            <Row label="City" value={bookingForm.address.city} />
            <Row label="State" value={bookingForm.address.state} />
            <Row label="ZIP" value={bookingForm.address.zip} />
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Dumpster Details</h3>
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="text-sm font-medium text-indigo-600 underline"
              >
                Edit
              </button>
            </div>

            <Row
              label="Material"
              value={formatMaterial(bookingForm.dumpster.material)}
            />
            <Row
              label="Size"
              value={
                bookingForm.dumpster.size
                  ? `${bookingForm.dumpster.size} yd`
                  : ""
              }
            />
            <Row label="Product" value={bookingForm.dumpster.productLabel} />
            <Row
              label="Priority Delivery"
              value={bookingForm.addons.priorityDelivery ? "Yes" : "No"}
            />
            <Row
              label="Driveway Protection"
              value={bookingForm.addons.drivewayProtection ? "Yes" : "No"}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Schedule</h3>
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="text-sm font-medium text-indigo-600 underline"
              >
                Edit
              </button>
            </div>

            <Row label="Delivery Date" value={bookingForm.schedule.deliveryDate} />
            <Row
              label="Pickup Date"
              value={
                bookingForm.schedule.unknownPickup
                  ? "I don't know yet"
                  : bookingForm.schedule.pickupDate
              }
            />
            <Row
              label="Rental Days"
              value={
                bookingForm.schedule.unknownPickup
                  ? "Open-ended"
                  : bookingForm.schedule.rentalDays
                  ? `${bookingForm.schedule.rentalDays} days`
                  : ""
              }
            />
            <Row
              label="Extra Days Fee"
              value={`$${(bookingForm.pricing.extraDaysFee || 0).toFixed(2)}`}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Location + Customer</h3>
              <button
                type="button"
                onClick={() => goToStep(4)}
                className="text-sm font-medium text-indigo-600 underline"
              >
                Edit
              </button>
            </div>

            <Row label="Placement" value={bookingForm.location.placement} />
            <Row
              label="Location Verified"
              value={bookingForm.location.verified ? "Yes" : "No"}
            />
            <Row
              label="Customer Type"
              value={bookingForm.customer.customerType}
            />
            <Row
              label="Customer"
              value={`${bookingForm.customer.firstName} ${bookingForm.customer.lastName}`}
            />
            <Row label="Phone" value={bookingForm.customer.phone} />
            <Row label="Email" value={bookingForm.customer.email} />
          </div>
        </div>

        {bookingForm.location.instructions ? (
          <div className="rounded-2xl border border-gray-200 p-4">
            <h3 className="mb-3 font-semibold text-gray-900">Instructions</h3>
            <p className="text-sm text-gray-700">
              {bookingForm.location.instructions}
            </p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Final Total</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                ${(bookingForm.pricing.total || 0).toFixed(2)}
              </p>
            </div>

            <button
              type="button"
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </StepShell>
  );
}