import {
  type Booking,
  type BookingAddon,
} from "../generated/prisma/client.js";

type BookingWithAddons = Booking & {
  addons?: BookingAddon[];
};

export const calculateTotalPrice = (
  booking: BookingWithAddons
): number => {
  const basePrice = Number(booking.basePrice);
  const deliveryFee = Number(booking.deliveryFee);
  const mileageFee = Number(booking.mileageFee);
  const overageFee = Number(booking.overageFee);

  // Concrete surcharge
  const concreteFee =
    booking.material?.toLowerCase() === "concrete"
      ? 150 // or derive from dumpster later
      : 0;

  // Rental days from dates
  let rentalDays = 0;

  if (!booking.pickupDateUnknown && booking.pickupDate) {
    const start = new Date(booking.deliveryDate).getTime();
    const end = new Date(booking.pickupDate).getTime();

    const msPerDay = 1000 * 60 * 60 * 24;

    rentalDays = Math.max(
      1,
      Math.ceil((end - start) / msPerDay)
    );
  }

  const includedDays = booking.rentalDaysIncluded ?? 7;
  const extraDays = rentalDays > includedDays
    ? rentalDays - includedDays
    : 0;

  const extraDaysFee = extraDays * 25;

  // Add-ons from relation if loaded
  const addonsTotal =
    booking.addons?.reduce((sum, addon) => {
      return (
        sum +
        Number(addon.addonPriceSnapshot) *
          addon.quantity
      );
    }, 0) ?? Number(booking.addonsTotal);

  const total =
    basePrice +
    concreteFee +
    deliveryFee +
    mileageFee +
    overageFee +
    extraDaysFee +
    addonsTotal;

  return Number(total.toFixed(2));
};