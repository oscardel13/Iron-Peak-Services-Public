"use client";

const tabs = [
  {
    id: "calendar",
    label: "Schedule Calendar",
    description: "Deliveries and pickups by date.",
  },
  {
    id: "timeline",
    label: "Dumpster Timeline",
    description: "Rental windows by dumpster.",
  },
];

export default function CalendarTabs({ activeTab, onChange }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
      <div className="grid gap-1 sm:grid-cols-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`rounded-xl px-4 py-3 text-left transition ${
                isActive
                  ? "bg-gray-950 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <p className="text-sm font-bold">{tab.label}</p>
              <p
                className={`mt-0.5 text-xs ${
                  isActive ? "text-white/70" : "text-gray-500"
                }`}
              >
                {tab.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
