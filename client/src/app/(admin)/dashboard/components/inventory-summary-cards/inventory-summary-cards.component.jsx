"use client";

import StatCard from "../../components/StatCard/statCard.component";

export default function InventorySummaryCards({ inventory }) {
  const available = inventory.filter((item) => item.status === "available").length;
  const reserved = inventory.filter((item) => item.status === "reserved").length;
  const inUse = inventory.filter((item) => item.status === "in_use").length;
  const maintenance = inventory.filter(
    (item) => item.status === "maintenance" || item.status === "out_of_service"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Available" value={available} />
      <StatCard label="Reserved" value={reserved} />
      <StatCard label="In Use" value={inUse} />
      <StatCard label="Needs Attention" value={maintenance} />
    </div>
  );
}