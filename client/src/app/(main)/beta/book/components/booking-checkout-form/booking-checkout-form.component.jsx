"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { buildStripeShippingFromBookingForm } from "../../utils/stripe-shipping";
import {
  formatCurrency,
  getServerOrFormTotal,
} from "../../utils/review-formatters";

export default function BookingCheckoutForm({
  bookingId,
  bookingForm,
  serverBooking,
  onPaymentSuccess,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const total = getServerOrFormTotal(serverBooking, bookingForm);
  const customerEmail = bookingForm.customer.email || undefined;
  const shipping = buildStripeShippingFromBookingForm(bookingForm);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage("");

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/book?bookingId=${bookingId}`,
        receipt_email: customerEmail,
        shipping: shipping || undefined,
      },
    });

    if (result.error) {
      if (
        result.error.type === "card_error" ||
        result.error.type === "validation_error"
      ) {
        setMessage(result.error.message || "Payment could not be completed.");
      } else {
        setMessage("An unexpected payment error occurred.");
      }

      setIsLoading(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      setMessage("Payment received. Your booking is being confirmed securely.");
      onPaymentSuccess?.(result.paymentIntent);
      setIsLoading(false);
      return;
    }

    if (result.paymentIntent?.status === "processing") {
      setMessage(
        "Payment is processing. We will confirm your booking once payment completes.",
      );
      setIsLoading(false);
      return;
    }

    setMessage("Payment submitted. Please wait for confirmation.");
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />

      {message ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">{message}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading
          ? "Processing payment..."
          : `Pay ${formatCurrency(total)} & Confirm Booking`}
      </button>

      <p className="text-xs text-gray-500">
        Your booking is not confirmed until payment succeeds.
      </p>
    </form>
  );
}
