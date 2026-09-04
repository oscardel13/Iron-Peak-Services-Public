export function buildStripeShippingFromBookingForm(bookingForm) {
  const fullName = [
    bookingForm.customer.firstName,
    bookingForm.customer.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (!fullName) return null;
  if (!bookingForm.address.address1) return null;
  if (!bookingForm.address.city) return null;
  if (!bookingForm.address.state) return null;
  if (!bookingForm.address.zip) return null;

  return {
    name: fullName,
    phone: bookingForm.customer.phone || undefined,
    address: {
      line1: bookingForm.address.address1,
      line2: bookingForm.address.address2 || undefined,
      city: bookingForm.address.city,
      state: bookingForm.address.state,
      postal_code: bookingForm.address.zip,
      country: "US",
    },
  };
}
