// routes/auth/auth.router.ts
import "dotenv/config";
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

import { passport, config } from "./passport.js";
import { checkLoggedIn } from "./middleware.js";

import { configureGooglePassport } from "./google.passport.js";
// import { configureFacebookPassport } from "./facebook.passport.js";
// import { configureXPassport } from "./x.passport.js";

export const authRouter = Router();

configureGooglePassport();
// configureFacebookPassport();
// configureXPassport();

const CLIENT_URL = config.CLIENT_URL;

function stashRedirect(req: Request, res: Response, next: NextFunction) {
  const path = typeof req.query.path === "string" ? req.query.path : "/";

  if (req.session) {
    req.session.redirectUrl = path;
  }

  next();
}

// ---------- GOOGLE LOGIN ----------
authRouter.get(
  "/user/google",
  stashRedirect,
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

authRouter.get(
  "/user/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
  }),
  (req: Request, res: Response) => {
    const redirectUrl = `${CLIENT_URL}${req.session?.redirectUrl || "/"}`;

    if (req.session) {
      delete req.session.redirectUrl;
    }

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
//     const redirectUrl = `${CLIENT_URL}${req.session.redirectUrl || "/"}`;

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