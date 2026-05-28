// routes/auth/auth.router.ts
import "dotenv/config";
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

import { passport, config } from "./passport.js";
import { checkLoggedIn } from "./middleware.js";

import { configureGooglePassport } from "./google.passport.js";
// import { configureFacebookPassport } from "./facebook.passport.js";
// import { configureXPassport } from "./x.passport.js";

const allowedClientOrigins = process.env.ORIGIN_WHITELIST?.split(",") || [];

export const authRouter = Router();

configureGooglePassport();
// configureFacebookPassport();
// configureXPassport();

function encodeOAuthState(state: object) {
  return Buffer.from(JSON.stringify(state)).toString("base64url");
}

function decodeOAuthState(value: unknown) {
  if (typeof value !== "string") return null;

  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function getRequestOrigin(req: Request) {
  const origin = req.get("origin");
  const referer = req.get("referer");

  if (origin) return origin;

  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }

  return null;
}

function getSafeClientOrigin(req: Request) {
  const requestOrigin = getRequestOrigin(req);

  if (requestOrigin && allowedClientOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return config.CLIENT_URL;
}

function getSafeRedirectPath(path: unknown) {
  if (typeof path !== "string") return "/";

  // Prevent open redirects
  if (!path.startsWith("/")) return "/";
  if (path.startsWith("//")) return "/";

  return path;
}

// ---------- GOOGLE LOGIN ----------
authRouter.get(
  "/user/google",
  (req: Request, res: Response, next: NextFunction) => {
    const redirectPath = getSafeRedirectPath(req.query.path);
    const clientOrigin = getSafeClientOrigin(req);

    const state = encodeOAuthState({
      redirectPath,
      clientOrigin,
    });

    passport.authenticate("google", {
      scope: ["email", "profile"],
      state,
    })(req, res, next);
  }
);

authRouter.get(
  "/user/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
  }),
  (req: Request, res: Response) => {
    const state = decodeOAuthState(req.query.state) as {
      redirectPath?: string;
      clientOrigin?: string;
    } | null;

    const clientOrigin =
      state?.clientOrigin && allowedClientOrigins.includes(state.clientOrigin)
        ? state.clientOrigin
        : config.CLIENT_URL;

    const redirectPath = getSafeRedirectPath(state?.redirectPath);

    const redirectUrl = new URL(redirectPath, clientOrigin).toString();

    res.redirect(redirectUrl);
  }
);

// ---------- FACEBOOK LOGIN ----------
// Uncomment once you add configureFacebookPassport()

// authRouter.get(
//   "/user/facebook",
//   stashRedirect,
//   passport.authenticate("facebook", {
//     scope: ["email", "public_profile"],
//   })
// );

// authRouter.get(
//   "/user/facebook/callback",
//   passport.authenticate("facebook", {
//     failureRedirect: "/auth/failure",
//   }),
//   (req: Request, res: Response) => {
//     const clientOrigin = getSafeClientOrigin(req) || config.CLIENT_URL;
//     const redirectPath = req.session?.redirectUrl || "/";
//     const redirectUrl = new URL(redirectPath, clientOrigin).toString();

//     delete req.session.redirectUrl;

//     res.redirect(redirectUrl);
//   }
// );

// ---------- ME ----------
authRouter.get("/me", checkLoggedIn, (req: Request, res: Response) => {
  res.status(200).json({
    user: req.user,
  });
});

// ---------- FAILURE ----------
authRouter.get("/failure", (req: Request, res: Response) => {
  res.status(401).send("Failed to log in");
});

// ---------- LOGOUT ----------
authRouter.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.status(200).send("logged out");
      });
    } else {
      res.clearCookie("connect.sid");
      res.status(200).send("logged out");
    }
  });
});