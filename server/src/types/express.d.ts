import type { AccessLevel } from "../src/generated/prisma/client.js";

declare global {
  namespace Express {
    interface User {
      id: string;
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      picture?: string | null;
      accessLevel: AccessLevel;
      isActive: boolean;
      lastLoginAt?: Date | null;
    }
  }
}

export {};