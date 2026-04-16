import { prisma } from '../libs/prisma.ts';
import { Prisma, BookingStatus, PaymentStatus, ServiceType } from "../generated/prisma/client.js";


const generateBookingNumber = () => {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BK-${yyyy}${mm}${dd}-${rand}`;
};

export const getBookings = async (query: any) => {
  // TODO: Implement filtering, pagination, etc.
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

// TODO: Implement total cost calculation, etc.
export const createBooking = async (data: any) => {
  try {
    const bookingNumber = generateBookingNumber();

    return await prisma.booking.create({
      data: {
        bookingNumber,

        dumpsterId: data.dumpsterId ?? null,
        dumpsterSize: Number(data.dumpsterSize),
        dumpsterLabel: data.dumpsterLabel ?? null,
        material: data.material ?? null,
        productCode: data.productCode ?? null,

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
        placement: data.placement ?? null,
        instructions: data.instructions ?? null,
        customerNotes: data.customerNotes ?? null,

        locationVerified: Boolean(data.locationVerified),
        locationVerificationNote: data.locationVerificationNote ?? null,

        deliveryDate: new Date(data.deliveryDate),
        pickupDate: data.pickupDate ? new Date(data.pickupDate) : null,
        pickupDateUnknown: Boolean(data.pickupDateUnknown),
        rentalDaysIncluded: Number(data.rentalDaysIncluded ?? 7),

        bookingStatus: data.bookingStatus ?? BookingStatus.QUOTE,
        paymentStatus: data.paymentStatus ?? PaymentStatus.UNPAID,

        basePrice: new Prisma.Decimal(data.basePrice ?? 0),
        deliveryFee: new Prisma.Decimal(data.deliveryFee ?? 0),
        mileageFee: new Prisma.Decimal(data.mileageFee ?? 0),
        extraDaysFee: new Prisma.Decimal(data.extraDaysFee ?? 0),
        overageFee: new Prisma.Decimal(data.overageFee ?? 0),
        addonsTotal: new Prisma.Decimal(data.addonsTotal ?? 0),
        total: new Prisma.Decimal(data.total ?? 0),
      },
      include: {
        dumpster: true,
        addons: true,
      },
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateBooking = async (id: string, data: any) => {
  // TODO: Implement booking update logic
  return await prisma.booking.update({
    where: { id },
    data,
    include: {
      dumpster: true,
      addons: {
        include: {
          addon: true,
        },
      },
    },
  });
};

export const deleteBooking = async (id: string) => {
  // TODO: Implement soft delete or check constraints
  await prisma.booking.delete({
    where: { id },
  });
  return true;
};

export const getBookingNotes = async (bookingId: string) => {
  return await prisma.bookingNote.findMany({
    where: { bookingId },
    orderBy: { createdAt: 'desc' },
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
    orderBy: { createdAt: 'desc' },
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
  // TODO: Validate addon exists and is active
  const addon = await prisma.addon.findUnique({
    where: { id: data.addonId },
  });

  if (!addon || !addon.isActive) {
    throw new Error('Addon not found or inactive');
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

export const removeBookingAddon = async (bookingId: string, addonId: string) => {
  const deleted = await prisma.bookingAddon.deleteMany({
    where: {
      bookingId,
      id: addonId,
    },
  });
  return deleted.count > 0;
};