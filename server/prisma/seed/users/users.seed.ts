import type { PrismaClient } from "../../../src/generated/prisma/client.js";
import type { AccessLevel } from "../../../src/generated/prisma/client.js";

import { usersData } from "./users.data.js";

export async function seedUsers(prisma: PrismaClient) {
  console.log("👤 Seeding users...");

  for (const user of usersData) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },

      update: {
        name: user.name,
        accessLevel: user.accessLevel as AccessLevel,
        isActive: user.isActive,
      },

      create: {
        ...user,
        accessLevel: user.accessLevel as AccessLevel,
      },
    });
  }

  console.log(`   ✓ ${usersData.length} users seeded`);
}
