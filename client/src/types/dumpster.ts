type Dumpster = {
  id: string;
  label: string;
  size: number;
  sizeLabel: string;
  status: "available" | "reserved" | "active" | "maintenance";
  serialNumber?: string;
  color?: string;
  notes?: string;
};