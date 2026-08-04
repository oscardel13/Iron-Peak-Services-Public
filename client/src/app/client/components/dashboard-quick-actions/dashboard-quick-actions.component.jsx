"use client";

import Link from "next/link";

const actions = [
  {
    label: "Book New Dumpster",
    href: "/book",
    description: "Start a new rental and checkout online.",
    icon: "＋",
    tone: "default",
  },
  {
    label: "View My Bookings",
    href: "/client/bookings",
    description: "See upcoming, active, and completed rentals.",
    icon: "📋",
    tone: "default",
  },
  {
    label: "Request a Change",
    href: "/client/bookings",
    description: "Open a booking to request pickup, reschedule, or add a note.",
    icon: "↗",
    tone: "default",
  },
  {
    label: "Receipts",
    href: "/client/receipts",
    description: "View payment history and download receipts.",
    icon: "🧾",
    tone: "default",
  },
];

function getActionClasses(tone) {
  if (tone === "primary") {
    return "border-brand-primary bg-brand-primary text-white hover:bg-brand-primary-hover";
  }

  return "border-gray-200 bg-white text-gray-900 hover:border-brand-primary/40 hover:bg-gray-50";
}

function getDescriptionClasses(tone) {
  if (tone === "primary") {
    return "text-white/80";
  }

  return "text-gray-500";
}

export default function DashboardQuickActions() {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-lg font-semibold text-gray-900">Quick Actions</p>
        <h2 className="mt-1 text-md font-semibold text-gray-900">
          What would you like to do?
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage rentals, receipts, and booking requests from one place.
        </p>
      </div>

      <div className="grid gap-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`group rounded-2xl border p-4 transition ${getActionClasses(
              action.tone,
            )}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                  action.tone === "primary"
                    ? "bg-white/15 text-white"
                    : "bg-gray-100 text-gray-700 group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
                }`}
              >
                {action.icon}
              </span>

              <div>
                <p className="font-semibold">{action.label}</p>
                <p
                  className={`mt-1 text-sm ${getDescriptionClasses(
                    action.tone,
                  )}`}
                >
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
