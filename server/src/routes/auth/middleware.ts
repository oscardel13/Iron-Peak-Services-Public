import type { Request, Response, NextFunction } from "express";
import { AccessLevel } from "../../generated/prisma/client.js";

export function checkLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
    console.log("AUTH DEBUG ----------------");
  console.log("Origin:", req.headers.origin);
  console.log("Cookie header:", req.headers.cookie);
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  console.log("User:", req.user);
  const isLoggedIn =
    typeof req.isAuthenticated === "function" &&
    req.isAuthenticated() &&
    req.user;

  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must log in!",
    });
  }

  next();
}

export function requireAccessLevel(...allowedAccessLevels: AccessLevel[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: "You must log in!",
      });
    }

    if (!allowedAccessLevels.includes(user.accessLevel)) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    next();
  };
}

export const requireAdmin = requireAccessLevel(
  AccessLevel.ADMIN,
  AccessLevel.OWNER
);

export const requireOwner = requireAccessLevel(AccessLevel.OWNER);