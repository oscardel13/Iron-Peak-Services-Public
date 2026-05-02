import { prisma } from '../libs/prisma.js';

export const getDumpsters = async (query: any) => {
  // TODO: Implement filtering by status, size, etc.
  return await prisma.dumpster.findMany({
    where: { isActive: true },
    orderBy: { size: 'asc' },
  });
};

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

// TODO: gets available dumpsters for given dates or if 
// no dates provided, gets dumpster available now
export const getDumpstersFilteredByDates = async (query: any) => {
  const deliveryDate = query.deliveryDate
    ? new Date(query.deliveryDate)
    : new Date();

  const pickupDate = query.pickupDate
    ? new Date(query.pickupDate)
    : addDays(deliveryDate, 14);

  const dumpsters = await getDumpsters(query);

  const usableDumpsters = dumpsters.filter(
    (dumpster) =>
      dumpster.status !== "MAINTENANCE" &&
      dumpster.status !== "OUT_OF_SERVICE"
  );

  const conflictingBookings = await prisma.booking.findMany({
    where: {
      dumpsterId: {
        not: null,
      },
      deliveryDate: {
        lte: pickupDate,
      },
      OR: [
        {
          pickupDate: {
            gte: deliveryDate,
          },
        },
        {
          pickupDateUnknown: true,
        },
      ],
    },
    select: {
      dumpsterId: true,
    },
  });

  const unavailableDumpsterIds = new Set(
    conflictingBookings
      .map((booking) => booking.dumpsterId)
      .filter(Boolean)
  );

  return usableDumpsters.filter(
    (dumpster) => !unavailableDumpsterIds.has(dumpster.id)
  );
};


export const getDumpsterById = async (id: string) => {
  return await prisma.dumpster.findUnique({
    where: { id },
  });
};

export const createDumpster = async (data: any) => {
  return await prisma.dumpster.create({
    data,
  });
};

export const updateDumpster = async (id: string, data: any) => {
  return await prisma.dumpster.update({
    where: { id },
    data,
  });
};

export const deleteDumpster = async (id: string) => {
  // TODO: Check if dumpster is in use
  await prisma.dumpster.update({
    where: { id },
    data: { isActive: false },
  });
  return true;
};

export const lockDumpster = async (id: string) => {
  return await prisma.dumpster.update({
    where: { id },
    data: { status: 'RESERVED'},
  });
}

export const unlockDumpster = async (id: string) => {
  return await prisma.dumpster.update({
    where: { id },
    data: { status: 'AVAILABLE'},
  });
}

export const getAddons = async (query: any) => {
  return await prisma.addon.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
};

export const getAddonById = async (id: string) => {
  return await prisma.addon.findUnique({
    where: { id },
  });
};

export const createAddon = async (data: any) => {
  return await prisma.addon.create({
    data,
  });
};

export const updateAddon = async (id: string, data: any) => {
  return await prisma.addon.update({
    where: { id },
    data,
  });
};

export const deleteAddon = async (id: string) => {
  // TODO: Check if addon is used in bookings
  await prisma.addon.update({
    where: { id },
    data: { isActive: false },
  });
  return true;
};