import { prisma } from "../libs/prisma.js";
import {
  AccessLevel,
  AuthProviderType,
  Prisma,
} from "../generated/prisma/client.js";

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

    return {
      user: safeUser(updatedUser),
      client: updatedUser.client,
    };
  }

  const providerAccountId = data.providerAccountId?.trim() || null;

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
