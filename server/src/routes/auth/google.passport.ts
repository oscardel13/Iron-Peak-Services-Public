// routes/auth/google.passport.ts
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Profile, VerifyCallback } from "passport-google-oauth20";

import {
  passport,
  config,
  findAdminFromProvider,
} from "./passport.ts";

const AUTH_OPTIONS = {
  callbackURL: `${config.API_URL}/auth/user/google/callback`,
  clientID: config.GOOGLE_CLIENT_ID || "",
  clientSecret: config.GOOGLE_CLIENT_SECRET || "",
};

async function verifyGoogleCallback(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) {
  try {
    const json = profile._json as {
      sub?: string;
      email?: string;
      email_verified?: boolean;
      name?: string;
      picture?: string;
    };

    const sub = json.sub;
    const email = json.email;
    const emailVerified = json.email_verified;

    if (!sub) {
      return done(null, false, {
        message: "Missing Google account id",
      });
    }

    if (!email) {
      return done(null, false, {
        message: "Missing Google email",
      });
    }

    if (!emailVerified) {
      return done(null, false, {
        message: "Email not verified",
      });
    }

    const user = await findAdminFromProvider({
      provider: "google",
      providerId: sub,
      email
    });

    return done(null, user);
  } catch (err) {
    return done(err as Error);
  }
}

export function configureGooglePassport() {
  passport.use(new GoogleStrategy(AUTH_OPTIONS, verifyGoogleCallback));
}