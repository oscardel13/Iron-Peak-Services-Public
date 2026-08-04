"use client";

import { useEffect, useMemo, useState } from "react";

import { getAPI } from "@/utils/api";

import ReceiptsSummary from "../components/receipts-summary/receipts-summary.component";
import ReceiptsYearFilter from "../components/receipts-year-filter/receipts-year-filter.component";
import ReceiptCard from "../components/receipt-card/receipt-card.component";
import ReceiptsEmptyState from "../components/receipts-empty-state/receipts-empty-state.component";

function getReceiptDate(booking) {
  return (
    booking.paidAt ||
    booking.completedAt ||
    booking.updatedAt ||
    booking.createdAt
  );
}

function getYearFromDate(value) {
  if (!value) return null;
  return new Date(value).getFullYear();
}

function isPaidReceiptBooking(booking) {
  return ["PAID", "DEPOSIT_PAID", "PARTIALLY_REFUNDED", "REFUNDED"].includes(
    booking.paymentStatus,
  );
}

export default function ClientReceiptsPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setError("");

        const response = await getAPI("/client/bookings");
        const nextBookings = response.data?.bookings ?? [];

        setBookings(nextBookings);
      } catch (err) {
        console.error("Failed to fetch receipts:", err);
        setError("Failed to load receipts.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const receiptBookings = useMemo(() => {
    return bookings
      .filter(isPaidReceiptBooking)
      .sort(
        (a, b) => new Date(getReceiptDate(b)) - new Date(getReceiptDate(a)),
      );
  }, [bookings]);

  const availableYears = useMemo(() => {
    const years = receiptBookings
      .map((booking) => getYearFromDate(getReceiptDate(booking)))
      .filter(Boolean);

    return [...new Set(years)].sort((a, b) => b - a);
  }, [receiptBookings]);

  const filteredReceipts = useMemo(() => {
    if (selectedYear === "all") return receiptBookings;

    return receiptBookings.filter(
      (booking) =>
        String(getYearFromDate(getReceiptDate(booking))) === selectedYear,
    );
  }, [receiptBookings, selectedYear]);

  const selectedYearLabel = selectedYear === "all" ? "All years" : selectedYear;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
          Client Portal
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">Receipts</h1>
        <p className="text-sm text-gray-500">
          View paid bookings, receipt totals, and yearly payment summaries.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <ReceiptsSummary
        receipts={filteredReceipts}
        allReceipts={receiptBookings}
        selectedYearLabel={selectedYearLabel}
      />

      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Receipt History
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Paid and completed transactions from your rentals.
          </p>
        </div>

        <ReceiptsYearFilter
          years={availableYears}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-3xl bg-gray-100"
            />
          ))}
        </div>
      ) : filteredReceipts.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredReceipts.map((booking) => (
            <ReceiptCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <ReceiptsEmptyState selectedYearLabel={selectedYearLabel} />
      )}

      <section className="rounded-3xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-sm font-semibold text-blue-900">
          Future feature: yearly tax packet
        </p>
        <p className="mt-1 text-sm text-blue-700">
          Later, this page can generate a PDF or ZIP with every receipt for a
          selected tax year.
        </p>
      </section>
    </div>
  );
}
