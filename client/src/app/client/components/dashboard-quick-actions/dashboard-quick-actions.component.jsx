"use client";

import Link from "next/link";

import BookingTrigger from "@/features/client-book/components/booking-trigger/booking-trigger.component";

const actions = [
  {
    label: "View My Bookings",
    href: "/client/bookings",
    description: "See upcoming, active, and completed rentals.",
    icon: "📋",
  },
  {
    label: "Request a Change",
    href: "/client/bookings",
    description: "Open a booking to request pickup, reschedule, or add a note.",
    icon: "↗",
  },
  {
    label: "Receipts",
    href: "/client/receipts",
    description: "View payment history and download receipts.",
    icon: "🧾",
  },
];

function QuickActionContent({ action, primary = false }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
          primary
            ? "bg-white/15 text-white"
            : "bg-gray-100 text-gray-700 group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
        }`}
      >
        {action.icon}
      </span>

      <div className="min-w-0">
        <p className="font-semibold">{action.label}</p>
        <p
          className={`mt-1 text-sm ${
            primary ? "text-white/85" : "text-gray-500"
          }`}
        >
          {action.description}
        </p>
      </div>
    </div>
  );
}

export default function DashboardQuickActions() {
  const bookingAction = {
    label: "Book New Dumpster",
    description: "Start a new rental and checkout online.",
    icon: "＋",
  };

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
        <BookingTrigger
          source="client-dashboard"
          variant="unstyled"
          className="group w-full rounded-2xl border border-gray-200 bg-gray-950 p-4 text-left text-white transition hover:bg-gray-800 cursor-pointer"
        >
          <QuickActionContent action={bookingAction} primary />
        </BookingTrigger>

        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 transition hover:border-brand-primary/40 hover:bg-gray-50"
          >
            <QuickActionContent action={action} />
          </Link>
        ))}
      </div>
    </section>
  );
}
