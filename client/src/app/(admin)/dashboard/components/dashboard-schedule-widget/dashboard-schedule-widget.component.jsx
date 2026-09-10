"use client";

import { useState } from "react";

import BookingCalendar from "../booking-calendar/booking-calendar.component";
import DumpsterTimeline from "../dumpster-timeline/dumpster-timeline.component";

const tabs = [
  {
    id: "schedule",
    label: "Day Schedule",
  },
  {
    id: "timeline",
    label: "Dumpster Timeline",
  },
];

export default function DashboardScheduleWidget({
  bookings = [],
  inventory = [],
  routeBase = "/dashboard/bookings",
}) {
  const [activeTab, setActiveTab] = useState("schedule");
  const [selectedDumpsterId, setSelectedDumpsterId] = useState("ALL");

  return (
    <section className="min-w-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">
              Today’s Schedule
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View deliveries, pickups, and dumpster availability.
            </p>
          </div>

          <div className="grid grid-cols-2 rounded-2xl border border-gray-200 bg-gray-50 p-1 sm:w-[380px]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="min-w-0 p-5">
        {activeTab === "schedule" ? (
          <BookingCalendar
            bookings={bookings}
            allowedViews={["day", "week"]}
            defaultView="day"
            title=""
            description=""
            compact
            embedded
            variant="dashboard"
            showHeader={false}
            showControls
            showDayDetails
          />
        ) : (
          <DumpsterTimeline
            bookings={bookings}
            dumpsters={inventory}
            selectedDumpsterId={selectedDumpsterId}
            onSelectedDumpsterIdChange={setSelectedDumpsterId}
            title=""
            description=""
            defaultDays={14}
            routeBase={routeBase}
            embedded
          />
        )}
      </div>
    </section>
  );
}
