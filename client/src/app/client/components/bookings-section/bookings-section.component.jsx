"use client";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "Not scheduled";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
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

function SearchInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-primary"
    />
  );
}

function EmptyState({ search }) {
  return (
    <div className="p-6 text-center">
      <p className="font-semibold text-gray-900">No bookings found</p>
      <p className="mt-1 text-sm text-gray-500">
        {search
          ? "Try searching by booking number, address, date, or status."
          : "Your bookings will appear here after you create one."}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3 p-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-28 animate-pulse rounded-2xl bg-gray-100"
        />
      ))}
    </div>
  );
}

export default function BookingsListSection({
  search,
  setSearch,
  bookings = [],
  selectedId,
  loading,
  onSelectBooking,
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Bookings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a rental to view details.
          </p>
        </div>

        <SearchInput
          placeholder="Search booking number, address, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-h-[72vh] overflow-y-auto">
        {loading ? (
          <LoadingState />
        ) : bookings.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          bookings.map((booking) => {
            const isSelected = booking.id === selectedId;

            return (
              <button
                key={booking.id}
                type="button"
                onClick={() => onSelectBooking(booking)}
                className={`w-full border-b border-gray-100 p-4 text-left transition last:border-b-0 hover:bg-gray-50 ${
                  isSelected
                    ? "bg-brand-primary/5 ring-1 ring-inset ring-brand-primary/20"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {booking.bookingNumber || "Booking"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {booking.dumpsterLabel ||
                        `${booking.dumpsterSize || ""} Yard Dumpster`}
                    </p>
                  </div>

                  <StatusPill status={booking.bookingStatus} />
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p>
                    {booking.address1}
                    {booking.city ? `, ${booking.city}` : ""}
                    {booking.state ? `, ${booking.state}` : ""}
                  </p>
                  <p>Delivery {formatDate(booking.deliveryDate)}</p>
                  <p>
                    Pickup{" "}
                    {booking.pickupDateUnknown
                      ? "TBD"
                      : formatDate(booking.pickupDate)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <StatusPill status={booking.paymentStatus} />

                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(booking.total)}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
