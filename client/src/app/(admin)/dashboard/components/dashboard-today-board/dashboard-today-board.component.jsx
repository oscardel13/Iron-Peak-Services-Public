"use client";

function Column({ title, count, items, emptyText, type }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
          {count}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.customer.name}
                  </p>
                  <p className="text-sm text-gray-500">{booking.id}</p>
                </div>

                <span className="rounded-full bg-white px-2 py-1 text-xs text-gray-600">
                  {type}
                </span>
              </div>

              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>{booking.service.projectType}</p>
                <p>
                  {booking.service.address1}, {booking.service.city}
                </p>
                <p>{booking.dumpsterLabel || "Unassigned dumpster"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardTodayBoard({ dashboardData }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Today’s Board</h2>
        <p className="mt-1 text-sm text-gray-500">
          What’s going out and what’s coming back.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Column
          title="Deliveries"
          count={dashboardData.deliveriesToday.length}
          items={dashboardData.deliveriesToday}
          emptyText="No deliveries scheduled for today."
          type="Delivery"
        />

        <Column
          title="Pickups"
          count={dashboardData.pickupsToday.length}
          items={dashboardData.pickupsToday}
          emptyText="No pickups scheduled for today."
          type="Pickup"
        />
      </div>
    </section>
  );
}