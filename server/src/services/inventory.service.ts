import { prisma } from '../libs/prisma.js';

export const getDumpsters = async (query: any) => {
  // TODO: Implement filtering by status, size, etc.
  return await prisma.dumpster.findMany({
    where: { isActive: true },
    orderBy: { size: 'asc' },
  });
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