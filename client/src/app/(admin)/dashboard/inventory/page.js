"use client";

import { useEffect, useMemo, useState } from "react";

import InventorySummaryCards from "../components/inventory-summary-cards/inventory-summary-cards.component";
import InventoryListSection from "../components/inventory-list-section/inventory-list-section.component";
import InventoryCardSection from "../components/inventory-card-section/inventory-card-section.component";
import { getAPI } from "../../../../utils/api";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await getAPI("/inventory/dumpsters");

        const nextInventory = Array.isArray(response.data)
          ? response.data
          : response.data?.dumpsters ?? response.data?.inventory ?? [];

        setInventory(nextInventory);

        if (nextInventory.length > 0) {
          setSelectedId((prev) => prev ?? nextInventory[0].id);
          setDraft((prev) => prev ?? nextInventory[0]);
        }
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  const selectedInventory =
    inventory.find((item) => item.id === selectedId) || null;

  const filteredInventory = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return inventory;

    return inventory.filter((item) => {
      const haystack = [
        item.id,
        item.label,
        item.status,
        item.size,
        item.sizeLabel,
        item.serialNumber,
        item.color,
        item.notes,
        item.isActive ? "active" : "inactive",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [inventory, search]);

  function handleSelectInventory(item) {
    setSelectedId(item.id);
    setDraft(item);
    setIsEditing(false);
  }

  function handleEdit() {
    if (!selectedInventory) return;
    setDraft(structuredClone(selectedInventory));
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setDraft(selectedInventory);
    setIsEditing(false);
  }

  function handleSave() {
    if (!draft) return;

    const updatedInventory = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };

    setInventory((prev) =>
      prev.map((item) =>
        item.id === updatedInventory.id ? updatedInventory : item
      )
    );

    setDraft(updatedInventory);
    setIsEditing(false);
  }

  function updateDraft(path, value) {
    setDraft((prev) => {
      if (!prev) return prev;

      const next = structuredClone(prev);
      const keys = path.split(".");
      let current = next;

      for (let i = 0; i < keys.length - 1; i += 1) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
        <p className="mt-1 text-sm text-gray-500">
          View, manage, and edit dumpster inventory.
        </p>
      </div>

      <InventorySummaryCards inventory={inventory} />

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <InventoryListSection
          search={search}
          onSearchChange={setSearch}
          filteredInventory={filteredInventory}
          selectedId={selectedId}
          onSelectInventory={handleSelectInventory}
        />

        <InventoryCardSection
          inventoryToRender={isEditing ? draft : selectedInventory}
          isEditing={isEditing}
          handleEdit={handleEdit}
          handleCancelEdit={handleCancelEdit}
          handleSave={handleSave}
          updateDraft={updateDraft}
        />
      </div>
    </div>
  );
}