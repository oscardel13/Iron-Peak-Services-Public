import { prisma } from "../libs/prisma.ts";
import {
  Prisma,
  BookingStatus,
  PaymentStatus,
  ServiceType,
} from "../generated/prisma/client.js";

import {
  calculateBookingPricing,
  calculateDistanceFromWarehouse,
  calculateMileageFee,
  getSelectedAddons,
} from "../helpers/bookings.helper.ts";

import {
  createStripePaymentIntentForBooking,
  updateStripePaymentIntentForBooking,
} from "./stripe.service.ts";

import { buildBookingUpdateData } from "../utils/helper.ts";

const generateBookingNumber = () => {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);

  return `BK-${yyyy}${mm}${dd}-${rand}`;
};

function createServiceError(message: string, statusCode = 400) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || null;
}

function isAdminOrOwner(requestUser?: any) {
  return (
    requestUser?.accessLevel === "ADMIN" || requestUser?.accessLevel === "OWNER"
  );
}

function normalizeBookingForCheckout(booking: any) {
  return {
    ...booking,
    basePrice: Number(booking.basePrice || 0),
    deliveryFee: Number(booking.deliveryFee || 0),
    mileageFee: Number(booking.mileageFee || 0),
    extraDaysFee: Number(booking.extraDaysFee || 0),
    overageFee: Number(booking.overageFee || 0),
    addonsTotal: Number(booking.addonsTotal || 0),
    total: Number(booking.total || 0),
    latitude: booking.latitude != null ? Number(booking.latitude) : null,
    longitude: booking.longitude != null ? Number(booking.longitude) : null,
    distanceFromWarehouse:
      booking.distanceFromWarehouse != null
        ? Number(booking.distanceFromWarehouse)
        : null,
  };
}

async function getRequiredDumpster(dumpsterId?: string | null) {
  if (!dumpsterId) {
    throw createServiceError("A valid dumpsterId is required.", 400);
  }

  const dumpster = await prisma.dumpster.findUnique({
    where: {
      id: dumpsterId,
    },
  });

  if (!dumpster) {
    throw createServiceError("A valid dumpsterId is required.", 400);
  }

  return dumpster;
}

