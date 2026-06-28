"use client";

import Link from "next/link";

const actions = [
  {
    label: "New Booking",
    href: "/dashboard/bookings",
    description: "Create or review a booking fast",
  },
  {
    label: "View Inventory",
    href: "/dashboard/inventory",
    description: "Check availability before assigning",
  },
  {
    label: "Quotes To Follow Up",
    href: "/dashboard/bookings",
    description: "Reach out on open quotes",
  },
  {
    label: "Maintenance Check",
    href: "/dashboard/inventory",
    description: "Review dumpsters needing service",
  },
];

export default function DashboardQuickActions() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <p className="mt-1 text-sm text-gray-500">
          Shortcuts for the most common tasks.
        </p>
      </div>

      <div className="grid gap-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
          >
            <p className="font-medium text-gray-900">{action.label}</p>
            <p className="mt-1 text-sm text-gray-500">{action.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}