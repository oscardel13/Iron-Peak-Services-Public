"use client";

function AttentionCard({ title, items, emptyText, renderMeta }) {
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
                {item.customer?.name || item.label}
              </p>
              <p className="text-sm text-gray-500">{item.id}</p>
              <div className="mt-2 text-sm text-gray-600">{renderMeta(item)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardAttentionSection({ dashboardData }) {
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
          items={dashboardData.urgentPaymentBookings}
          emptyText="No unpaid bookings right now."
          renderMeta={(booking) => (
            <>
              <p>{booking.service.projectType}</p>
              <p>Payment status: {booking.paymentStatus.replaceAll("_", " ")}</p>
            </>
          )}
        />

        <AttentionCard
          title="Open Quotes"
          items={dashboardData.quotesNeedingFollowUp}
          emptyText="No quotes need follow-up."
          renderMeta={(booking) => (
            <>
              <p>{booking.service.projectType}</p>
              <p>
                Requested size: {booking.dumpsterSize ? `${booking.dumpsterSize} Yard` : "—"}
              </p>
            </>
          )}
        />

        <AttentionCard
          title="Maintenance / Out of Service"
          items={dashboardData.maintenanceInventory}
          emptyText="No inventory issues right now."
          renderMeta={(item) => (
            <>
              <p>{item.size} Yard · {item.yardLocation}</p>
              <p>Status: {item.status.replaceAll("_", " ")}</p>
            </>
          )}
        />
      </div>
    </section>
  );
}