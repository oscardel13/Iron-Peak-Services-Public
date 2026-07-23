import Stripe from "stripe";

import { prisma } from "../../libs/prisma.ts";
import { BookingStatus, PaymentStatus } from "../../generated/prisma/client.js";

import { sendBookingConfirmationEmail } from "../../emails/templates/booking-confirmation.template.ts";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export function constructStripeWebhookEvent(
  rawBody: Buffer,
  signature: string,
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET.");
  }

  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentSucceeded(paymentIntent);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentFailed(paymentIntent);
      break;
    }

    case "payment_intent.canceled": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentCanceled(paymentIntent);
      break;
    }

    default: {
      console.log(`Unhandled Stripe event type: ${event.type}`);
      break;
    }
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
) {
  const bookingId = paymentIntent.metadata?.bookingId;

  if (!bookingId) {
    console.warn("Stripe payment_intent.succeeded missing bookingId metadata.");
    return;
  }

  const existingBooking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      dumpster: true,
      addons: {
        include: {
          addon: true,
        },
      },
    },
  });

  if (!existingBooking) {
    console.warn(`Booking not found for payment intent: ${paymentIntent.id}`);
    return;
  }

  if (existingBooking.paymentStatus === PaymentStatus.PAID) {
    console.log(
      `Booking ${bookingId} is already paid. Skipping duplicate webhook.`,
    );
    return;
  }

  const booking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      bookingStatus: BookingStatus.SCHEDULED,
      paymentStatus: PaymentStatus.PAID,
      stripePaymentIntentId: paymentIntent.id,
      stripePaymentStatus: paymentIntent.status,
      paidAt: new Date(),
      confirmedAt: new Date(),
      scheduledAt: new Date(),
    },
    include: {
      dumpster: true,
      addons: {
        include: {
          addon: true,
        },
      },
    },
  });

  await sendBookingConfirmationEmail(booking);

  console.log(`Booking ${booking.bookingNumber} confirmed by Stripe payment.`);
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata?.bookingId;

  if (!bookingId) {
    console.warn(
      "Stripe payment_intent.payment_failed missing bookingId metadata.",
    );
    return;
  }

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      paymentStatus: PaymentStatus.FAILED,
      stripePaymentIntentId: paymentIntent.id,
      stripePaymentStatus: paymentIntent.status,
    },
  });

  console.log(`Booking ${bookingId} payment failed.`);
}

async function handlePaymentIntentCanceled(
  paymentIntent: Stripe.PaymentIntent,
) {
  const bookingId = paymentIntent.metadata?.bookingId;

  if (!bookingId) {
    console.warn("Stripe payment_intent.canceled missing bookingId metadata.");
    return;
  }

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      paymentStatus: PaymentStatus.CANCELLED,
      stripePaymentIntentId: paymentIntent.id,
      stripePaymentStatus: paymentIntent.status,
    },
  });

  console.log(`Booking ${bookingId} payment canceled.`);
}
