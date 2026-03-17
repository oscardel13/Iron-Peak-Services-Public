export const INVENTORY = [
  {
    id: "dumpster-17-1",
    label: "17 Yard Dumpster #1",
    size: 17,
    sizeLabel: "17 Yard",
    status: "available", // available | reserved | active | maintenance
    serialNumber: "IPS-17-001",
    color: "orange",
    notes: "",
  },
  {
    id: "dumpster-17-2",
    label: "17 Yard Dumpster #2",
    size: 17,
    sizeLabel: "17 Yard",
    status: "active",
    serialNumber: "IPS-17-002",
    color: "orange",
    notes: "",
  },
  {
    id: "dumpster-22-1",
    label: "22 Yard Dumpster #1",
    size: 22,
    sizeLabel: "22 Yard",
    status: "reserved",
    serialNumber: "IPS-22-001",
    color: "orange",
    notes: "",
  },
];

export const INVENTORY_SUMMARY = {
  total: 3,
  available: 1,
  active: 1,
  reserved: 1,
  maintenance: 0,
};