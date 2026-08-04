"use client";

import Link from "next/link";

function formatMoney(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getPaymentStatusLabel(status) {
  const labels = {
    PAID: "Paid",
    UNPAID: "Unpaid",
    PENDING: "Pending",
    DEPOSIT_PAID: "Deposit paid",
    FAILED: "Failed",
    REFUNDED: "Refunded",
  };

  return labels[status] || status || "Unknown";
}

function getPaymentStatusClasses(status) {
  const classes = {
    PAID: "border-green-200 bg-green-50 text-green-700",
    UNPAID: "border-red-200 bg-red-50 text-red-700",
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    DEPOSIT_PAID: "border-blue-200 bg-blue-50 text-blue-700",
    FAILED: "border-red-200 bg-red-50 text-red-700",
    REFUNDED: "border-gray-200 bg-gray-50 text-gray-700",
  };

  return classes[status] || "border-gray-200 bg-gray-50 text-gray-700";
}

function PaymentStatusPill({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getPaymentStatusClasses(
        status,
      )}`}
    >
      {getPaymentStatusLabel(status)}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
      <p className="font-semibold text-gray-900">No payments to review</p>
      <p className="mt-1 text-sm text-gray-500">
        Paid receipts and outstanding balances will appear here.
      </p>
    </div>
  );
}

export default function DashboardPaymentReceipt({ bookings = [] }) {
  const unpaidBookings = bookings.filter((booking) =>
    ["UNPAID", "PENDING", "DEPOSIT_PAID", "FAILED"].includes(
      booking.paymentStatus,
    ),
  );

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "PAID",
  );

  const outstandingTotal = unpaidBookings.reduce(
    (sum, booking) => sum + Number(booking.total || 0),
    0,
  );

  const paidTotal = paidBookings.reduce(
    (sum, booking) => sum + Number(booking.total || 0),
    0,
  );

  const latestReceipts = [...paidBookings]
    .sort(
      (a, b) =>
        new Date(b.paidAt || b.updatedAt) - new Date(a.paidAt || a.updatedAt),
    )
    .slice(0, 3);

  const priorityPayments = [...unpaidBookings]
    .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate))
    .slice(0, 3);

  const hasContent = priorityPayments.length > 0 || latestReceipts.length > 0;

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-gray-900">
            Payments & Receipts
          </p>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">
            Billing overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View balances, recent receipts, and future tax documents.
          </p>
        </div>

        <Link
          href="/client/receipts"
          className="shrink-0 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Receipts
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-gray-950 p-4 text-white">
          <p className="text-sm text-gray-300">Outstanding</p>
          <p className="mt-2 text-2xl font-bold">
            {formatMoney(outstandingTotal)}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {unpaidBookings.length} booking
            {unpaidBookings.length === 1 ? "" : "s"} need attention
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Paid this account</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatMoney(paidTotal)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {paidBookings.length} paid booking
            {paidBookings.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {!hasContent ? (
          <EmptyState />
        ) : (
          <>
            {priorityPayments.length > 0 && (
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Needs attention
                  </h3>
                  <Link
                    href="/client/bookings"
                    className="text-xs font-semibold text-brand-primary hover:underline"
                  >
                    View bookings
                  </Link>
                </div>

                <div className="space-y-2">
                  {priorityPayments.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/client/bookings/${booking.id}`}
                      className="block rounded-2xl border border-gray-200 p-3 transition hover:border-brand-primary/40 hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {booking.bookingNumber}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {booking.dumpsterLabel || "Dumpster rental"}
                          </p>
                        </div>

                        <div className="text-right">
                          <PaymentStatusPill status={booking.paymentStatus} />
                          <p className="mt-2 text-sm font-semibold text-gray-900">
                            {formatMoney(booking.total)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {latestReceipts.length > 0 && (
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Recent receipts
                  </h3>
                  <Link
                    href="/client/receipts"
                    className="text-xs font-semibold text-brand-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>

                <div className="space-y-2">
                  {latestReceipts.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/client/bookings/${booking.id}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 p-3 transition hover:border-brand-primary/40 hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {booking.bookingNumber}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Paid receipt available
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-gray-900">
                        {formatMoney(booking.total)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-900">
          Coming later: yearly tax receipts
        </p>
        <p className="mt-1 text-sm text-blue-700">
          Clients will be able to download all receipts for a selected year.
        </p>
      </div>
    </section>
  );
}
