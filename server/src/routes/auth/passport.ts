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
  COOKIE_MAX_AGE: Number(
    process.env.CLIENT_MAX_AGE || 1000 * 60 * 60 * 24 * 7
  ),

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

function isAdminUser(accessLevel: AccessLevel) {
  return accessLevel === AccessLevel.ADMIN || accessLevel === AccessLevel.OWNER;
}

export async function findAdminFromProvider({
  provider,
  providerId,
  email,
}: ProviderInput) {
  if (!providerId) {
    throw new Error(`Missing providerId for ${provider}`);
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
    },
  });

  // Optional fallback: allow login by matching email
  // This helps when you manually create admin users before linking Google.
  if (!user && email) {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        authProviders: true,
      },
    });

    if (user && user.isActive && isAdminUser(user.accessLevel)) {
      await prisma.userAuthProvider.upsert({
        where: {
          provider_providerAccountId: {
            provider: providerType,
            providerAccountId: providerId,
          },
        },
        update: {
          email,
        },
        create: {
          userId: user.id,
          provider: providerType,
          providerAccountId: providerId,
          email,
        },
      });
    }
  }

  if (!user) {
    throw new Error("No admin account found for this login.");
  }

  if (!user.isActive) {
    throw new Error("This account is inactive.");
  }

  if (!isAdminUser(user.accessLevel)) {
    throw new Error("You do not have admin access.");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
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
      },
    });

    if (!user || !user.isActive || !isAdminUser(user.accessLevel)) {
      return done(null, false);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});