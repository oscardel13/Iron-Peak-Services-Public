"use client";

function AttentionCard({ title, items, emptyText, renderTitle, renderMeta }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-gray-900">{title}</h3>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-3"
            >
              <p className="font-medium text-gray-900">
                {renderTitle ? renderTitle(item) : item.label || item.customerName || "Unknown"}
              </p>
              <p className="text-sm text-gray-500">
                {item.bookingNumber || item.id}
              </p>
              <div className="mt-2 text-sm text-gray-600">{renderMeta(item)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardAttentionSection({ dashboardData }) {
  const urgentPaymentBookings = dashboardData?.urgentPaymentBookings || [];
  const quotesNeedingFollowUp = dashboardData?.quotesNeedingFollowUp || [];
  const maintenanceInventory = dashboardData?.maintenanceInventory || [];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Needs Attention</h2>
        <p className="mt-1 text-sm text-gray-500">
          The items most likely to need a call or status update.
        </p>
      </div>

      <div className="grid gap-4">
        <AttentionCard
          title="Unpaid Bookings"
          items={urgentPaymentBookings}
          emptyText="No unpaid bookings right now."
          renderTitle={(booking) => booking.customerName || "Unknown customer"}
          renderMeta={(booking) => (
            <>
              <p>{booking.projectType || "No project type"}</p>
              <p>
                Payment status:{" "}
                {(booking.paymentStatus || "UNKNOWN").replaceAll("_", " ")}
              </p>
            </>
          )}
        />

        <AttentionCard
          title="Open Quotes"
          items={quotesNeedingFollowUp}
          emptyText="No quotes need follow-up."
          renderTitle={(booking) => booking.customerName || "Unknown customer"}
          renderMeta={(booking) => (
            <>
              <p>{booking.projectType || "No project type"}</p>
              <p>
                Requested size:{" "}
                {booking.dumpsterSize ? `${booking.dumpsterSize} Yard` : "—"}
              </p>
            </>
          )}
        />

        <AttentionCard
          title="Maintenance / Out of Service"
          items={maintenanceInventory}
          emptyText="No inventory issues right now."
          renderTitle={(item) => item.label || "Unknown inventory item"}
          renderMeta={(item) => (
            <>
              <p>{item.sizeLabel || `${item.size} Yard`}</p>
              <p>Status: {(item.status || "UNKNOWN").replaceAll("_", " ")}</p>
            </>
          )}
        />
      </div>
    </section>
  );
}