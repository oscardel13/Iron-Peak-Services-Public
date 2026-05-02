import { prisma } from '../libs/prisma.ts';
import { Prisma, BookingStatus, PaymentStatus, ServiceType } from "../generated/prisma/client.js";
import { calculateBookingPricing, getSelectedAddons } from '../helpers/bookings.helper.ts';
import { buildBookingUpdateData } from '../utils/helper.ts';


const generateBookingNumber = () => {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BK-${yyyy}${mm}${dd}-${rand}`;
};

// TODO: Implement filtering, pagination, etc.
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

export const createBooking = async (data: any) => {
  try {
    const bookingNumber = generateBookingNumber();

    const dumpster = data.dumpsterId
      ? await prisma.dumpster.findUnique({
          where: { id: data.dumpsterId },
        })
      : null;

    if (!dumpster) {
      throw new Error("A valid dumpsterId is required to create a booking.");
    }

    const selectedAddonCodes = Object.entries(data.addons ?? {})
      .filter(([, selected]) => Boolean(selected))
      .map(([code]) => code);

    const selectedAddons = selectedAddonCodes.length
      ? await prisma.addon.findMany({
          where: {
            code: { in: selectedAddonCodes },
            isActive: true,
          },
        })
      : [];

    const addonsTotal = selectedAddons.reduce((sum, addon) => {
      return sum + Number(addon.price);
    }, 0);

    const pricing = calculateBookingPricing({
      basePrice: dumpster.basePrice,
      concretePrice: dumpster.concretePrice,
      material: data.material,

      rentalDays: data.rentalDays,
      rentalDaysIncluded: data.rentalDaysIncluded ?? 7,

      deliveryFee: data.deliveryFee ?? 0,
      mileageFee: data.mileageFee ?? 0,
      overageFee: data.overageFee ?? 0,

      addonsTotal,
    });

    return await prisma.booking.create({
      data: {
        bookingNumber,

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

        quotedAt: new Date(),

        basePrice: new Prisma.Decimal(pricing.basePrice),
        deliveryFee: new Prisma.Decimal(pricing.deliveryFee),
        mileageFee: new Prisma.Decimal(pricing.mileageFee),
        extraDaysFee: new Prisma.Decimal(pricing.extraDaysFee),
        overageFee: new Prisma.Decimal(pricing.overageFee),
        addonsTotal: new Prisma.Decimal(pricing.addonsTotal),
        total: new Prisma.Decimal(pricing.total),

        addons: {
          create: selectedAddons.map((addon) => ({
            addonId: addon.id,
            addonCodeSnapshot: addon.code,
            addonNameSnapshot: addon.name,
            addonPriceSnapshot: addon.price,
            quantity: 1,
          })),
        },
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
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const patchBooking = async (id: string, data: any) => {
  console.log(`Patching booking ${id} with data:`, data);

  const updateData = buildBookingUpdateData(data);

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided for update");
  }

  return await prisma.booking.update({
    where: { id },
    data: updateData,
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