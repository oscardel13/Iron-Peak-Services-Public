import type { PrismaClient } from "../../../src/generated/prisma/client.js";

import { addonsData } from "./addons.data.js";

export async function seedAddons(prisma: PrismaClient) {
  console.log("➕ Seeding addons...");

  for (const addon of addonsData) {
    await prisma.addon.upsert({
      where: {
        code: addon.code,
      },

      update: addon,

      create: addon,
    });
  }

  console.log(`   ✓ ${addonsData.length} addons seeded`);
}
