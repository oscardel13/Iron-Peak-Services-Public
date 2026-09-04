"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import BookingCheckoutForm from "../booking-checkout-form/booking-checkout-form.component";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export default function BookingPayment({
  clientSecret,
  bookingId,
  bookingForm,
  serverBooking,
  onPaymentSuccess,
}) {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-semibold text-red-800">
          Stripe publishable key is missing.
        </p>
        <p className="mt-1 text-sm text-red-700">
          Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your frontend environment.
        </p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          Preparing secure payment form...
        </p>
      </div>
    );
  }

  const appearance = {
    theme: "stripe",
  };

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance,
      }}
    >
      <BookingCheckoutForm
        bookingId={bookingId}
        bookingForm={bookingForm}
        serverBooking={serverBooking}
        onPaymentSuccess={onPaymentSuccess}
      />
    </Elements>
  );
}
