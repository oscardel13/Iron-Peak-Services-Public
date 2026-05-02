"use client";

import {
  BOOKING_STATUSES,
  PAYMENT_STATUSES,
} from "@/data/mock-bookings";
import { formatDateTime } from "@/utils/helpers";

function getStatusClasses(status) {
  const normalizedStatus = status?.toLowerCase();

  const map = {
    quote: "bg-slate-100 text-slate-700",
    scheduled: "bg-blue-100 text-blue-700",
    active: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    unpaid: "bg-red-100 text-red-700",
    authorized: "bg-blue-100 text-blue-700",
    deposit_paid: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    partially_refunded: "bg-orange-100 text-orange-700",
    refunded: "bg-slate-100 text-slate-700",
    failed: "bg-red-100 text-red-700",
  };

  return map[normalizedStatus] || "bg-slate-100 text-slate-700";
}

function Label({ children }) {
  return (
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black disabled:bg-gray-50 disabled:text-gray-500 ${
        props.className || ""
      }`}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black disabled:bg-gray-50 disabled:text-gray-500 ${
        props.className || ""
      }`}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black disabled:bg-gray-50 disabled:text-gray-500 ${
        props.className || ""
      }`}
    />
  );
}

function formatDateInputValue(value) {
  if (!value) return "";

  if (typeof value === "string") {
    return value.split("T")[0];
  }

  return new Date(value).toISOString().split("T")[0];
}

function formatMoneyInputValue(value) {
  if (value === null || value === undefined) return "";
  return Number(value);
}

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatTextValue(value) {
  if (!value) return "";
  return String(value)
    .toLowerCase()
    .split("_")
    .join("-")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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

export default function BookingCardSection({
  bookingToRender,
  isEditing,
  handleEdit,
  handleCancelEdit,
  handleSave,
  updateDraft,
}) {
  if (!bookingToRender) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6 text-sm text-gray-500">Select a booking.</div>
      </section>
    );
  }

  const materialSurchargeLabel =
    bookingToRender.material?.toLowerCase() === "concrete"
      ? bookingToRender.dumpster.concretePrice
      : "$0.00";

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-200 p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {bookingToRender.customerName}
            </h2>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                bookingToRender.bookingStatus
              )}`}
            >
              {formatTextValue(bookingToRender.bookingStatus)}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                bookingToRender.paymentStatus
              )}`}
            >
              {formatTextValue(bookingToRender.paymentStatus)}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">{bookingToRender.id}</p>

          <p className="mt-2 text-sm text-gray-600">
            {formatTextValue(bookingToRender.serviceType)} ·{" "}
            {bookingToRender.dumpsterLabel ||
              `${bookingToRender.dumpsterSize} Yard Requested`}
          </p>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Edit booking
            </button>
          ) : (
            <>
              <button
                onClick={handleCancelEdit}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
              >
                Save changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 p-5">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-4">
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Customer
            </h3>

            <div className="grid gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={bookingToRender.customerName || ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("customerName", e.target.value)}
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={bookingToRender.customerPhone || ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("customerPhone", e.target.value)}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={bookingToRender.customerEmail || ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("customerEmail", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Status + Assignment
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Booking Status</Label>
                <Select
                  value={bookingToRender.bookingStatus || ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("bookingStatus", e.target.value)}
                >
                  {BOOKING_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatTextValue(status)}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Payment Status</Label>
                <Select
                  value={bookingToRender.paymentStatus || ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("paymentStatus", e.target.value)}
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatTextValue(status)}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Dumpster ID</Label>
                <Input
                  value={bookingToRender.dumpsterId || ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("dumpsterId", e.target.value)}
                />
              </div>

              <div>
                <Label>Dumpster Label</Label>
                <Input
                  value={bookingToRender.dumpsterLabel || ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("dumpsterLabel", e.target.value)}
                />
              </div>

              <div>
                <Label>Dumpster Size</Label>
                <Input
                  type="number"
                  value={bookingToRender.dumpsterSize ?? ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateDraft("dumpsterSize", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Service Details
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Project Type</Label>
              <Input
                value={formatTextValue(bookingToRender.projectType)}
                disabled={!isEditing}
                onChange={(e) => updateDraft("projectType", e.target.value)}
              />
            </div>

            <div>
              <Label>Material</Label>
              <Input
                value={formatTextValue(bookingToRender.material)}
                disabled={!isEditing}
                onChange={(e) => updateDraft("material", e.target.value)}
              />
            </div>

            <div>
              <Label>Placement</Label>
              <Input
                value={bookingToRender.placement || ""}
                disabled={!isEditing}
                onChange={(e) => updateDraft("placement", e.target.value)}
              />
            </div>

            <div>
              <Label>Add-ons</Label>
              <div className="min-h-[38px] rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800">
                {bookingToRender.addons?.length ? (
                  <ul className="space-y-1">
                    {bookingToRender.addons.map((bookingAddon) => (
                      <li
                        key={bookingAddon.id}
                        className="flex justify-between gap-3"
                      >
                        <span>{getAddonName(bookingAddon)}</span>
                        <span className="font-medium">
                          {formatCurrency(getAddonPrice(bookingAddon))}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500">No add-ons selected</span>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input
                value={bookingToRender.address1 || ""}
                disabled={!isEditing}
                onChange={(e) => updateDraft("address1", e.target.value)}
              />
            </div>

            <div>
              <Label>City</Label>
              <Input
                value={bookingToRender.city || ""}
                disabled={!isEditing}
                onChange={(e) => updateDraft("city", e.target.value)}
              />
            </div>

            <div>
              <Label>State</Label>
              <Input
                value={bookingToRender.state || ""}
                disabled={!isEditing}
                onChange={(e) => updateDraft("state", e.target.value)}
              />
            </div>

            <div>
              <Label>ZIP</Label>
              <Input
                value={bookingToRender.zip || ""}
                disabled={!isEditing}
                onChange={(e) => updateDraft("zip", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Instructions</Label>
              <Textarea
                rows={4}
                value={bookingToRender.instructions || ""}
                disabled={!isEditing}
                onChange={(e) => updateDraft("instructions", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-4">
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Schedule
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Delivery Date</Label>
                <Input
                  type="date"
                  value={formatDateInputValue(bookingToRender.deliveryDate)}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("deliveryDate", e.target.value)}
                />
              </div>

              <div>
                <Label>Pickup Date</Label>
                <Input
                  type="date"
                  value={formatDateInputValue(bookingToRender.pickupDate)}
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateDraft("pickupDate", e.target.value || null)
                  }
                />
              </div>

              <div>
                <Label>Pickup Date Unknown</Label>
                <Select
                  value={bookingToRender.pickupDateUnknown ? "yes" : "no"}
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateDraft("pickupDateUnknown", e.target.value === "yes")
                  }
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </Select>
              </div>

              <div>
                <Label>Rental Days Included</Label>
                <Input
                  type="number"
                  value={bookingToRender.rentalDaysIncluded ?? 7}
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateDraft("rentalDaysIncluded", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Pricing
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Base Price</Label>
                <Input
                  type="number"
                  value={formatMoneyInputValue(bookingToRender.basePrice)}
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateDraft("basePrice", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Material Surcharge</Label>
                <Input value={materialSurchargeLabel} disabled />
              </div>

              <div>
                <Label>Add-ons Total</Label>
                <Input
                  type="number"
                  value={formatMoneyInputValue(bookingToRender.addonsTotal)}
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateDraft("addonsTotal", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Delivery Fee</Label>
                <Input
                  type="number"
                  value={formatMoneyInputValue(bookingToRender.deliveryFee)}
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateDraft("deliveryFee", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Mileage Fee</Label>
                <Input
                  type="number"
                  value={formatMoneyInputValue(bookingToRender.mileageFee)}
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateDraft("mileageFee", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Extra Days Fee</Label>
                <Input
                  type="number"
                  value={formatMoneyInputValue(bookingToRender.extraDaysFee)}
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateDraft("extraDaysFee", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Overage Fee</Label>
                <Input
                  type="number"
                  value={formatMoneyInputValue(bookingToRender.overageFee)}
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateDraft("overageFee", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Total</Label>
                <Input
                  type="number"
                  value={formatMoneyInputValue(bookingToRender.total)}
                  disabled={!isEditing}
                  onChange={(e) => updateDraft("total", Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Metadata
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Created
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDateTime(bookingToRender.createdAt)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Updated
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDateTime(bookingToRender.updatedAt)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Quoted
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {bookingToRender.quotedAt
                  ? formatDateTime(bookingToRender.quotedAt)
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Booking Number
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {bookingToRender.bookingNumber || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}