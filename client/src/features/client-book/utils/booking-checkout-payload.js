export function buildCheckoutPayload(bookingForm) {
  const customerName = [
    bookingForm.customer.firstName,
    bookingForm.customer.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    dumpsterId: bookingForm.dumpster.productId || null,
    dumpsterSize: Number(bookingForm.dumpster.size),
    dumpsterLabel: bookingForm.dumpster.productLabel || null,
    material: bookingForm.dumpster.material || null,
    productCode: bookingForm.dumpster.productCode || null,

    serviceType: "DUMPSTER_RENTAL",
    projectType: bookingForm.address.projectType || null,

    customerName,
    customerPhone: bookingForm.customer.phone,
    customerEmail: bookingForm.customer.email || null,

    address1: bookingForm.address.address1,
    address2: bookingForm.address.address2 || null,
    city: bookingForm.address.city,
    state: bookingForm.address.state,
    zip: bookingForm.address.zip,
    latitude: bookingForm.address.latitude,
    longitude: bookingForm.address.longitude,

    placement: bookingForm.location.placement || null,
    instructions: bookingForm.location.instructions || null,
    customerNotes: bookingForm.customer.notes || null,

    locationVerified: Boolean(bookingForm.location?.verified),
    locationVerificationNote: bookingForm.location?.verificationNote || null,

    deliveryDate: bookingForm.schedule.deliveryDate,
    pickupDate: bookingForm.schedule.unknownPickup
      ? null
      : bookingForm.schedule.pickupDate,
    pickupDateUnknown: Boolean(bookingForm.schedule.unknownPickup),
    rentalDaysIncluded: 7,

    bookingStatus: "QUOTE",
    paymentStatus: "PENDING",

    concretePrice: bookingForm.dumpster.concretePrice,
    rentalDays: bookingForm.schedule.rentalDays,

    basePrice: Number(bookingForm.pricing.basePrice || 0),
    deliveryFee: Number(bookingForm.pricing.deliveryFee || 0),
    mileageFee: Number(bookingForm.pricing.mileageFee || 0),
    extraDaysFee: Number(bookingForm.pricing.extraDaysFee || 0),
    overageFee: Number(bookingForm.pricing.overageFee || 0),

    addons: {
      drivewayProtection: bookingForm.addons.drivewayProtection,
      priorityDelivery: bookingForm.addons.priorityDelivery,
    },

    total: Number(bookingForm.pricing.total || 0),
  };
}
