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

export default function StepCustomerPayment({
  bookingForm,
  updateBookingForm,
  goToNextStep,
  goToPreviousStep,
}) {
  return (
    <StepShell
      title="Customer and payment information"
      description="Enter contact details and review the payment placeholder."
      onNext={goToNextStep}
      onBack={goToPreviousStep}
      nextLabel="Review Booking"
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
                value={bookingForm.customer.phone}
                onChange={(e) =>
                  updateBookingForm("customer.phone", e.target.value)
                }
                placeholder="(720) 555-0123"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                value={bookingForm.customer.email}
                onChange={(e) =>
                  updateBookingForm("customer.email", e.target.value)
                }
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4">
            <input
              type="checkbox"
              checked={bookingForm.payment.billingSameAsCustomer}
              onChange={(e) =>
                updateBookingForm(
                  "payment.billingSameAsCustomer",
                  e.target.checked
                )
              }
              className="mt-1 h-5 w-5"
            />
            <div>
              <p className="font-medium text-gray-900">
                Billing information is the same as service contact information
              </p>
            </div>
          </label>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Payment placeholder
          </h3>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              Payment UI will go here later. For now, this section acts as a
              placeholder for card entry, pre-authorization, or final checkout.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {bookingForm.payment.status || "pending"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">Estimated Total</p>
                <p className="mt-1 font-semibold text-gray-900">
                  ${(bookingForm.pricing.total || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StepShell>
  );
}