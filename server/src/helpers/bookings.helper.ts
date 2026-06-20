import { prisma } from "../libs/prisma.ts";

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

type Coordinates = {
  latitude: number;
  longitude: number;
};

type ValidationResult = {
  valid: boolean;
  error?: string;
  deliveryDate?: Date;
  pickupDate?: Date | null;
};

const WAREHOUSE_LOCATION: Coordinates = {
  // Replace with your real warehouse coordinates
  latitude: 39.7392,
  longitude: -104.9903,
};

const FREE_MILE_RADIUS = 20;
const MILEAGE_RATE_AFTER_FREE_RADIUS = 2;
const EXTRA_DAY_RATE = 25;

const toNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") return 0;

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return 0;

  return numberValue;
};

function createValidationError(message: string, statusCode = 400) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

export function calculateDistanceFromWarehouse(
  latitude?: number | string | null,
  longitude?: number | string | null,
) {
  if (latitude === null || latitude === undefined) return null;
  if (longitude === null || longitude === undefined) return null;

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const warehouseLat = WAREHOUSE_LOCATION.latitude;
  const warehouseLng = WAREHOUSE_LOCATION.longitude;

  const toRad = (value: number) => (value * Math.PI) / 180;

  const earthRadiusMiles = 3958.8;

  const dLat = toRad(lat - warehouseLat);
  const dLng = toRad(lng - warehouseLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(warehouseLat)) *
      Math.cos(toRad(lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusMiles * c;

  return Number(distance.toFixed(1));
}

export function calculateMileageFee(distanceFromWarehouse?: number | null) {
  if (distanceFromWarehouse === null || distanceFromWarehouse === undefined) {
    return 0;
  }

  if (distanceFromWarehouse <= FREE_MILE_RADIUS) {
    return 0;
  }

  const billableMiles = distanceFromWarehouse - FREE_MILE_RADIUS;
  const mileageFee = billableMiles * MILEAGE_RATE_AFTER_FREE_RADIUS;

  return Number(mileageFee.toFixed(2));
}

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

  const extraDaysFee = extraDays * EXTRA_DAY_RATE;

  const materialSurcharge =
    input.material?.toLowerCase() === "concrete" ? concretePrice : 0;

  const total =
    basePrice +
    materialSurcharge +
    deliveryFee +
    mileageFee +
    overageFee +
    extraDaysFee +
    addonsTotal;

  return {
    basePrice: Number(basePrice.toFixed(2)),
    materialSurcharge: Number(materialSurcharge.toFixed(2)),
    deliveryFee: Number(deliveryFee.toFixed(2)),
    mileageFee: Number(mileageFee.toFixed(2)),
    overageFee: Number(overageFee.toFixed(2)),
    extraDaysFee: Number(extraDaysFee.toFixed(2)),
    addonsTotal: Number(addonsTotal.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

export async function getSelectedAddons(addonsInput: Record<string, boolean>) {
  const selectedCodes = Object.entries(addonsInput ?? {})
    .filter(([, selected]) => Boolean(selected))
    .map(([code]) => code);

  if (selectedCodes.length === 0) {
    return {
      selectedAddons: [],
      addonsTotal: 0,
    };
  }

  const selectedAddons = await prisma.addon.findMany({
    where: {
      code: {
        in: selectedCodes,
      },
      isActive: true,
    },
  });

  const addonsTotal = selectedAddons.reduce((sum, addon) => {
    return sum + Number(addon.price);
  }, 0);

  return {
    selectedAddons,
    addonsTotal: Number(addonsTotal.toFixed(2)),
  };
}

function parseDateOnly(value: unknown) {
  if (!value) return null;

  if (value instanceof Date) {
    return new Date(
      Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
    );
  }

  if (typeof value !== "string") return null;

  const [datePart] = value.split("T");
  if (!datePart) return null;

  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(Date.UTC(year, month - 1, day));
}

function getUtcStartOfToday() {
  const now = new Date();

  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function addUtcDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function validateBookingDates(data: any): ValidationResult {
  const today = getUtcStartOfToday();
  const tomorrow = addUtcDays(today, 1);

  const deliveryDate = parseDateOnly(data.deliveryDate);
  const pickupDate = data.pickupDate ? parseDateOnly(data.pickupDate) : null;
  const pickupDateUnknown = Boolean(data.pickupDateUnknown);

  if (!deliveryDate) {
    return {
      valid: false,
      error: "Delivery date is required.",
    };
  }

  if (deliveryDate < tomorrow) {
    return {
      valid: false,
      error:
        "Online booking starts tomorrow. For same-day delivery, please call us.",
    };
  }

  if (!pickupDateUnknown && !pickupDate) {
    return {
      valid: false,
      error: "Pickup date is required.",
    };
  }

  if (pickupDate) {
    if (pickupDate < tomorrow) {
      return {
        valid: false,
        error:
          "Pickup date must be tomorrow or later. For same-day pickup, please call us.",
      };
    }

    if (pickupDate < deliveryDate) {
      return {
        valid: false,
        error: "Pickup date cannot be before delivery date.",
      };
    }
  }

  return {
    valid: true,
    deliveryDate,
    pickupDate,
  };
}

export function validateCreateBookingInput(data: any) {
  const dateValidation = validateBookingDates(data);

  if (!dateValidation.valid) {
    throw createValidationError(
      dateValidation.error || "Invalid booking dates.",
      400,
    );
  }

  return {
    ...data,
    deliveryDate: dateValidation.deliveryDate,
    pickupDate: dateValidation.pickupDate,
  };
}

export async function validatePatchBookingInput(id: string, data: any) {
  const isUpdatingDates =
    "deliveryDate" in data ||
    "pickupDate" in data ||
    "pickupDateUnknown" in data;

  if (!isUpdatingDates) {
    return data;
  }

  const existingBooking = await prisma.booking.findUnique({
    where: {
      id,
    },
    select: {
      deliveryDate: true,
      pickupDate: true,
      pickupDateUnknown: true,
    },
  });

  if (!existingBooking) {
    throw createValidationError("Booking not found.", 404);
  }

  const mergedDateData = {
    deliveryDate: data.deliveryDate ?? existingBooking.deliveryDate,
    pickupDate:
      "pickupDate" in data ? data.pickupDate : existingBooking.pickupDate,
    pickupDateUnknown:
      data.pickupDateUnknown ?? existingBooking.pickupDateUnknown,
  };

  const dateValidation = validateBookingDates(mergedDateData);

  if (!dateValidation.valid) {
    throw createValidationError(
      dateValidation.error || "Invalid booking dates.",
      400,
    );
  }

  return {
    ...data,
    deliveryDate: dateValidation.deliveryDate,
    pickupDate: dateValidation.pickupDate,
  };
}

export function getHttpErrorStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "statusCode" in error) {
    return Number((error as { statusCode?: number }).statusCode) || 500;
  }

  return 500;
}

export function getHttpErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;

  return fallback;
}
