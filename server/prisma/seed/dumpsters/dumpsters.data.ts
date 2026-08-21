import { DumpsterStatus } from "../../../src/generated/prisma/client.js";

export const dumpstersData = [
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
