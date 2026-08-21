import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

import { seedDumpsters } from "./seed/dumpsters/dumpsters.seed.js";
import { seedAddons } from "./seed/addons/addons.seed.js";
import { seedDumpsterBookings } from "./seed/dumpster-bookings/dumpster-bookings.seed.js";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Order matters because bookings reference dumpsters.
  await seedDumpsters(prisma);
  await seedAddons(prisma);
  await seedDumpsterBookings(prisma);

  console.log("\n✅ Database seed complete");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
