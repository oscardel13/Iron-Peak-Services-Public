// const { Booking } = await import("../generated/prisma/client.ts");
import type { Booking } from "../generated/prisma/client.js";
import { calculateTotalPrice } from "../utils/misc.ts";

// this later on will trigger payment processing via Stripe, PayPal, etc. For now it's just a placeholder to calculate the amount.
export const calculatePaymentAmount = (booking: Booking) => {
  const total = calculateTotalPrice(booking);
  return total;
};