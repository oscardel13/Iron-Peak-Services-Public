"use client";

import StatCard from "../../components/StatCard/statCard.component";

export default function InventorySummaryCards({ inventory }) {
  const available = inventory.filter((item) => item.status === "AVAILABLE").length;
  const reserved = inventory.filter((item) => item.status === "RESERVED").length;
  const inUse = inventory.filter((item) => item.status === "IN_USE").length;
  const maintenance = inventory.filter(
    (item) => item.status === "MAINTENANCE" || item.status === "OUT_OF_SERVICE"
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