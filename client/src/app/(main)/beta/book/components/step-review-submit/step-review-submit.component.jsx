"use client";

import { useEffect } from "react";
import StepShell from "../step-shell/step-shell.component";
import BookingPayment from "../booking-payment/booking-payment.component";

import {
  formatCurrency,
  formatDate,
  formatLabel,
  getDistanceFromWarehouse,
  getServerOrFormPrice,
  getServerOrFormTotal,
} from "../../utils/review-formatters";

function Row({ label, value, bold = false }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`text-right text-sm ${
          bold ? "font-semibold text-gray-900" : "font-medium text-gray-900"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

export default function StepReviewSubmit({
  bookingForm,
  serverBooking,
  bookingId,
  clientSecret,
  isPreparingCheckout,
  checkoutError,
  paymentSucceeded,
  prepareCheckoutDraft,
  handlePaymentSuccess,
  goToPreviousStep,
  goToStep,
  formErrors = {},
}) {
  const distanceFromWarehouse = getDistanceFromWarehouse(bookingForm.address);

  const basePrice = getServerOrFormPrice(
    serverBooking,
    bookingForm,
    "basePrice",
  );
  const materialSurcharge = getServerOrFormPrice(
    serverBooking,
    bookingForm,
    "materialSurcharge",
  );
  const priorityDeliveryFee = bookingForm.pricing.priorityDeliveryFee;
  const drivewayProtectionFee = bookingForm.pricing.drivewayProtectionFee;
  const extraDaysFee = getServerOrFormPrice(
    serverBooking,
    bookingForm,
    "extraDaysFee",
  );
  const mileageFee = getServerOrFormPrice(
    serverBooking,
    bookingForm,
    "mileageFee",
  );
  const total = getServerOrFormTotal(serverBooking, bookingForm);

  useEffect(() => {
    prepareCheckoutDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepShell
      title="Review and submit"
      description="Make sure everything looks right before paying and confirming your booking."
      onBack={goToPreviousStep}
      hideNext
      backLabel="Back"
      errors={formErrors}
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
            <Row
              label="Project Type"
              value={formatLabel(bookingForm.address.projectType)}
            />
            <Row
              label="Distance from Warehouse"
              value={
                distanceFromWarehouse != null
                  ? `${distanceFromWarehouse} miles`
                  : ""
              }
            />
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Schedule</h3>
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="text-sm font-medium text-indigo-600 underline"
              >
                Edit
              </button>
            </div>

            <Row
              label="Delivery Date"
              value={formatDate(bookingForm.schedule.deliveryDate)}
            />
            <Row
              label="Pickup Date"
              value={
                bookingForm.schedule.unknownPickup
                  ? "I don't know yet"
                  : formatDate(bookingForm.schedule.pickupDate)
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
              label="Extra Days"
              value={
                bookingForm.schedule.unknownPickup
                  ? "—"
                  : `${bookingForm.schedule.extraDays || 0}`
              }
            />
            <Row label="Extra Days Fee" value={formatCurrency(extraDaysFee)} />
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Dumpster Details</h3>
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="text-sm font-medium text-indigo-600 underline"
              >
                Edit
              </button>
            </div>

            <Row
              label="Material"
              value={formatLabel(bookingForm.dumpster.material)}
            />
            <Row label="Dumpster" value={bookingForm.dumpster.productLabel} />
            <Row
              label="Size"
              value={
                bookingForm.dumpster.size
                  ? `${bookingForm.dumpster.size} yd`
                  : ""
              }
            />
            <Row
              label="Included"
              value={bookingForm.dumpster.includedWeightText}
            />
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
              <h3 className="font-semibold text-gray-900">
                Location + Customer
              </h3>
              <button
                type="button"
                onClick={() => goToStep(4)}
                className="text-sm font-medium text-indigo-600 underline"
              >
                Edit Location
              </button>
            </div>

            <Row
              label="Placement"
              value={formatLabel(bookingForm.location.placement)}
            />
            <Row
              label="Location Verified"
              value={bookingForm.location.verified ? "Yes" : "No"}
            />
            <Row
              label="Customer Type"
              value={formatLabel(bookingForm.customer.customerType)}
            />
            <Row
              label="Customer"
              value={`${bookingForm.customer.firstName} ${bookingForm.customer.lastName}`.trim()}
            />
            <Row label="Phone" value={bookingForm.customer.phone} />
            <Row label="Email" value={bookingForm.customer.email} />

            <button
              type="button"
              onClick={() => goToStep(5)}
              className="mt-4 text-sm font-medium text-indigo-600 underline"
            >
              Edit Customer
            </button>
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

        <div className="rounded-2xl border border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Pricing</h3>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="text-sm font-medium text-indigo-600 underline"
            >
              Edit
            </button>
          </div>

          <Row label="Base Price" value={formatCurrency(basePrice)} />
          <Row
            label="Material Surcharge"
            value={formatCurrency(materialSurcharge)}
          />
          <Row
            label="Priority Delivery"
            value={formatCurrency(priorityDeliveryFee)}
          />
          <Row
            label="Driveway Protection"
            value={formatCurrency(drivewayProtectionFee)}
          />
          <Row label="Extra Days Fee" value={formatCurrency(extraDaysFee)} />
          <Row
            label="Distance from Warehouse"
            value={
              bookingForm.address.distanceFromWarehouse != null
                ? `${bookingForm.address.distanceFromWarehouse} miles`
                : ""
            }
          />
          <Row label="Mileage Fee" value={formatCurrency(mileageFee)} />
          <Row label="Final Total" value={formatCurrency(total)} bold />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="mb-5">
            <p className="text-sm text-gray-500">Final Total</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {formatCurrency(total)}
            </p>

            {serverBooking?.bookingNumber ? (
              <p className="mt-2 text-sm text-gray-500">
                Booking draft: {serverBooking.bookingNumber}
              </p>
            ) : null}
          </div>

          {isPreparingCheckout ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-600">
                Preparing secure checkout...
              </p>
            </div>
          ) : checkoutError ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">
                  Could not prepare checkout.
                </p>
                <p className="mt-1 text-sm text-red-700">{checkoutError}</p>
              </div>

              <button
                type="button"
                onClick={prepareCheckoutDraft}
                className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : paymentSucceeded ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-800">
                Payment received.
              </p>
              <p className="mt-1 text-sm text-green-700">
                Your booking is being confirmed. You should receive confirmation
                once the payment webhook finishes processing.
              </p>
            </div>
          ) : (
            <BookingPayment
              clientSecret={clientSecret}
              bookingId={bookingId}
              bookingForm={bookingForm}
              serverBooking={serverBooking}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </div>
      </div>
    </StepShell>
  );
}
