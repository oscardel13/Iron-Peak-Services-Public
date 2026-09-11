import {
  InventoryCategory,
  InventoryStatus,
  InventoryUnit,
  InventoryColor,
  InventoryPattern,
  BookingStatus,
} from "../generated/prisma/client.js";
import { prisma } from "../libs/prisma.js";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function parseDate(value: unknown) {
  if (!value) return null;

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getQueryString(value: unknown) {
  if (Array.isArray(value)) {
    return value[0] ? String(value[0]) : null;
  }

  if (value === undefined || value === null) {
    return null;
  }

  return String(value);
}

function normalizeInventoryItemForOldFrontend(item: any) {
  return {
    ...item,

    // Temporary backwards-compatible fields.
    dumpsterId: item.id,
    dumpsterLabel: item.label,
    dumpsterSize: item.sizeValue ? Number(item.sizeValue) : null,

    size: item.sizeValue ? Number(item.sizeValue) : null,
    sizeLabel: item.sizeValue
      ? `${Number(item.sizeValue)} ${
          item.sizeUnit === InventoryUnit.YARD ? "Yard" : item.sizeUnit
        }`
      : null,
  };
}

function normalizeInventoryItemsForOldFrontend(items: any[]) {
  return items.map(normalizeInventoryItemForOldFrontend);
}

function normalizeInventoryCreateData(tenantId: string, data: any) {
  return {
    tenant: {
      connect: {
        id: tenantId,
      },
    },

    category: data.category ?? InventoryCategory.DUMPSTER,

    label: data.label,
    name: data.name ?? null,
    description: data.description ?? null,

    sizeValue:
      data.sizeValue !== undefined
        ? data.sizeValue
        : data.size !== undefined
          ? data.size
          : null,

    sizeUnit: data.sizeUnit ?? InventoryUnit.YARD,

    serialNumber: data.serialNumber ?? null,

    primaryColor: data.primaryColor ?? InventoryColor.SLATE,
    secondaryColor: data.secondaryColor ?? null,
    colorPattern: data.colorPattern ?? InventoryPattern.SOLID,

    status: data.status ?? InventoryStatus.AVAILABLE,
    notes: data.notes ?? null,
    isActive: data.isActive ?? true,

    basePrice: data.basePrice ?? 0,
    concretePrice: data.concretePrice ?? 0,
  };
}

function normalizeInventoryUpdateData(data: any) {
  return {
    ...(data.category !== undefined ? { category: data.category } : {}),

    ...(data.label !== undefined ? { label: data.label } : {}),
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(data.description !== undefined
      ? { description: data.description }
      : {}),

    ...(data.sizeValue !== undefined
      ? { sizeValue: data.sizeValue }
      : data.size !== undefined
        ? { sizeValue: data.size }
        : {}),

    ...(data.sizeUnit !== undefined ? { sizeUnit: data.sizeUnit } : {}),

    ...(data.serialNumber !== undefined
      ? { serialNumber: data.serialNumber }
      : {}),

    ...(data.primaryColor !== undefined
      ? { primaryColor: data.primaryColor }
      : {}),
    ...(data.secondaryColor !== undefined
      ? { secondaryColor: data.secondaryColor }
      : {}),
    ...(data.colorPattern !== undefined
      ? { colorPattern: data.colorPattern }
      : {}),

    ...(data.status !== undefined ? { status: data.status } : {}),
    ...(data.notes !== undefined ? { notes: data.notes } : {}),
    ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),

    ...(data.basePrice !== undefined ? { basePrice: data.basePrice } : {}),
    ...(data.concretePrice !== undefined
      ? { concretePrice: data.concretePrice }
      : {}),
  };
}

export const getInventoryItems = async (tenantId: string, query: any) => {
  const status = getQueryString(query.status);
  const category = getQueryString(query.category);

  const items = await prisma.inventoryItem.findMany({
    where: {
      tenantId,
      isActive: true,
      ...(status ? { status: status as InventoryStatus } : {}),
      ...(category ? { category: category as InventoryCategory } : {}),
    },
    orderBy: [
      {
        sizeValue: "asc",
      },
      {
        label: "asc",
      },
    ],
  });

  return normalizeInventoryItemsForOldFrontend(items);
};

