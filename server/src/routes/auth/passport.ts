// routes/auth/passport.ts
import "dotenv/config";
import { Passport } from "passport";
import {
  AccessLevel,
  AuthProviderType,
} from "../../generated/prisma/client.js";
import { prisma } from "../../libs/prisma.js";

export const passport = new Passport();

export const config = {
  API_URL: process.env.API_URL || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
  COOKIE_MAX_AGE: Number(process.env.CLIENT_MAX_AGE || 1000 * 60 * 60 * 24 * 7),

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
};

type Provider = "google" | "meta" | "x";

type ProviderInput = {
  provider: Provider;
  providerId: string;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
  username?: string | null;
};

const providerMap: Record<Provider, AuthProviderType> = {
  google: AuthProviderType.GOOGLE,
  meta: AuthProviderType.META,
  x: AuthProviderType.X,
};

const ALLOWED_ADMIN_EMAILS: Record<string, AccessLevel> = {
  [process.env.ADMIN_EMAILS as string]: AccessLevel.ADMIN,
  [process.env.OWNER_EMAILS as string]: AccessLevel.OWNER,
};

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || null;
}

function isAdminUser(accessLevel: AccessLevel) {
  return accessLevel === AccessLevel.ADMIN || accessLevel === AccessLevel.OWNER;
}

function getAllowedAccessLevel(email?: string | null) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) return null;

  return ALLOWED_ADMIN_EMAILS[normalizedEmail] ?? null;
}

export async function findOrCreateAdminFromProvider({
  provider,
  providerId,
  email,
  name,
  picture,
  username,
}: ProviderInput) {
  if (!providerId) {
    throw new Error(`Missing providerId for ${provider}`);
  }

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error("Email is required for admin login.");
  }

  const allowedAccessLevel = getAllowedAccessLevel(normalizedEmail);

  if (!allowedAccessLevel) {
    throw new Error("This email is not allowed to access the admin dashboard.");
  }

  const providerType = providerMap[provider];

  // 1. Try finding by OAuth provider account first.
  let user = await prisma.user.findFirst({
    where: {
      isActive: true,
      authProviders: {
        some: {
          provider: providerType,
          providerAccountId: providerId,
        },
      },
    },
    include: {
      authProviders: true,
    },
  });

  // 2. If no provider match, try finding by email.
  if (!user) {
    user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      include: {
        authProviders: true,
      },
    });
  }

  // 3. If still no user, create one — only because email is allowlisted.
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name ?? null,
        picture: picture ?? null,
        accessLevel: allowedAccessLevel,
        isActive: true,
        lastLoginAt: new Date(),
        authProviders: {
          create: {
            provider: providerType,
            providerAccountId: providerId,
            email: normalizedEmail,
            username: username ?? null,
            name: name ?? null,
            picture: picture ?? null,
          },
        },
      },
      include: {
        authProviders: true,
      },
    });

    return user;
  }

  // 4. Existing user must be active.
  if (!user.isActive) {
    throw new Error("This account is inactive.");
  }

  // 5. Force allowed access level from allowlist.
  // This is useful while bootstrapping auth.
  if (user.accessLevel !== allowedAccessLevel) {
    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        accessLevel: allowedAccessLevel,
      },
      include: {
        authProviders: true,
      },
    });
  }

  // 6. Existing user must still be admin/owner.
  if (!isAdminUser(user.accessLevel)) {
    throw new Error("You do not have admin access.");
  }

  // 7. Make sure OAuth provider is linked.
  await prisma.userAuthProvider.upsert({
    where: {
      provider_providerAccountId: {
        provider: providerType,
        providerAccountId: providerId,
      },
    },
    update: {
      email: normalizedEmail,
      username: username ?? null,
      name: name ?? null,
      picture: picture ?? null,
    },
    create: {
      userId: user.id,
      provider: providerType,
      providerAccountId: providerId,
      email: normalizedEmail,
      username: username ?? null,
      name: name ?? null,
      picture: picture ?? null,
    },
  });

  // 8. Update user profile/login metadata.
  user = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: user.name ?? name ?? null,
      picture: user.picture ?? picture ?? null,
      lastLoginAt: new Date(),
    },
    include: {
      authProviders: true,
    },
  });

  return user;
}

export async function findOrCreateClientFromProvider({
  provider,
  providerId,
  email,
  name,
  picture,
  username,
}: ProviderInput) {
  if (!providerId) {
    throw new Error(`Missing providerId for ${provider}`);
  }

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error("Email is required for client login.");
  }

  const providerType = providerMap[provider];

  let user = await prisma.user.findFirst({
    where: {
      isActive: true,
      authProviders: {
        some: {
          provider: providerType,
          providerAccountId: providerId,
        },
      },
    },
    include: {
      authProviders: true,
      client: true,
    },
  });

  if (!user) {
    user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      include: {
        authProviders: true,
        client: true,
      },
    });
  }

  if (
    user &&
    (user.accessLevel === AccessLevel.ADMIN ||
      user.accessLevel === AccessLevel.OWNER)
  ) {
    throw new Error("Admin accounts must use the admin login.");
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name ?? null,
        picture: picture ?? null,
        accessLevel: AccessLevel.CLIENT,
        isActive: true,
        lastLoginAt: new Date(),
        client: {
          create: {
            displayName: name ?? null,
            email: normalizedEmail,
            phone: null,
          },
        },
        authProviders: {
          create: {
            provider: providerType,
            providerAccountId: providerId,
            email: normalizedEmail,
            username: username ?? null,
            name: name ?? null,
            picture: picture ?? null,
          },
        },
      },
      include: {
        authProviders: true,
        client: true,
      },
    });

    return user;
  }

  if (!user.isActive) {
    throw new Error("This account is inactive.");
  }

  await prisma.userAuthProvider.upsert({
    where: {
      provider_providerAccountId: {
        provider: providerType,
        providerAccountId: providerId,
      },
    },
    update: {
      email: normalizedEmail,
      username: username ?? null,
      name: name ?? null,
      picture: picture ?? null,
    },
    create: {
      userId: user.id,
      provider: providerType,
      providerAccountId: providerId,
      email: normalizedEmail,
      username: username ?? null,
      name: name ?? null,
      picture: picture ?? null,
    },
  });

  if (!user.client) {
    await prisma.client.create({
      data: {
        userId: user.id,
        displayName: user.name ?? name ?? null,
        email: user.email ?? normalizedEmail,
        phone: user.phone ?? null,
      },
    });
  }

  user = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: user.name ?? name ?? null,
      picture: user.picture ?? picture ?? null,
      lastLoginAt: new Date(),
    },
    include: {
      authProviders: true,
      client: true,
    },
  });

  return user;
}

passport.serializeUser((user: any, done) => {
  done(null, {
    id: user.id,
    email: user.email,
    accessLevel: user.accessLevel,
  });
});

passport.deserializeUser(async (sessionUser: any, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: sessionUser.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        picture: true,
        accessLevel: true,
        isActive: true,
        lastLoginAt: true,
        client: {
          select: {
            id: true,
            displayName: true,
            email: true,
            phone: true,
          },
        },
        driver: {
          select: {
            id: true,
          },
        },
        worker: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return done(null, false);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});
