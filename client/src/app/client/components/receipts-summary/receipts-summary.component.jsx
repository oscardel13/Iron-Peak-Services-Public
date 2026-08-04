"use client";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function getReceiptTotal(receipts) {
  return receipts.reduce((sum, booking) => sum + Number(booking.total || 0), 0);
}

function getRefundTotal(receipts) {
  return receipts
    .filter((booking) =>
      ["REFUNDED", "PARTIALLY_REFUNDED"].includes(booking.paymentStatus),
    )
    .reduce((sum, booking) => sum + Number(booking.total || 0), 0);
}

function SummaryCard({ label, value, description, dark }) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        dark
          ? "bg-gray-950 text-white"
          : "border border-gray-200 bg-white text-gray-900"
      }`}
    >
      <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-500"}`}>
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {description ? (
        <p
          className={`mt-1 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function ReceiptsSummary({
  receipts = [],
  allReceipts = [],
  selectedYearLabel = "All years",
}) {
  const selectedTotal = getReceiptTotal(receipts);
  const allTimeTotal = getReceiptTotal(allReceipts);
  const refundTotal = getRefundTotal(receipts);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        dark
        label={`${selectedYearLabel} Total`}
        value={formatCurrency(selectedTotal)}
        description={`${receipts.length} receipt${receipts.length === 1 ? "" : "s"}`}
      />

      <SummaryCard
        label="All-Time Paid"
        value={formatCurrency(allTimeTotal)}
        description={`${allReceipts.length} paid transaction${
          allReceipts.length === 1 ? "" : "s"
        }`}
      />

      <SummaryCard
        label="Refunded / Adjusted"
        value={formatCurrency(refundTotal)}
        description="Based on refunded receipt statuses"
      />

      <SummaryCard
        label="Tax Documents"
        value="Coming Soon"
        description="Yearly receipt bundles later"
      />
    </section>
  );
}
