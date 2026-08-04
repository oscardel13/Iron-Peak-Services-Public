"use client";

import Link from "next/link";
import { useState } from "react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "Not scheduled";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
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

function getStatusClasses(status) {
  const normalizedStatus = status?.toUpperCase();

  const map = {
    QUOTE: "border-amber-200 bg-amber-50 text-amber-700",
    SCHEDULED: "border-blue-200 bg-blue-50 text-blue-700",
    ACTIVE: "border-green-200 bg-green-50 text-green-700",
    COMPLETED: "border-gray-200 bg-gray-50 text-gray-700",
    CANCELLED: "border-red-200 bg-red-50 text-red-700",

    UNPAID: "border-red-200 bg-red-50 text-red-700",
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    DEPOSIT_PAID: "border-blue-200 bg-blue-50 text-blue-700",
    PAID: "border-green-200 bg-green-50 text-green-700",
    PARTIALLY_REFUNDED: "border-orange-200 bg-orange-50 text-orange-700",
    REFUNDED: "border-gray-200 bg-gray-50 text-gray-700",
    FAILED: "border-red-200 bg-red-50 text-red-700",
  };

  return map[normalizedStatus] || "border-gray-200 bg-gray-50 text-gray-700";
}

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
        status,
      )}`}
    >
      {formatTextValue(status)}
    </span>
  );
}

function DetailBlock({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value || "—"}</p>
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

function getAddonName(bookingAddon) {
  return (
    bookingAddon?.addonNameSnapshot ||
    bookingAddon?.addon?.name ||
    bookingAddon?.name ||
    "Addon"
  );
}

function getAddonPrice(bookingAddon) {
  return (
    bookingAddon?.addonPriceSnapshot ||
    bookingAddon?.addon?.price ||
    bookingAddon?.price ||
    0
  );
}

function getFullAddress(booking) {
  return [
    booking.address1,
    booking.address2,
    booking.city,
    booking.state,
    booking.zip,
  ]
    .filter(Boolean)
    .join(", ");
}

function LoadingState() {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="h-8 w-48 animate-pulse rounded-xl bg-gray-100" />

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-3xl bg-gray-100" />
        <div className="h-72 animate-pulse rounded-3xl bg-gray-100" />
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <p className="text-lg font-semibold text-gray-900">Select a booking</p>
      <p className="mt-2 text-sm text-gray-500">
        Choose a rental from the list to view details, notes, and requests.
      </p>
    </section>
  );
}

function NotesPanel({ booking, actionLoading, onCreateNote }) {
  const [body, setBody] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedBody = body.trim();
    if (!trimmedBody) return;

    await onCreateNote(trimmedBody);
    setBody("");
  }

  return (
    <Section
      title="Notes"
      description="Add a message or instruction related to this booking."
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Example: Please call me before drop-off."
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-brand-primary"
        />

        <button
          type="submit"
          disabled={actionLoading || !body.trim()}
          className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionLoading ? "Saving..." : "Add note"}
        </button>
      </form>

      <div className="mt-5 space-y-3">
        {booking.notes?.length ? (
          booking.notes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
            >
              <p className="whitespace-pre-wrap text-sm text-gray-800">
                {note.body}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {formatDateTime(note.createdAt)}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
            No notes yet.
          </p>
        )}
      </div>
    </Section>
  );
}

function ChangeRequestPanel({ actionLoading, onCreateChangeRequest }) {
  const [form, setForm] = useState({
    type: "GENERAL",
    message: "",
    requestedDeliveryDate: "",
    requestedPickupDate: "",
  });

  function updateForm(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.message.trim()) return;

    await onCreateChangeRequest({
      type: form.type,
      message: form.message,
      requestedDeliveryDate: form.requestedDeliveryDate || null,
      requestedPickupDate: form.requestedPickupDate || null,
    });

    setForm({
      type: "GENERAL",
      message: "",
      requestedDeliveryDate: "",
      requestedPickupDate: "",
    });
  }

  return (
    <Section
      title="Request a Change"
      description="Send a request without directly editing the booking."
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Request type
          </label>
          <select
            value={form.type}
            onChange={(e) => updateForm("type", e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-primary"
          >
            <option value="GENERAL">General request</option>
            <option value="RESCHEDULE">Reschedule</option>
            <option value="PICKUP">Request pickup</option>
            <option value="EXTEND_RENTAL">Extend rental</option>
            <option value="PLACEMENT">Placement instructions</option>
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Requested delivery date
            </label>
            <input
              type="date"
              value={form.requestedDeliveryDate}
              onChange={(e) =>
                updateForm("requestedDeliveryDate", e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Requested pickup date
            </label>
            <input
              type="date"
              value={form.requestedPickupDate}
              onChange={(e) =>
                updateForm("requestedPickupDate", e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-primary"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => updateForm("message", e.target.value)}
            placeholder="Tell us what you need changed..."
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-brand-primary"
          />
        </div>

        <button
          type="submit"
          disabled={actionLoading || !form.message.trim()}
          className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionLoading ? "Sending..." : "Send request"}
        </button>
      </form>
    </Section>
  );
}

export default function BookingCardSection({
  booking,
  loading,
  actionLoading,
  onCreateNote,
  onCreateChangeRequest,
}) {
  if (loading) {
    return <LoadingState />;
  }

  if (!booking) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {booking.bookingNumber || "Booking"}
              </h2>

              <StatusPill status={booking.bookingStatus} />
              <StatusPill status={booking.paymentStatus} />
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {booking.dumpsterLabel ||
                `${booking.dumpsterSize || "—"} Yard Dumpster`}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Booking ID: {booking.id}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/book"
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              New booking
            </Link>

            <Link
              href="/client/receipts"
              className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
            >
              Receipts
            </Link>
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <DetailBlock
            label="Delivery"
            value={formatDate(booking.deliveryDate)}
          />

          <DetailBlock
            label="Pickup"
            value={
              booking.pickupDateUnknown
                ? "To be determined"
                : formatDate(booking.pickupDate)
            }
          />

          <DetailBlock label="Address" value={getFullAddress(booking)} />

          <DetailBlock label="Total" value={formatCurrency(booking.total)} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Rental Details">
          <div className="grid gap-4 md:grid-cols-2">
            <DetailBlock label="Dumpster" value={booking.dumpsterLabel} />
            <DetailBlock
              label="Size"
              value={
                booking.dumpsterSize ? `${booking.dumpsterSize} Yard` : "—"
              }
            />
            <DetailBlock
              label="Material"
              value={formatTextValue(booking.material)}
            />
            <DetailBlock label="Placement" value={booking.placement} />
            <DetailBlock
              label="Service Type"
              value={formatTextValue(booking.serviceType)}
            />
            <DetailBlock
              label="Project Type"
              value={formatTextValue(booking.projectType)}
            />
          </div>

          {booking.instructions ? (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Instructions
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
                {booking.instructions}
              </p>
            </div>
          ) : null}
        </Section>

        <Section title="Price Summary">
          <div className="space-y-3">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Base price</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(booking.basePrice)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Delivery fee</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(booking.deliveryFee)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Mileage fee</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(booking.mileageFee)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Extra days</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(booking.extraDaysFee)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Overage</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(booking.overageFee)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Add-ons</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(booking.addonsTotal)}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(booking.total)}
                </span>
              </div>
            </div>
          </div>

          {booking.addons?.length ? (
            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Selected add-ons
              </p>

              <ul className="space-y-2">
                {booking.addons.map((bookingAddon) => (
                  <li
                    key={bookingAddon.id}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span className="text-gray-600">
                      {getAddonName(bookingAddon)}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(getAddonPrice(bookingAddon))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <NotesPanel
          booking={booking}
          actionLoading={actionLoading}
          onCreateNote={onCreateNote}
        />

        <ChangeRequestPanel
          actionLoading={actionLoading}
          onCreateChangeRequest={onCreateChangeRequest}
        />
      </div>
    </div>
  );
}