export const getInventoryItemsFilteredByDates = async (
  tenantId: string,
  query: any,
) => {
  const deliveryDate =
    parseDate(getQueryString(query.deliveryDate)) ?? new Date();

  const pickupDate =
    parseDate(getQueryString(query.pickupDate)) ?? addDays(deliveryDate, 14);

  const usableInventoryItems = await prisma.inventoryItem.findMany({
    where: {
      tenantId,
      isActive: true,
      status: {
        notIn: [InventoryStatus.MAINTENANCE, InventoryStatus.OUT_OF_SERVICE],
      },
    },
    orderBy: [
      {
        sizeValue: "asc",
      },
      {
        label: "asc",
      },
    ],
  });

  const conflictingBookingItems = await prisma.bookingInventoryItem.findMany({
    where: {
      tenantId,
      inventoryItemId: {
        not: null,
      },
      booking: {
        bookingStatus: {
          in: [
            BookingStatus.SCHEDULED,
            BookingStatus.CONFIRMED,
            BookingStatus.ACTIVE,
          ],
        },
        deliveryDate: {
          lt: pickupDate,
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
    },
    select: {
      inventoryItemId: true,
    },
  });

  const unavailableInventoryItemIds = new Set(
    conflictingBookingItems
      .map((bookingItem) => bookingItem.inventoryItemId)
      .filter(Boolean),
  );

  const availableItems = usableInventoryItems.filter(
    (item) => !unavailableInventoryItemIds.has(item.id),
  );

  return normalizeInventoryItemsForOldFrontend(availableItems);
};

export const getInventoryItemById = async (tenantId: string, id: string) => {
  const item = await prisma.inventoryItem.findFirst({
    where: {
      tenantId,
      id,
    },
  });

  return item ? normalizeInventoryItemForOldFrontend(item) : null;
};

export const createInventoryItem = async (tenantId: string, data: any) => {
  const item = await prisma.inventoryItem.create({
    data: normalizeInventoryCreateData(tenantId, data),
  });

  return normalizeInventoryItemForOldFrontend(item);
};

export const updateInventoryItem = async (
  tenantId: string,
  id: string,
  data: any,
) => {
  const existingItem = await prisma.inventoryItem.findFirst({
    where: {
      tenantId,
      id,
    },
  });

  if (!existingItem) {
    return null;
  }

  const item = await prisma.inventoryItem.update({
    where: {
      id,
    },
    data: normalizeInventoryUpdateData(data),
  });

  return normalizeInventoryItemForOldFrontend(item);
};

export const deleteInventoryItem = async (tenantId: string, id: string) => {
  const existingItem = await prisma.inventoryItem.findFirst({
    where: {
      tenantId,
      id,
    },
  });

  if (!existingItem) {
    return false;
  }

  await prisma.inventoryItem.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });

  return true;
};

export const lockInventoryItem = async (tenantId: string, id: string) => {
  const existingItem = await prisma.inventoryItem.findFirst({
    where: {
      tenantId,
      id,
    },
  });

  if (!existingItem) {
    return null;
  }

  const item = await prisma.inventoryItem.update({
    where: {
      id,
    },
    data: {
      status: InventoryStatus.RESERVED,
    },
  });

  return normalizeInventoryItemForOldFrontend(item);
};

export const unlockInventoryItem = async (tenantId: string, id: string) => {
  const existingItem = await prisma.inventoryItem.findFirst({
    where: {
      tenantId,
      id,
    },
  });

  if (!existingItem) {
    return null;
  }

  const item = await prisma.inventoryItem.update({
    where: {
      id,
    },
    data: {
      status: InventoryStatus.AVAILABLE,
    },
  });

  return normalizeInventoryItemForOldFrontend(item);
};

// Temporary backwards-compatible aliases.
// Remove these after all callers move from dumpster -> inventory item.
export const getDumpsters = getInventoryItems;
export const getDumpsterById = getInventoryItemById;
export const createDumpster = createInventoryItem;
export const updateDumpster = updateInventoryItem;
export const getDumpstersFilteredByDates = getInventoryItemsFilteredByDates;
export const deleteDumpster = deleteInventoryItem;
export const lockDumpster = lockInventoryItem;
export const unlockDumpster = unlockInventoryItem;

export const getAddons = async (tenantId: string, query: any) => {
  const addons = await prisma.addon.findMany({
    where: {
      tenantId,
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return addons;
};

export const getAddonById = async (tenantId: string, id: string) => {
  return prisma.addon.findFirst({
    where: {
      tenantId,
      id,
    },
  });
};

export const createAddon = async (tenantId: string, data: any) => {
  return prisma.addon.create({
    data: {
      tenant: {
        connect: {
          id: tenantId,
        },
      },
      code: data.code,
      name: data.name,
      description: data.description ?? null,
      price: data.price ?? 0,
      isActive: data.isActive ?? true,
    },
  });
};

export const updateAddon = async (tenantId: string, id: string, data: any) => {
  const existingAddon = await prisma.addon.findFirst({
    where: {
      tenantId,
      id,
    },
  });

  if (!existingAddon) {
    return null;
  }

  return prisma.addon.update({
    where: {
      id,
    },
    data: {
      ...(data.code !== undefined ? { code: data.code } : {}),
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
    },
  });
};

export const deleteAddon = async (tenantId: string, id: string) => {
  const existingAddon = await prisma.addon.findFirst({
    where: {
      tenantId,
      id,
    },
  });

  if (!existingAddon) {
    return false;
  }

  await prisma.addon.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });

  return true;
};
