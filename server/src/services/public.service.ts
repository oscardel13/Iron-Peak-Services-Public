import { prisma } from '../libs/prisma.js';

export const getAvailableDumpsters = async (query: any) => {
  // TODO: Implement availability check based on dates
  return await prisma.dumpster.findMany({
    where: {
      isActive: true,
      status: 'AVAILABLE',
    },
    orderBy: { size: 'asc' },
  });
};

export const getAddons = async () => {
  return await prisma.addon.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
};

export const createQuote = async (data: any) => {
  // TODO: Implement quote creation (similar to booking but with QUOTE status)
  return await prisma.booking.create({
    data: {
      ...data,
      bookingStatus: 'QUOTE',
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
};

export const getQuoteById = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      dumpster: true,
      addons: {
        include: {
          addon: true,
        },
      },
      notes: {
        where: { visibility: 'CUSTOMER' },
      },
    },
  });

  // Only return if it's a quote
  if (booking?.bookingStatus !== 'QUOTE') {
    return null;
  }

  return booking;
};

// module.exports = {
//   getAvailableDumpsters,
//   getAddons,
//   createQuote,
//   getQuoteById,
// };
