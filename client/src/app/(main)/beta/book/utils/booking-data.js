export const MATERIAL_OPTIONS = [
  { value: "construction-debris", label: "Construction Debris" },
  { value: "concrete", label: "Concrete" },
  { value: "msw-trash", label: "MSW (Trash)" },
];

export const DUMPSTER_PRODUCTS = [
  {
    id: "15yd-heavy",
    label: "15yd Dumpster",
    size: 15,
    basePrice: 399,
    includedWeightText: "0 tons included ($0.00/ton over)",
    includedDays: 7,
    supportedMaterials: ["concrete", "construction-debris"],
  },
  {
    id: "17yd-general",
    label: "17yd Dumpster",
    size: 17,
    basePrice: 425,
    includedWeightText: "2 tons included",
    includedDays: 7,
    supportedMaterials: ["construction-debris", "msw-trash"],
  },
  {
    id: "22yd-general",
    label: "22yd Dumpster",
    size: 22,
    basePrice: 525,
    includedWeightText: "3 tons included",
    includedDays: 7,
    supportedMaterials: ["construction-debris", "msw-trash"],
  },
  {
    id: "30yd-general",
    label: "30yd Dumpster",
    size: 30,
    basePrice: 650,
    includedWeightText: "4 tons included",
    includedDays: 7,
    supportedMaterials: ["construction-debris", "msw-trash"],
  },
];

export const ADDON_PRICING = {
  drivewayProtection: 29.99,
  priorityDelivery: 49.99,
};