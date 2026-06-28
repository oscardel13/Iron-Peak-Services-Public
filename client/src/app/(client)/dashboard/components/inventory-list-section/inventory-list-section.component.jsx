"use client";

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

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black ${
        props.className || ""
      }`}
    />
  );
}

export default function InventoryListSection({
  search,
  onSearchChange,
  filteredInventory,
  selectedId,
  onSelectInventory,
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <Input
          placeholder="Search dumpster, yard, size, status..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        {filteredInventory.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No inventory found.</div>
        ) : (
          filteredInventory.map((item) => {
            const isSelected = item.id === selectedId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectInventory(item)}
                className={`w-full border-b border-gray-100 p-4 text-left transition hover:bg-gray-50 ${
                  isSelected ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.id}</p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      item.status
                    )}`}
                  >
                    {item.status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p>{item.size} Yard</p>
                  <p>{item.yardLocation}</p>
                  <p>{item.serialNumber}</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}