async function resolveBookingClientId(data: any, requestUser?: any) {
  const sessionClientId = requestUser?.client?.id;

  if (sessionClientId) {
    return sessionClientId;
  }

  const customerEmail = normalizeEmail(data.customerEmail);

  if (!customerEmail) {
    return null;
  }

  const client = await prisma.client.findFirst({
    where: {
      OR: [
        {
          email: customerEmail,
        },
        {
          user: {
            email: customerEmail,
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  return client?.id ?? null;
}

async function buildBookingPricingData(data: any) {
  const dumpster = await getRequiredDumpster(data.dumpsterId);

  const { selectedAddons, addonsTotal } = await getSelectedAddons(
    data.addons ?? {},
  );

  const latitude =
    data.latitude !== null && data.latitude !== undefined
      ? Number(data.latitude)
      : null;

  const longitude =
    data.longitude !== null && data.longitude !== undefined
      ? Number(data.longitude)
      : null;

  const distanceFromWarehouse = calculateDistanceFromWarehouse(
    latitude,
    longitude,
  );

  const mileageFee = calculateMileageFee(distanceFromWarehouse);

  const pricing = calculateBookingPricing({
    basePrice: dumpster.basePrice,
    concretePrice: dumpster.concretePrice,
    material: data.material,

    rentalDays: data.rentalDays,
    rentalDaysIncluded: data.rentalDaysIncluded ?? 7,

    deliveryFee: data.deliveryFee ?? 0,
    mileageFee,
    overageFee: data.overageFee ?? 0,

    addonsTotal,
  });

  return {
    dumpster,
    selectedAddons,
    latitude,
    longitude,
    distanceFromWarehouse,
    pricing,
  };
}

function buildBookingCreateData({
  data,
  bookingNumber,
  dumpster,
  selectedAddons,
  latitude,
  longitude,
  distanceFromWarehouse,
  pricing,
}: any) {
  return {
    bookingNumber,

    clientId: data.clientId ?? null,

    dumpsterId: dumpster.id,
    dumpsterSize: dumpster.size,
    dumpsterLabel: dumpster.label,
    material: data.material ?? null,

    serviceType: data.serviceType ?? ServiceType.DUMPSTER_RENTAL,
    projectType: data.projectType ?? null,

    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail ?? null,

    address1: data.address1,
    address2: data.address2 ?? null,
    city: data.city,
    state: data.state,
    zip: data.zip,

    latitude: latitude !== null ? new Prisma.Decimal(latitude) : null,
    longitude: longitude !== null ? new Prisma.Decimal(longitude) : null,

    distanceFromWarehouse:
      distanceFromWarehouse !== null
        ? new Prisma.Decimal(distanceFromWarehouse)
        : null,

    placement: data.placement ?? null,
    instructions: data.instructions ?? null,
    customerNotes: data.customerNotes ?? null,

    locationVerified: Boolean(data.locationVerified),
    locationVerificationNote: data.locationVerificationNote ?? null,

    deliveryDate: new Date(data.deliveryDate),
    pickupDate: data.pickupDate ? new Date(data.pickupDate) : null,
    pickupDateUnknown: Boolean(data.pickupDateUnknown),
    rentalDaysIncluded: Number(data.rentalDaysIncluded ?? 7),

    priorityDelivery: Boolean(data.priorityDelivery),
    deliveryTime: data.deliveryTime ? new Date(data.deliveryTime) : null,
    priorityDeliveryNote: data.priorityDeliveryNote ?? null,

    bookingStatus: data.bookingStatus ?? BookingStatus.QUOTE,
    paymentStatus: data.paymentStatus ?? PaymentStatus.UNPAID,

    quotedAt: new Date(),

    basePrice: new Prisma.Decimal(pricing.basePrice),
    deliveryFee: new Prisma.Decimal(pricing.deliveryFee),
    mileageFee: new Prisma.Decimal(pricing.mileageFee),
    extraDaysFee: new Prisma.Decimal(pricing.extraDaysFee),
    overageFee: new Prisma.Decimal(pricing.overageFee),
    addonsTotal: new Prisma.Decimal(pricing.addonsTotal),
    total: new Prisma.Decimal(pricing.total),

    addons: {
      create: selectedAddons.map((addon: any) => ({
        addonId: addon.id,
        addonCodeSnapshot: addon.code,
        addonNameSnapshot: addon.name,
        addonPriceSnapshot: addon.price,
        quantity: 1,
      })),
    },
  };
}

function buildCheckoutDraftUpdateData({
  data,
  dumpster,
  latitude,
  longitude,
  distanceFromWarehouse,
  pricing,
}: any) {
  return {
    dumpsterId: dumpster.id,
    dumpsterSize: dumpster.size,
    dumpsterLabel: dumpster.label,
    material: data.material ?? null,

    serviceType: data.serviceType ?? ServiceType.DUMPSTER_RENTAL,
    projectType: data.projectType ?? null,

    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail ?? null,

    address1: data.address1,
    address2: data.address2 ?? null,
    city: data.city,
    state: data.state,
    zip: data.zip,

    latitude: latitude !== null ? new Prisma.Decimal(latitude) : null,
    longitude: longitude !== null ? new Prisma.Decimal(longitude) : null,

    distanceFromWarehouse:
      distanceFromWarehouse !== null
        ? new Prisma.Decimal(distanceFromWarehouse)
        : null,

    placement: data.placement ?? null,
    instructions: data.instructions ?? null,
    customerNotes: data.customerNotes ?? null,

    locationVerified: Boolean(data.locationVerified),
    locationVerificationNote: data.locationVerificationNote ?? null,

    deliveryDate: new Date(data.deliveryDate),
    pickupDate: data.pickupDate ? new Date(data.pickupDate) : null,
    pickupDateUnknown: Boolean(data.pickupDateUnknown),
    rentalDaysIncluded: Number(data.rentalDaysIncluded ?? 7),

    priorityDelivery: Boolean(data.priorityDelivery),
    deliveryTime: data.deliveryTime ? new Date(data.deliveryTime) : null,
    priorityDeliveryNote: data.priorityDeliveryNote ?? null,

    bookingStatus: BookingStatus.QUOTE,
    paymentStatus: PaymentStatus.PENDING,

    basePrice: new Prisma.Decimal(pricing.basePrice),
    deliveryFee: new Prisma.Decimal(pricing.deliveryFee),
    mileageFee: new Prisma.Decimal(pricing.mileageFee),
    extraDaysFee: new Prisma.Decimal(pricing.extraDaysFee),
    overageFee: new Prisma.Decimal(pricing.overageFee),
    addonsTotal: new Prisma.Decimal(pricing.addonsTotal),
    total: new Prisma.Decimal(pricing.total),
  };
}

const bookingInclude = {
  dumpster: true,
  addons: {
    include: {
      addon: true,
    },
  },
};

export const getBookings = async (query: any) => {
  return await prisma.booking.findMany({
    include: {
      dumpster: true,
      addons: {
        include: {
          addon: true,
        },
      },
      notes: true,
    },
  });
};

export const getBookingById = async (id: string) => {
  return await prisma.booking.findUnique({
    where: { id },
    include: {
      dumpster: true,
      addons: {
        include: {
          addon: true,
        },
      },
      notes: true,
      history: true,
    },
  });
};

export const createCheckoutDraftBooking = async (
  data: any,
  requestUser?: any,
) => {
  const bookingNumber = generateBookingNumber();
  const clientId = await resolveBookingClientId(data, requestUser);

  const {
    dumpster,
    selectedAddons,
    latitude,
    longitude,
    distanceFromWarehouse,
    pricing,
  } = await buildBookingPricingData(data);

  const booking = await prisma.booking.create({
    data: buildBookingCreateData({
      data: {
        ...data,
        clientId,
        bookingStatus: BookingStatus.QUOTE,
        paymentStatus: PaymentStatus.PENDING,
      },
      bookingNumber,
      dumpster,
      selectedAddons,
      latitude,
      longitude,
      distanceFromWarehouse,
      pricing,
    }),
    include: bookingInclude,
  });

  const paymentIntent = await createStripePaymentIntentForBooking(booking);

  const updatedBooking = await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      stripePaymentIntentId: paymentIntent.id,
      stripePaymentStatus: paymentIntent.status,
      paymentStatus: PaymentStatus.PENDING,
    },
    include: bookingInclude,
  });

  return {
    booking: normalizeBookingForCheckout(updatedBooking),
    clientSecret: paymentIntent.client_secret,
  };
};

export const updateCheckoutDraftBooking = async (
  id: string,
  data: any,
  requestUser?: any,
) => {
  const existingBooking = await prisma.booking.findUnique({
    where: {
      id,
    },
  });

  if (!existingBooking) {
    throw createServiceError("Booking not found.", 404);
  }

  if (existingBooking.paymentStatus === PaymentStatus.PAID) {
    throw createServiceError("Paid bookings cannot be edited.", 400);
  }

  const resolvedClientId = await resolveBookingClientId(data, requestUser);

  if (
    !isAdminOrOwner(requestUser) &&
    requestUser?.client?.id &&
    existingBooking.clientId &&
    existingBooking.clientId !== requestUser.client.id
  ) {
    throw createServiceError("You do not have access to this booking.", 403);
  }

  const clientId = existingBooking.clientId ?? resolvedClientId;

  const {
    dumpster,
    selectedAddons,
    latitude,
    longitude,
    distanceFromWarehouse,
    pricing,
  } = await buildBookingPricingData(data);

  await prisma.bookingAddon.deleteMany({
    where: {
      bookingId: id,
    },
  });

  const booking = await prisma.booking.update({
    where: {
      id,
    },
    data: {
      ...buildCheckoutDraftUpdateData({
        data,
        dumpster,
        latitude,
        longitude,
        distanceFromWarehouse,
        pricing,
      }),
      clientId,
      addons: {
        create: selectedAddons.map((addon: any) => ({
          addonId: addon.id,
          addonCodeSnapshot: addon.code,
          addonNameSnapshot: addon.name,
          addonPriceSnapshot: addon.price,
          quantity: 1,
        })),
      },
    },
    include: bookingInclude,
  });

  const paymentIntent = await updateStripePaymentIntentForBooking(booking);

  const updatedBooking = await prisma.booking.update({
    where: {
      id,
    },
    data: {
      stripePaymentIntentId: paymentIntent.id,
      stripePaymentStatus: paymentIntent.status,
      paymentStatus: PaymentStatus.PENDING,
    },
    include: bookingInclude,
  });

  return {
    booking: normalizeBookingForCheckout(updatedBooking),
    clientSecret: paymentIntent.client_secret,
  };
};

export const createBooking = async (data: any, requestUser?: any) => {
  try {
    const bookingNumber = generateBookingNumber();
    const clientId = await resolveBookingClientId(data, requestUser);

    const {
      dumpster,
      selectedAddons,
      latitude,
      longitude,
      distanceFromWarehouse,
      pricing,
    } = await buildBookingPricingData(data);

    return await prisma.booking.create({
      data: buildBookingCreateData({
        data: {
          ...data,
          clientId,
        },
        bookingNumber,
        dumpster,
        selectedAddons,
        latitude,
        longitude,
        distanceFromWarehouse,
        pricing,
      }),
      include: bookingInclude,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const patchBooking = async (id: string, data: any) => {
  const updateData = buildBookingUpdateData(data);

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided for update");
  }

  return await prisma.booking.update({
    where: { id },
    data: updateData,
    include: bookingInclude,
  });
};

export const deleteBooking = async (id: string) => {
  await prisma.booking.delete({
    where: { id },
  });

  return true;
};

export const getBookingNotes = async (bookingId: string) => {
  return await prisma.bookingNote.findMany({
    where: { bookingId },
    orderBy: { createdAt: "desc" },
  });
};

export const addBookingNote = async (bookingId: string, data: any) => {
  return await prisma.bookingNote.create({
    data: {
      bookingId,
      ...data,
    },
  });
};

export const getBookingHistory = async () => {
  return await prisma.bookingHistory.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getBookingAddons = async (bookingId: string) => {
  return await prisma.bookingAddon.findMany({
    where: { bookingId },
    include: {
      addon: true,
    },
  });
};

export const addBookingAddon = async (bookingId: string, data: any) => {
  const addon = await prisma.addon.findUnique({
    where: { id: data.addonId },
  });

  if (!addon || !addon.isActive) {
    throw new Error("Addon not found or inactive");
  }

  return await prisma.bookingAddon.create({
    data: {
      bookingId,
      addonId: data.addonId,
      addonCodeSnapshot: addon.code,
      addonNameSnapshot: addon.name,
      addonPriceSnapshot: addon.price,
      quantity: data.quantity || 1,
    },
    include: {
      addon: true,
    },
  });
};

export const removeBookingAddon = async (
  bookingId: string,
  addonId: string,
) => {
  const deleted = await prisma.bookingAddon.deleteMany({
    where: {
      bookingId,
      id: addonId,
    },
  });

  return deleted.count > 0;
};
