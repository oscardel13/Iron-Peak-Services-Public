import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  console.log("Seeding dumpsters...");

  await prisma.dumpster.createMany({
    data: [
      {
        label: "17 Yard Dumpster #1",
        size: 17,
        sizeLabel: "17 Yard",
        serialNumber: "IPS-17-001",
        status: "AVAILABLE",
      },
      {
        label: "17 Yard Dumpster #2",
        size: 17,
        sizeLabel: "17 Yard",
        serialNumber: "IPS-17-002",
        status: "AVAILABLE",
      },
      {
        label: "22 Yard Dumpster #1",
        size: 22,
        sizeLabel: "22 Yard",
        serialNumber: "IPS-22-001",
        status: "AVAILABLE",
      },
    ],
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });