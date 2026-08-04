import { prisma } from "../libs/prisma.js";
import {
  AccessLevel,
  AuthProviderType,
  Prisma,
  BookingActorType,
  NoteVisibility,
} from "../generated/prisma/client.js";

type RequestUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  picture?: string | null;
  accessLevel?: AccessLevel;
  isActive?: boolean;
  client?: {
    id: string;
    displayName?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
};

function createServiceError(message: string, statusCode = 400) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || null;
}

function normalizePhone(phone?: string | null) {
  return phone?.replace(/\D/g, "") || null;
}

function safeUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    picture: user.picture,
    accessLevel: user.accessLevel,
    isActive: user.isActive,
  };
}

function isAdminOrOwner(requestUser?: RequestUser | null) {
  return (
    requestUser?.accessLevel === AccessLevel.ADMIN ||
    requestUser?.accessLevel === AccessLevel.OWNER
  );
}

function getActorLabel(requestUser?: RequestUser | null) {
  return (
    requestUser?.client?.displayName ||
    requestUser?.name ||
    requestUser?.email ||
    "Client"
  );
}

function getClientAccessFilter(requestUser?: RequestUser | null) {
  const clientId = requestUser?.client?.id ?? null;
  const email = normalizeEmail(requestUser?.email);

  const ownershipFilters = [
    ...(clientId ? [{ clientId }] : []),
    ...(email ? [{ customerEmail: email }] : []),
  ];

  return {
    clientId,
    email,
    ownershipFilters,
  };
}

function getClientNoteVisibility() {
  return NoteVisibility.CUSTOMER;
}

function normalizeMoney(value: unknown) {
  return Number(value || 0);
}

function normalizeBookingListItem(booking: any) {
  return {
    id: booking.id,
    bookingNumber: booking.bookingNumber,

    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,

    deliveryDate: booking.deliveryDate,
    pickupDate: booking.pickupDate,
    pickupDateUnknown: booking.pickupDateUnknown,

    address1: booking.address1,
    address2: booking.address2,
    city: booking.city,
    state: booking.state,
    zip: booking.zip,

    dumpsterId: booking.dumpsterId,
    dumpsterLabel: booking.dumpsterLabel,
    dumpsterSize: booking.dumpsterSize,
    material: booking.material,

    placement: booking.placement,

    basePrice: normalizeMoney(booking.basePrice),
    deliveryFee: normalizeMoney(booking.deliveryFee),
    mileageFee: normalizeMoney(booking.mileageFee),
    extraDaysFee: normalizeMoney(booking.extraDaysFee),
    overageFee: normalizeMoney(booking.overageFee),
    addonsTotal: normalizeMoney(booking.addonsTotal),
    total: normalizeMoney(booking.total),

    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,

    dumpster: booking.dumpster,
    addons: booking.addons,
  };
}

function normalizeBookingDetail(booking: any) {
  return {
    ...normalizeBookingListItem(booking),

    serviceType: booking.serviceType,
    projectType: booking.projectType,

    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    customerEmail: booking.customerEmail,

    rentalDaysIncluded: booking.rentalDaysIncluded,

    instructions: booking.instructions,
    locationVerified: booking.locationVerified,
    locationVerificationNote: booking.locationVerificationNote,

    priorityDelivery: booking.priorityDelivery,
    deliveryTime: booking.deliveryTime,
    priorityDeliveryNote: booking.priorityDeliveryNote,

    notes: booking.notes,

    paidAt: booking.paidAt,
    confirmedAt: booking.confirmedAt,
    scheduledAt: booking.scheduledAt,
    deliveredAt: booking.deliveredAt,
    pickedUpAt: booking.pickedUpAt,
    cancelledAt: booking.cancelledAt,
    completedAt: booking.completedAt,
  };
}

async function getClientOwnedBookingOrThrow(
  bookingId: string,
  requestUser?: RequestUser | null,
) {
  if (!bookingId) {
    throw createServiceError("Booking ID is required.", 400);
  }

  const { ownershipFilters } = getClientAccessFilter(requestUser);

  if (!isAdminOrOwner(requestUser) && ownershipFilters.length === 0) {
    throw createServiceError("Client profile is required.", 403);
  }

  const booking = await prisma.booking.findFirst({
    where: isAdminOrOwner(requestUser)
      ? {
          id: bookingId,
        }
      : {
          id: bookingId,
          OR: ownershipFilters,
        },
    include: {
      dumpster: true,
      addons: {
        include: {
          addon: true,
        },
      },
      notes: {
        where: {
          visibility: getClientNoteVisibility(),
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!booking) {
    throw createServiceError("Booking not found.", 404);
  }

  return booking;
}

export async function createClientAccount(data: {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  picture?: string | null;
  provider?: AuthProviderType;
  providerAccountId?: string | null;
  username?: string | null;
}) {
  const name = data.name?.trim() || null;
  const email = normalizeEmail(data.email);
  const phone = normalizePhone(data.phone);
  const picture = data.picture || null;
  const username = data.username || null;
  const provider = data.provider ?? AuthProviderType.EMAIL;
  const providerAccountId = data.providerAccountId?.trim() || null;

  if (!email) {
    throw createServiceError("Email is required.", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: {
      client: true,
      authProviders: true,
    },
  });

  if (existingUser?.client) {
    throw createServiceError("An account with this email already exists.", 409);
  }

  if (existingUser && !existingUser.client) {
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        accessLevel: AccessLevel.CLIENT,
        phone: existingUser.phone || phone,
        client: {
          create: {
            displayName: existingUser.name || name,
            email: existingUser.email || email,
            phone: existingUser.phone || phone,
          },
        },
      },
      include: {
        client: true,
      },
    });

    if (!updatedUser.client) {
      throw createServiceError("Failed to create client profile.", 500);
    }

    if (providerAccountId) {
      await prisma.userAuthProvider.upsert({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        update: {
          userId: updatedUser.id,
          email,
          username,
          name: updatedUser.name || name,
          picture,
        },
        create: {
          userId: updatedUser.id,
          provider,
          providerAccountId,
          email,
          username,
          name: updatedUser.name || name,
          picture,
        },
      });
    }

    return {
      user: safeUser(updatedUser),
      client: updatedUser.client,
    };
  }

  const userCreateData: Prisma.UserCreateInput = {
    name,
    email,
    phone,
    picture,
    accessLevel: AccessLevel.CLIENT,
    isActive: true,
    client: {
      create: {
        displayName: name,
        email,
        phone,
      },
    },
    ...(providerAccountId
      ? {
          authProviders: {
            create: {
              provider,
              providerAccountId,
              email,
              username,
              name,
              picture,
            },
          },
        }
      : {}),
  };

  const user = await prisma.user.create({
    data: userCreateData,
    include: {
      client: true,
    },
  });

  if (!user.client) {
    throw createServiceError("Failed to create client profile.", 500);
  }

  return {
    user: safeUser(user),
    client: user.client,
  };
}

export async function getOrCreateClientForUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      client: true,
    },
  });

  if (!user) {
    throw createServiceError("User not found.", 404);
  }

  if (user.client) {
    return user.client;
  }

  return await prisma.client.create({
    data: {
      userId: user.id,
      displayName: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
}

export async function getClientBookings(requestUser?: RequestUser | null) {
  const { ownershipFilters } = getClientAccessFilter(requestUser);

  if (!isAdminOrOwner(requestUser) && ownershipFilters.length === 0) {
    throw createServiceError("Client profile is required.", 403);
  }

  const bookings = await prisma.booking.findMany({
    where: isAdminOrOwner(requestUser)
      ? {}
      : {
          OR: ownershipFilters,
        },
    include: {
      dumpster: true,
      addons: {
        include: {
          addon: true,
        },
      },
    },
    orderBy: [
      {
        deliveryDate: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return bookings.map(normalizeBookingListItem);
}

export async function getClientBookingById(
  bookingId: string,
  requestUser?: RequestUser | null,
) {
  const booking = await getClientOwnedBookingOrThrow(bookingId, requestUser);

  return normalizeBookingDetail(booking);
}

export async function createClientBookingNote(
  bookingId: string,
  data: any,
  requestUser?: RequestUser | null,
) {
  const booking = await getClientOwnedBookingOrThrow(bookingId, requestUser);
  const body = String(data?.body || "").trim();

  if (!body) {
    throw createServiceError("Note body is required.", 400);
  }

  const note = await prisma.bookingNote.create({
    data: {
      bookingId: booking.id,
      visibility: getClientNoteVisibility(),
      body,
    },
  });

  await prisma.bookingHistory.create({
    data: {
      bookingId: booking.id,
      eventType: "CLIENT_NOTE_CREATED",
      actorType: BookingActorType.CLIENT,
      actorLabel: getActorLabel(requestUser),
      summary: "Client added a note.",
      metadata: {
        noteId: note.id,
      },
    },
  });

  return note;
}

export async function createClientBookingChangeRequest(
  bookingId: string,
  data: any,
  requestUser?: RequestUser | null,
) {
  const booking = await getClientOwnedBookingOrThrow(bookingId, requestUser);

  const type = String(data?.type || "GENERAL")
    .trim()
    .toUpperCase();
  const message = String(data?.message || "").trim();

  if (!message) {
    throw createServiceError("Change request message is required.", 400);
  }

  const requestedDeliveryDate = data?.requestedDeliveryDate || null;
  const requestedPickupDate = data?.requestedPickupDate || null;

  const noteBody = [
    `Change request: ${type}`,
    message,
    requestedDeliveryDate
      ? `Requested delivery date: ${requestedDeliveryDate}`
      : null,
    requestedPickupDate
      ? `Requested pickup date: ${requestedPickupDate}`
      : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const note = await prisma.bookingNote.create({
    data: {
      bookingId: booking.id,
      visibility: getClientNoteVisibility(),
      body: noteBody,
    },
  });

  const history = await prisma.bookingHistory.create({
    data: {
      bookingId: booking.id,
      eventType: "CLIENT_CHANGE_REQUESTED",
      actorType: BookingActorType.CLIENT,
      actorLabel: getActorLabel(requestUser),
      summary: `Client requested a booking change: ${type}.`,
      metadata: {
        type,
        message,
        requestedDeliveryDate,
        requestedPickupDate,
        noteId: note.id,
      },
    },
  });

  return {
    type,
    message,
    requestedDeliveryDate,
    requestedPickupDate,
    note,
    history,
  };
}
