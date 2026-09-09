"use client";

import { useEffect, useMemo, useState } from "react";

import InventorySummaryCards from "../../components/inventory-summary-cards/inventory-summary-cards.component";
import InventoryListSection from "../../components/inventory-list-section/inventory-list-section.component";
import InventoryCardSection from "../../components/inventory-card-section/inventory-card-section.component";
import InventoryTimelineSection from "../../components/inventory-timeline-section/inventory-timeline-section.component";

import { getAPI } from "../../../../../utils/api";

import { normalizeInventoryResponse } from "../../components/dumpster-timeline/dumpster-timeline.utils";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTimelineDumpsterId, setSelectedTimelineDumpsterId] =
    useState("ALL");

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventoryPageData = async () => {
      try {
        setLoading(true);
        setError("");

        const inventoryResponse = await getAPI("/inventory/dumpsters");
        const nextInventory = normalizeInventoryResponse(inventoryResponse);

        setInventory(nextInventory);

        if (nextInventory.length > 0) {
          setSelectedId((prev) => prev ?? nextInventory[0].id);
          setDraft((prev) => prev ?? nextInventory[0]);
        }
      } catch (error) {
        console.error("Failed to fetch inventory page data:", error);
        setError("Failed to load inventory data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryPageData();
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
        item.primaryColor,
        item.secondaryColor,
        item.colorPattern,
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

  function handleSelectTimelineDumpsterId(value) {
    setSelectedTimelineDumpsterId(value);

    if (value !== "ALL") {
      const selectedDumpster = inventory.find((item) => item.id === value);

      if (selectedDumpster) {
        handleSelectInventory(selectedDumpster);
      }
    }
  }

  function handleSelectDumpsterFromTimeline(item) {
    handleSelectInventory(item);
    setSelectedTimelineDumpsterId(item.id);
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
        item.id === updatedInventory.id ? updatedInventory : item,
      ),
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
    <div className="w-full min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">
            View, manage, edit, and schedule dumpster availability.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          </div>

          <div className="h-[360px] animate-pulse rounded-3xl bg-gray-100" />
        </div>
      ) : (
        <>
          <InventorySummaryCards inventory={inventory} />

          <InventoryTimelineSection
            inventory={inventory}
            selectedTimelineDumpsterId={selectedTimelineDumpsterId}
            onSelectedDumpsterIdChange={handleSelectTimelineDumpsterId}
            onSelectDumpster={handleSelectDumpsterFromTimeline}
          />

          <div className="grid min-w-0 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
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
        </>
      )}
    </div>
  );
}
