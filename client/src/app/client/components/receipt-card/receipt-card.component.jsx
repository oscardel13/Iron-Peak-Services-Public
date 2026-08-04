"use client";

import Link from "next/link";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatTextValue(value) {
  if (!value) return "Unknown";

  return String(value)
    .toLowerCase()
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getReceiptDate(booking) {
  return (
    booking.paidAt ||
    booking.completedAt ||
    booking.updatedAt ||
    booking.createdAt
  );
}

function getPaymentStatusClasses(status) {
  const map = {
    PAID: "border-green-200 bg-green-50 text-green-700",
    DEPOSIT_PAID: "border-blue-200 bg-blue-50 text-blue-700",
    PARTIALLY_REFUNDED: "border-orange-200 bg-orange-50 text-orange-700",
    REFUNDED: "border-gray-200 bg-gray-50 text-gray-700",
  };

  return map[status] || "border-gray-200 bg-gray-50 text-gray-700";
}

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getPaymentStatusClasses(
        status,
      )}`}
    >
      {formatTextValue(status)}
    </span>
  );
}

function LineItem({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default function ReceiptCard({ booking }) {
  const receiptDate = getReceiptDate(booking);

  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {booking.bookingNumber || "Receipt"}
            </h2>
            <StatusPill status={booking.paymentStatus} />
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Receipt date: {formatDate(receiptDate)}
          </p>
        </div>

        <p className="shrink-0 text-lg font-bold text-gray-900">
          {formatCurrency(booking.total)}
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-semibold text-gray-900">
          {booking.dumpsterLabel ||
            `${booking.dumpsterSize || "—"} Yard Dumpster`}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {booking.address1}
          {booking.city ? `, ${booking.city}` : ""}
          {booking.state ? `, ${booking.state}` : ""}
          {booking.zip ? ` ${booking.zip}` : ""}
        </p>

        <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <p className="text-gray-500">
            Delivery:{" "}
            <span className="font-medium text-gray-800">
              {formatDate(booking.deliveryDate)}
            </span>
          </p>

          <p className="text-gray-500">
            Pickup:{" "}
            <span className="font-medium text-gray-800">
              {booking.pickupDateUnknown
                ? "TBD"
                : formatDate(booking.pickupDate)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <LineItem
          label="Base price"
          value={formatCurrency(booking.basePrice)}
        />
        <LineItem
          label="Delivery fee"
          value={formatCurrency(booking.deliveryFee)}
        />
        <LineItem
          label="Mileage fee"
          value={formatCurrency(booking.mileageFee)}
        />
        <LineItem
          label="Extra days"
          value={formatCurrency(booking.extraDaysFee)}
        />
        <LineItem label="Overage" value={formatCurrency(booking.overageFee)} />
        <LineItem label="Add-ons" value={formatCurrency(booking.addonsTotal)} />

        <div className="border-t border-gray-200 pt-3">
          <LineItem label="Total paid" value={formatCurrency(booking.total)} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/client/bookings/${booking.id}`}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          View booking
        </Link>

        <button
          type="button"
          disabled
          className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white opacity-50"
          title="Receipt PDF export coming later"
        >
          Download PDF
        </button>
      </div>
    </article>
  );
}
