import type { PrismaClient } from "../../../src/generated/prisma/client.js";

import { dumpstersData } from "./dumpsters.data.js";

export async function seedDumpsters(prisma: PrismaClient) {
  console.log("🗑️ Seeding dumpsters...");

  for (const dumpster of dumpstersData) {
    await prisma.dumpster.upsert({
      where: {
        id: dumpster.id,
      },

      update: {
        label: dumpster.label,
        size: dumpster.size,
        sizeLabel: dumpster.sizeLabel,
        serialNumber: dumpster.serialNumber,

        primaryColor: dumpster.primaryColor,
        secondaryColor: dumpster.secondaryColor,
        colorPattern: dumpster.colorPattern,

        status: dumpster.status,
        basePrice: dumpster.basePrice,
        concretePrice: dumpster.concretePrice,
        notes: dumpster.notes,
        isActive: dumpster.isActive,
      },

      create: {
        id: dumpster.id,
        label: dumpster.label,
        size: dumpster.size,
        sizeLabel: dumpster.sizeLabel,
        serialNumber: dumpster.serialNumber,

        primaryColor: dumpster.primaryColor,
        secondaryColor: dumpster.secondaryColor,
        colorPattern: dumpster.colorPattern,

        status: dumpster.status,
        basePrice: dumpster.basePrice,
        concretePrice: dumpster.concretePrice,
        notes: dumpster.notes,
        isActive: dumpster.isActive,
      },
    });
  }

  console.log(`   ✓ ${dumpstersData.length} dumpsters seeded`);
}
