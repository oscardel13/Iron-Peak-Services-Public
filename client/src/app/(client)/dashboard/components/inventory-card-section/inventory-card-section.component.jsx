"use client";

import { DUMPSTER_STATUSES } from "@/data/inventory";
import { formatDateTime } from "@/utils/helpers";

function getStatusClasses(status) {
  const map = {
    AVAILABLE: "bg-green-100 text-green-700",
    RESERVED: "bg-blue-100 text-blue-700",
    IN_USE: "bg-amber-100 text-amber-700",
    MAINTENANCE: "bg-orange-100 text-orange-700",
    OUT_OF_SERVICE: "bg-red-100 text-red-700",
  };

  return map[status] || "bg-slate-100 text-slate-700";
}

function Label({ children }) {
  return (
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black disabled:bg-gray-50 disabled:text-gray-500 ${
        props.className || ""
      }`}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black disabled:bg-gray-50 disabled:text-gray-500 ${
        props.className || ""
      }`}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black disabled:bg-gray-50 disabled:text-gray-500 ${
        props.className || ""
      }`}
    />
  );
}

export default function InventoryCardSection({
  inventoryToRender,
  isEditing,
  handleEdit,
  handleCancelEdit,
  handleSave,
  updateDraft,
}) {
  if (!inventoryToRender) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6 text-sm text-gray-500">Select an inventory item.</div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-200 p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {inventoryToRender.label}
            </h2>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                inventoryToRender.status
              )}`}
            >
              {inventoryToRender.status.replaceAll("_", " ")}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                inventoryToRender.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {inventoryToRender.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">{inventoryToRender.id}</p>
          <p className="mt-2 text-sm text-gray-600">
            {inventoryToRender.sizeLabel || `${inventoryToRender.size} Yard`}
          </p>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Edit inventory
            </button>
          ) : (
            <>
              <button
                onClick={handleCancelEdit}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
              >
                Save changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 p-5">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-4">
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Dumpster Details
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>Label</Label>
                <Input
                  value={inventoryToRender.label || ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("label", e.target.value)}
                />
              </div>

              <div>
                <Label>Size</Label>
                <Input
                  type="number"
                  value={inventoryToRender.size ?? ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("size", Number(e.target.value))}
                />
              </div>

              <div>
                <Label>Size Label</Label>
                <Input
                  value={inventoryToRender.sizeLabel || ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("sizeLabel", e.target.value)}
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={inventoryToRender.status || "AVAILABLE"}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("status", e.target.value)}
                >
                  {DUMPSTER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Serial Number</Label>
                <Input
                  value={inventoryToRender.serialNumber || ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("serialNumber", e.target.value)}
                />
              </div>

              <div>
                <Label>Color</Label>
                <Input
                  value={inventoryToRender.color || ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("color", e.target.value)}
                />
              </div>

              <div>
                <Label>Record Active</Label>
                <Select
                  value={inventoryToRender.isActive ? "true" : "false"}
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateDraft("isActive", e.target.value === "true")
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Notes
            </h3>

            <Textarea
              rows={10}
              value={inventoryToRender.notes || ""}
              disabled={!isEditing}
              onChange={(e) => updateDraft("notes", e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Metadata
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Created
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDateTime(inventoryToRender.createdAt)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Updated
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDateTime(inventoryToRender.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}