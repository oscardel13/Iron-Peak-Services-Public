"use client";

import BookingShell from "../booking-shell/booking-shell.component";
import StepStartAddress from "../step-start-address/step-start-address.component";
import StepSchedule from "../step-schedule/step-schedule.component";
import StepDumpsterDetails from "../step-dumpster-details/step-dumpster-details.component";
import StepVerifyLocation from "../step-verify-location/step-verify-location.component";
import StepCustomerInfo from "../step-customer-info/step-customer-info.component";
import StepReviewSubmit from "../step-review-and-payment/step-review-and-payment.component";

import useBookingFlow from "../../hooks/use-booking-flow";

import { BOOKING_STEPS } from "../../utils/booking-steps";

export default function BookingFlow({
  mode = "page",
  source = "marketing",
  autoScroll = true,
  onComplete,
}) {
  const booking = useBookingFlow({
    autoScroll: mode === "page" ? autoScroll : false,
  });

  function handlePaymentSuccess(paymentIntent) {
    booking.handlePaymentSuccess(paymentIntent);
    onComplete?.({
      paymentIntent,
      bookingId: booking.bookingId,
      serverBooking: booking.serverBooking,
      source,
    });
  }

  function renderStep() {
    switch (booking.currentStep) {
      case 1:
        return (
          <StepStartAddress
            bookingForm={booking.bookingForm}
            updateBookingForm={booking.updateBookingForm}
            goToNextStep={booking.goToNextStep}
            formErrors={booking.formErrors}
          />
        );

      case 2:
        return (
          <StepSchedule
            bookingForm={booking.bookingForm}
            updateScheduleField={booking.updateScheduleField}
            goToNextStep={booking.goToNextStep}
            goToPreviousStep={booking.goToPreviousStep}
            formErrors={booking.formErrors}
          />
        );

      case 3:
        return (
          <StepDumpsterDetails
            bookingForm={booking.bookingForm}
            updateBookingForm={booking.updateBookingForm}
            setSelectedProduct={booking.setSelectedProduct}
            toggleAddon={booking.toggleAddon}
            availableProducts={booking.availableProducts}
            goToNextStep={booking.goToNextStep}
            goToPreviousStep={booking.goToPreviousStep}
            formErrors={booking.formErrors}
          />
        );

      case 4:
        return (
          <StepVerifyLocation
            bookingForm={booking.bookingForm}
            updateBookingForm={booking.updateBookingForm}
            goToNextStep={booking.goToNextStep}
            goToPreviousStep={booking.goToPreviousStep}
            formErrors={booking.formErrors}
          />
        );

      case 5:
        return (
          <StepCustomerInfo
            bookingForm={booking.bookingForm}
            updateBookingForm={booking.updateBookingForm}
            goToNextStep={booking.goToNextStep}
            goToPreviousStep={booking.goToPreviousStep}
            formErrors={booking.formErrors}
          />
        );

      case 6:
        return (
          <StepReviewSubmit
            bookingForm={booking.bookingForm}
            serverBooking={booking.serverBooking}
            bookingId={booking.bookingId}
            clientSecret={booking.clientSecret}
            isPreparingCheckout={booking.isPreparingCheckout}
            checkoutError={booking.checkoutError}
            paymentSucceeded={booking.paymentSucceeded}
            prepareCheckoutDraft={booking.prepareCheckoutDraft}
            handlePaymentSuccess={handlePaymentSuccess}
            goToPreviousStep={booking.goToPreviousStep}
            goToStep={booking.goToStep}
            formErrors={booking.formErrors}
          />
        );

      default:
        return null;
    }
  }

  if (booking.loadingSetup) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-gray-100" />
        <div className="mt-6 h-[420px] animate-pulse rounded-3xl bg-gray-100" />
      </div>
    );
  }

  if (booking.setupError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-700">
          {booking.setupError}
        </p>

        <p className="mt-1 text-sm text-red-600">
          Please refresh and try again.
        </p>
      </div>
    );
  }

  return (
    <BookingShell
      steps={BOOKING_STEPS}
      currentStep={booking.currentStep}
      goToStep={booking.goToStep}
      bookingForm={booking.bookingForm}
      mobileSummaryOpen={booking.mobileSummaryOpen}
      setMobileSummaryOpen={booking.setMobileSummaryOpen}
      goToPreviousStep={booking.goToPreviousStep}
      mode={mode}
    >
      {renderStep()}
    </BookingShell>
  );
}
