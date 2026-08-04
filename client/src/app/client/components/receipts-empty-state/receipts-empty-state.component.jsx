"use client";

import Link from "next/link";

export default function ReceiptsEmptyState({ selectedYearLabel }) {
  return (
    <section className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
      <p className="text-lg font-semibold text-gray-900">No receipts found</p>

      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        No paid receipts were found for {selectedYearLabel}. Completed or paid
        bookings will appear here automatically.
      </p>

      <div className="mt-5 flex justify-center gap-3">
        <Link
          href="/client/bookings"
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          View bookings
        </Link>

        <Link
          href="/book"
          className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover"
        >
          Book new dumpster
        </Link>
      </div>
    </section>
  );
}
