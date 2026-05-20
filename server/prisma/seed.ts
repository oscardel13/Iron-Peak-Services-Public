import "dotenv/config";
import { PrismaClient, DumpsterStatus } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const addons = [
  {
    code: "drivewayProtection",
    name: "Driveway Surface Protection",
    description: "Protective boards for driveway contact points.",
    price: 29.99,
    isActive: true,
  },
  {
    code: "priorityDelivery",
    name: "Priority Delivery",
    description: "Move your delivery up in scheduling priority.",
    price: 49.99,
    isActive: true,
  },
];

const dumpsters = [
  {
    id: "dumpster-17-1",
    label: "17 Yard Dumpster #1",
    size: 17,
    sizeLabel: "17 Yard",
    serialNumber: "DMP-17-001",
    color: "Green",
    status: DumpsterStatus.AVAILABLE,
    basePrice: 375,
    concretePrice: 150,
    notes: "Ready for dispatch.",
    isActive: true,
  },
  {
    id: "dumpster-17-2",
    label: "17 Yard Dumpster #2",
    size: 17,
    sizeLabel: "17 Yard",
    serialNumber: "DMP-17-002",
    color: "Green",
    status: DumpsterStatus.IN_USE,
    basePrice: 375,
    concretePrice: 150,
    notes: "Currently out on a job.",
    isActive: true,
  },
  {
    id: "dumpster-17-3",
    label: "17 Yard Dumpster #3",
    size: 17,
    sizeLabel: "17 Yard",
    serialNumber: "DMP-17-003",
    color: "Green",
    status: DumpsterStatus.AVAILABLE,
    basePrice: 375,
    concretePrice: 150,
    notes: "Available and ready.",
    isActive: true,
  },
  {
    id: "dumpster-22-1",
    label: "22 Yard Dumpster #1",
    size: 22,
    sizeLabel: "22 Yard",
    serialNumber: "DMP-22-001",
    color: "Blue",
    status: DumpsterStatus.RESERVED,
    basePrice: 450,
    concretePrice: 180,
    notes: "Scheduled for upcoming delivery.",
    isActive: true,
  },
  {
    id: "dumpster-22-2",
    label: "22 Yard Dumpster #2",
    size: 22,
    sizeLabel: "22 Yard",
    serialNumber: "DMP-22-002",
    color: "Blue",
    status: DumpsterStatus.AVAILABLE,
    basePrice: 450,
    concretePrice: 180,
    notes: "Ready for dispatch.",
    isActive: true,
  },
];

async function main() {
  console.log("Seeding dumpsters...");

  for (const dumpster of dumpsters) {
    await prisma.dumpster.upsert({
      where: { id: dumpster.id },
      update: {
        label: dumpster.label,
        size: dumpster.size,
        sizeLabel: dumpster.sizeLabel,
        serialNumber: dumpster.serialNumber,
        color: dumpster.color,
        status: dumpster.status,
        basePrice: dumpster.basePrice,
        concretePrice: dumpster.concretePrice,
        notes: dumpster.notes,
        isActive: dumpster.isActive,
      },
      create: dumpster,
    });
  }

  console.log("Seeding addons...");

  for (const addon of addons) {
    await prisma.addon.upsert({
      where: { code: addon.code },
      update: {
        name: addon.name,
        description: addon.description,
        price: addon.price,
        isActive: addon.isActive,
      },
      create: addon,
    });
  }

  console.log("Seeding admin user...");

  await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {
      accessLevel: "OWNER",
      isActive: true,
    },
    create: {
      email: "admin@example.com",
      name: "Oscar",
      accessLevel: "OWNER",
      isActive: true,
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });