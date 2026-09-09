"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Truck,
  User,
} from "lucide-react";

import { getAPI } from "@/utils/api";

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "—";

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateTime(value) {
  if (!value) return "—";

  return `${formatDate(value)} at ${formatTime(value)}`;
}

function formatLabel(value) {
  if (!value) return "—";

  return String(value).replaceAll("_", " ");
}

function getBookingStatusClasses(status) {
  const map = {
    SCHEDULED: "bg-blue-100 text-blue-700",
    CONFIRMED: "bg-green-100 text-green-700",
    ACTIVE: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-gray-100 text-gray-700",
    CANCELLED: "bg-red-100 text-red-700",
    CANCELED: "bg-red-100 text-red-700",
    PENDING_PAYMENT: "bg-purple-100 text-purple-700",
    DRAFT: "bg-slate-100 text-slate-700",
  };

  return map[status] || "bg-slate-100 text-slate-700";
}

function getPaymentStatusClasses(status) {
  const map = {
    PAID: "bg-green-100 text-green-700",
    DEPOSIT_PAID: "bg-green-100 text-green-700",
    PENDING: "bg-amber-100 text-amber-700",
    UNPAID: "bg-red-100 text-red-700",
    FAILED: "bg-red-100 text-red-700",
    REFUNDED: "bg-gray-100 text-gray-700",
  };

  return map[status] || "bg-slate-100 text-slate-700";
}

function DetailCard({ title, icon: Icon, children }) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        {Icon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-700">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}

        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>

      {children}
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="border-b border-gray-100 py-3 last:border-b-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-900">{value || "—"}</p>
    </div>
  );
}

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();

  const bookingId = params?.id;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchBooking() {
    if (!bookingId) return;

    try {
      setLoading(true);
      setError("");

      const response = await getAPI(`/bookings/${bookingId}`);

      setBooking(response?.data?.booking || response?.data || null);
    } catch (error) {
      console.error("Failed to fetch booking:", error);
      setError("Could not load this booking.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const customerName = useMemo(() => {
    if (!booking) return "—";

    const fromParts = `${booking.customerFirstName || ""} ${
      booking.customerLastName || ""
    }`.trim();

    return booking.customerName || fromParts || "—";
  }, [booking]);

  const fullAddress = useMemo(() => {
    if (!booking) return "—";

    return [
      booking.address1,
      booking.address2,
      booking.city,
      booking.state,
      booking.zip,
    ]
      .filter(Boolean)
      .join(", ");
  }, [booking]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-[420px] animate-pulse rounded-3xl bg-gray-100" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-700">
          {error || "Booking not found."}
        </p>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mt-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Booking Details
            </p>

            <h1 className="mt-1 text-3xl font-black text-gray-900">
              {booking.bookingNumber || booking.id}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Created {formatDateTime(booking.createdAt)}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getBookingStatusClasses(
                booking.bookingStatus || booking.status,
              )}`}
            >
              {formatLabel(booking.bookingStatus || booking.status)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getPaymentStatusClasses(
                booking.paymentStatus,
              )}`}
            >
              {formatLabel(booking.paymentStatus)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/bookings/${booking.id}/edit`}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
          >
            Edit Booking
          </Link>

          <Link
            href="/dashboard/bookings"
            className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="mt-2 text-3xl font-black text-gray-900">
            {formatMoney(booking.totalPrice || booking.total)}
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Delivery</p>
          <p className="mt-2 text-lg font-bold text-gray-900">
            {formatDate(booking.deliveryDate)}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {formatTime(booking.deliveryDate)}
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pickup</p>
          <p className="mt-2 text-lg font-bold text-gray-900">
            {booking.pickupDateUnknown
              ? "Unknown"
              : formatDate(booking.pickupDate)}
          </p>
          {!booking.pickupDateUnknown ? (
            <p className="mt-1 text-sm text-gray-500">
              {formatTime(booking.pickupDate)}
            </p>
          ) : null}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Rental Days</p>
          <p className="mt-2 text-3xl font-black text-gray-900">
            {booking.rentalDays || booking.rentalDaysIncluded || "—"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <DetailCard title="Schedule" icon={CalendarDays}>
            <div className="grid gap-3 md:grid-cols-2">
              <InfoRow
                label="Delivery Date"
                value={formatDateTime(booking.deliveryDate)}
              />
              <InfoRow
                label="Pickup Date"
                value={
                  booking.pickupDateUnknown
                    ? "Unknown"
                    : formatDateTime(booking.pickupDate)
                }
              />
              <InfoRow
                label="Service Type"
                value={formatLabel(booking.serviceType)}
              />
              <InfoRow label="Material" value={formatLabel(booking.material)} />
            </div>
          </DetailCard>

          <DetailCard title="Service Address" icon={MapPin}>
            <div className="space-y-3">
              <InfoRow label="Address" value={fullAddress} />
              <InfoRow label="Placement" value={booking.placement} />
              <InfoRow
                label="Location Verified"
                value={booking.locationVerified ? "Yes" : "No"}
              />
              <InfoRow label="Instructions" value={booking.instructions} />
            </div>
          </DetailCard>

          <DetailCard title="Dumpster" icon={Truck}>
            <div className="grid gap-3 md:grid-cols-2">
              <InfoRow
                label="Dumpster"
                value={
                  booking.dumpster?.label ||
                  booking.dumpsterLabel ||
                  booking.dumpsterSize?.sizeLabel ||
                  "—"
                }
              />
              <InfoRow
                label="Size"
                value={
                  booking.dumpster?.size
                    ? `${booking.dumpster.size} yd`
                    : booking.dumpsterSize
                      ? `${booking.dumpsterSize} yd`
                      : "—"
                }
              />
              <InfoRow
                label="Serial Number"
                value={booking.dumpster?.serialNumber}
              />
              <InfoRow
                label="Dumpster Status"
                value={booking.dumpster?.status}
              />
            </div>
          </DetailCard>

          <DetailCard title="Notes">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Customer Notes
                </p>
                <p className="mt-2 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                  {booking.customerNotes || "No customer notes."}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Internal Notes
                </p>
                <p className="mt-2 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                  {booking.internalNotes ||
                    booking.notes ||
                    "No internal notes."}
                </p>
              </div>
            </div>
          </DetailCard>
        </div>

        <div className="space-y-6">
          <DetailCard title="Customer" icon={User}>
            <div className="space-y-1">
              <InfoRow label="Name" value={customerName} />
              <InfoRow
                label="Customer Type"
                value={formatLabel(booking.customerType)}
              />

              <div className="border-b border-gray-100 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Phone
                </p>
                {booking.customerPhone || booking.phone ? (
                  <a
                    href={`tel:${booking.customerPhone || booking.phone}`}
                    className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-indigo-600"
                  >
                    <Phone className="h-4 w-4" />
                    {booking.customerPhone || booking.phone}
                  </a>
                ) : (
                  <p className="mt-1 text-sm font-medium text-gray-900">—</p>
                )}
              </div>

              <div className="py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Email
                </p>
                {booking.customerEmail || booking.email ? (
                  <a
                    href={`mailto:${booking.customerEmail || booking.email}`}
                    className="mt-1 inline-flex items-center gap-2 break-all text-sm font-semibold text-gray-900 hover:text-indigo-600"
                  >
                    <Mail className="h-4 w-4" />
                    {booking.customerEmail || booking.email}
                  </a>
                ) : (
                  <p className="mt-1 text-sm font-medium text-gray-900">—</p>
                )}
              </div>
            </div>
          </DetailCard>

          <DetailCard title="Pricing" icon={DollarSign}>
            <div className="space-y-1">
              <InfoRow
                label="Base Price"
                value={formatMoney(booking.basePrice)}
              />
              <InfoRow
                label="Concrete / Material Fee"
                value={formatMoney(
                  booking.concreteFee || booking.materialSurcharge,
                )}
              />
              <InfoRow
                label="Delivery Fee"
                value={formatMoney(booking.deliveryFee)}
              />
              <InfoRow
                label="Mileage Fee"
                value={formatMoney(booking.mileageFee)}
              />
              <InfoRow
                label="Extra Days Fee"
                value={formatMoney(booking.extraDaysFee)}
              />
              <InfoRow
                label="Add-ons Total"
                value={formatMoney(booking.addonsTotal)}
              />

              <div className="mt-4 rounded-2xl bg-gray-950 p-4 text-white">
                <p className="text-sm text-white/70">Total</p>
                <p className="mt-1 text-3xl font-black">
                  {formatMoney(booking.totalPrice || booking.total)}
                </p>
              </div>
            </div>
          </DetailCard>

          <DetailCard title="Payment" icon={Receipt}>
            <div className="space-y-1">
              <InfoRow
                label="Payment Status"
                value={formatLabel(booking.paymentStatus)}
              />
              <InfoRow
                label="Stripe Payment Intent"
                value={booking.stripePaymentIntentId}
              />
              <InfoRow label="Receipt URL" value={booking.receiptUrl} />
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
