// routes/client/client.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { AccessLevel } from "../../generated/prisma/client.js";

type AuthenticatedUser = {
  id: string;
  email: string | null;
  accessLevel: AccessLevel;
  isActive: boolean;
  client?: {
    id: string;
    displayName: string | null;
    email: string | null;
    phone: string | null;
  } | null;
};

function getRequestUser(req: Request) {
  return req.user as AuthenticatedUser | undefined;
}

export function requireRole(allowedRoles: AccessLevel[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = getRequestUser(req);

    if (!user) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: "Account is inactive.",
      });
    }

    if (!allowedRoles.includes(user.accessLevel)) {
      return res.status(403).json({
        error: "Not authorized.",
      });
    }

    next();
  };
}

export const requireAdmin = requireRole([AccessLevel.ADMIN, AccessLevel.OWNER]);

export const requireClientDashboard = requireRole([
  AccessLevel.CLIENT,
  AccessLevel.ADMIN,
  AccessLevel.OWNER,
]);

export function requireClientProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = getRequestUser(req);

  if (!user) {
    return res.status(401).json({
      error: "Authentication required.",
    });
  }

  if (
    user.accessLevel === AccessLevel.ADMIN ||
    user.accessLevel === AccessLevel.OWNER
  ) {
    return next();
  }

  if (!user.client?.id) {
    return res.status(403).json({
      error: "Client profile is required.",
    });
  }

  next();
}

export function getAuthenticatedUser(req: Request) {
  const user = getRequestUser(req);

  if (!user) {
    throw new Error("Authentication required.");
  }

  return user;
}

export function getAuthenticatedClientId(req: Request) {
  const user = getAuthenticatedUser(req);

  if (!user.client?.id) {
    throw new Error("Client profile is required.");
  }

  return user.client.id;
}

export function isAdminOrOwner(user: AuthenticatedUser) {
  return (
    user.accessLevel === AccessLevel.ADMIN ||
    user.accessLevel === AccessLevel.OWNER
  );
}
