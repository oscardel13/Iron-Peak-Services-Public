import { prisma } from '../libs/prisma.ts';

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

        dumpsterSize: data.dumpsterSize,
        dumpsterLabel: data.dumpsterLabel ?? null,
        material: data.material ?? null,
        productCode: data.productCode ?? null,

        deliveryDate: new Date(data.deliveryDate),
        pickupDate: data.pickupDate ? new Date(data.pickupDate) : null,
        pickupDateUnknown: Boolean(data.pickupDateUnknown),

        basePrice: data.basePrice,
        deliveryFee: data.deliveryFee ?? 0,
        mileageFee: data.mileageFee ?? 0,
        extraDaysFee: data.extraDaysFee ?? 0,
        overageFee: data.overageFee ?? 0,
        addonsTotal: data.addonsTotal ?? 0,
        total: data.total,

        bookingStatus: data.bookingStatus ?? 'QUOTE',
        paymentStatus: data.paymentStatus ?? 'UNPAID',
        serviceType: data.serviceType ?? 'DUMPSTER_RENTAL',
        rentalDaysIncluded: data.rentalDaysIncluded ?? 7,
        locationVerified: Boolean(data.locationVerified),
        locationVerificationNote: data.locationVerificationNote ?? null,
        projectType: data.projectType ?? null
      },
      include: {
        dumpster: true,
        addons: true,
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error);
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