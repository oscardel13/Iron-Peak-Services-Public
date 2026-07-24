"use client";

import { getPhoneDigits, formatPhoneNumber } from "@/utils/helpers";

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

export default function StepCustomerInfo({
  bookingForm,
  updateBookingForm,
  goToNextStep,
  goToPreviousStep,
  formErrors = {},
}) {
  return (
    <StepShell
      title="Customer Information"
      description="Enter the contact details for this booking. Payment will be completed on the review step."
      onNext={goToNextStep}
      onBack={goToPreviousStep}
      nextLabel="Review & Payment"
      errors={formErrors}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Service contact information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => updateBookingForm("customer.customerType", "home")}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                bookingForm.customer.customerType === "home"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <p className="font-semibold">Home</p>
              <p className="mt-1 text-sm text-gray-500">
                Residential service address
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                updateBookingForm("customer.customerType", "business")
              }
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                bookingForm.customer.customerType === "business"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <p className="font-semibold">Business</p>
              <p className="mt-1 text-sm text-gray-500">
                Commercial service address
              </p>
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                value={bookingForm.customer.firstName}
                onChange={(e) =>
                  updateBookingForm("customer.firstName", e.target.value)
                }
                placeholder="Jane"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                value={bookingForm.customer.lastName}
                onChange={(e) =>
                  updateBookingForm("customer.lastName", e.target.value)
                }
                placeholder="Doe"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                type="tel"
                inputMode="numeric"
                value={formatPhoneNumber(bookingForm.customer.phone)}
                onChange={(e) =>
                  updateBookingForm(
                    "customer.phone",
                    getPhoneDigits(e.target.value),
                  )
                }
                placeholder="(720) 555-0123"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                value={bookingForm.customer.email}
                onChange={(e) =>
                  updateBookingForm("customer.email", e.target.value)
                }
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              Payment will be collected securely on the next step after you
              review your booking details.
            </p>
          </div>
        </div>
      </div>
    </StepShell>
  );
}
