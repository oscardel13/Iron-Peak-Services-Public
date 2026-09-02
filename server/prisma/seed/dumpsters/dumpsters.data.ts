import {
  DumpsterColor,
  DumpsterPattern,
  DumpsterStatus,
} from "../../../src/generated/prisma/client.js";

export const dumpstersData = [
  {
    id: "dumpster-17-1",
    label: "17 Yard Dumpster #1",
    size: 17,
    sizeLabel: "17 Yard",
    serialNumber: "DMP-17-001",

    primaryColor: DumpsterColor.EMERALD,
    secondaryColor: null,
    colorPattern: DumpsterPattern.SOLID,

    status: DumpsterStatus.AVAILABLE,

    basePrice: 375,
    concretePrice: 150,

    notes: "Ready for dispatch. Solid emerald test.",
    isActive: true,
  },

  {
    id: "dumpster-17-2",
    label: "17 Yard Dumpster #2",
    size: 17,
    sizeLabel: "17 Yard",
    serialNumber: "DMP-17-002",

    primaryColor: DumpsterColor.EMERALD,
    secondaryColor: DumpsterColor.PINK,
    colorPattern: DumpsterPattern.STRIPE,

    status: DumpsterStatus.IN_USE,

    basePrice: 375,
    concretePrice: 150,

    notes: "Currently out on a job. Emerald and pink stripe test.",
    isActive: true,
  },

  {
    id: "dumpster-17-3",
    label: "17 Yard Dumpster #3",
    size: 17,
    sizeLabel: "17 Yard",
    serialNumber: "DMP-17-003",

    primaryColor: DumpsterColor.EMERALD,
    secondaryColor: DumpsterColor.ORANGE,
    colorPattern: DumpsterPattern.DOT,

    status: DumpsterStatus.AVAILABLE,

    basePrice: 375,
    concretePrice: 150,

    notes: "Available and ready. Emerald with orange dot test.",
    isActive: true,
  },

  {
    id: "dumpster-22-1",
    label: "22 Yard Dumpster #1",
    size: 22,
    sizeLabel: "22 Yard",
    serialNumber: "DMP-22-001",

    primaryColor: DumpsterColor.BLUE,
    secondaryColor: null,
    colorPattern: DumpsterPattern.SOLID,

    status: DumpsterStatus.RESERVED,

    basePrice: 450,
    concretePrice: 180,

    notes: "Scheduled for upcoming delivery. Solid blue test.",
    isActive: true,
  },

  {
    id: "dumpster-22-2",
    label: "22 Yard Dumpster #2",
    size: 22,
    sizeLabel: "22 Yard",
    serialNumber: "DMP-22-002",

    primaryColor: DumpsterColor.BLUE,
    secondaryColor: DumpsterColor.ROSE,
    colorPattern: DumpsterPattern.SPLIT,

    status: DumpsterStatus.AVAILABLE,

    basePrice: 450,
    concretePrice: 180,

    notes: "Ready for dispatch. Blue and rose split test.",
    isActive: true,
  },
];
