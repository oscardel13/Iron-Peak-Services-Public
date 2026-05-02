import { prisma } from '../libs/prisma.ts';

type BookingPricingInput = {
  basePrice: number | string;
  concretePrice?: number | string | null;
  material?: string | null;

  rentalDays?: number | string | null;
  rentalDaysIncluded?: number | string | null;

  deliveryFee?: number | string | null;
  mileageFee?: number | string | null;
  overageFee?: number | string | null;
  addonsTotal?: number | string | null;
};

const toNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") return 0;
  return Number(value);
};

export function calculateBookingPricing(input: BookingPricingInput) {
  const basePrice = toNumber(input.basePrice);
  const concretePrice = toNumber(input.concretePrice);
  const deliveryFee = toNumber(input.deliveryFee);
  const mileageFee = toNumber(input.mileageFee);
  const overageFee = toNumber(input.overageFee);
  const addonsTotal = toNumber(input.addonsTotal);

  const rentalDays = toNumber(input.rentalDays);
  const rentalDaysIncluded = toNumber(input.rentalDaysIncluded ?? 7);
  const extraDays =
    rentalDays > rentalDaysIncluded ? rentalDays - rentalDaysIncluded : 0;

  const extraDaysFee = extraDays * 25;

  const materialSurcharge =
    input.material?.toLowerCase() === "concrete" ? concretePrice : 0;

    console.log("Pricing calculation details:", {
      basePrice,
      materialSurcharge,
      deliveryFee,
      mileageFee,
      overageFee,
      extraDaysFee,
      addonsTotal,
    });

  const total =
    basePrice +
    materialSurcharge +
    deliveryFee +
    mileageFee +
    overageFee +
    extraDaysFee +
    addonsTotal;

  return {
    basePrice,
    materialSurcharge,
    deliveryFee,
    mileageFee,
    overageFee,
    extraDaysFee: Number(extraDaysFee.toFixed(2)),
    addonsTotal: Number(addonsTotal.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

export async function getSelectedAddons(addonsInput: Record<string, boolean>) {
  const selectedCodes = Object.entries(addonsInput ?? {})
    .filter(([, selected]) => selected)
    .map(([code]) => code);

  if (selectedCodes.length === 0) {
    return {
      selectedAddons: [],
      addonsTotal: 0,
    };
  }

  const selectedAddons = await prisma.addon.findMany({
    where: {
      code: { in: selectedCodes },
      isActive: true,
    },
  });

  const addonsTotal = selectedAddons.reduce((sum, addon) => {
    return sum + Number(addon.price);
  }, 0);

  return {
    selectedAddons,
    addonsTotal,
  };
}