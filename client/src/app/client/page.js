"use client";

import { useEffect, useState } from "react";
import { getAPI, postAPI } from "@/utils/api";

const TEST_BOOKING_ID = "test-booking-id";

function StatusPill({ label, type = "default" }) {
  const styles = {
    success: "border-green-200 bg-green-50 text-green-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    error: "border-red-200 bg-red-50 text-red-700",
    default: "border-gray-200 bg-gray-50 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[type] || styles.default
      }`}
    >
      {label}
    </span>
  );
}

function SectionCard({ title, description, status, children }) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          ) : null}
        </div>

        {status ? <StatusPill label={status.label} type={status.type} /> : null}
      </div>

      {children}
    </section>
  );
}

function FieldRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-right text-sm font-medium text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
}

function JsonPreview({ data }) {
  return (
    <pre className="max-h-72 overflow-auto rounded-2xl bg-gray-950 p-4 text-xs text-gray-100">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function BookingList({ bookings }) {
  if (!bookings?.length) {
    return (
      <EmptyState
        title="No bookings returned yet"
        description="The route is working, but the temporary controller is returning an empty list."
      />
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900">
                {booking.bookingNumber || booking.id}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {booking.address1}, {booking.city}, {booking.state}{" "}
                {booking.zip}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <StatusPill
                label={booking.bookingStatus || "UNKNOWN"}
                type="default"
              />
              <StatusPill
                label={booking.paymentStatus || "UNKNOWN"}
                type={
                  booking.paymentStatus === "PAID"
                    ? "success"
                    : booking.paymentStatus === "FAILED"
                      ? "error"
                      : "warning"
                }
              />
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <div>
              <p className="text-gray-500">Delivery</p>
              <p className="font-medium text-gray-900">
                {booking.deliveryDate || "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Pickup</p>
              <p className="font-medium text-gray-900">
                {booking.pickupDate || "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-medium text-gray-900">
                {booking.total ? `$${booking.total}` : "—"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ClientDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [routeResults, setRouteResults] = useState({
    authMe: null,
    clientMe: null,
    bookings: null,
    bookingDetail: null,
    note: null,
    changeRequest: null,
  });
  const [routeErrors, setRouteErrors] = useState({});

  useEffect(() => {
    async function runRouteTest(key, requestFn) {
      try {
        const response = await requestFn();

        setRouteResults((prev) => ({
          ...prev,
          [key]: response.data,
        }));

        setRouteErrors((prev) => ({
          ...prev,
          [key]: null,
        }));

        return response.data;
      } catch (error) {
        const errorData = {
          status: error?.response?.status || null,
          data: error?.response?.data || null,
          message: error?.message || "Request failed.",
        };

        setRouteErrors((prev) => ({
          ...prev,
          [key]: errorData,
        }));

        return null;
      }
    }

    async function testClientRoutes() {
      setLoading(true);

      await runRouteTest("authMe", () => getAPI("/auth/me"));
      await runRouteTest("clientMe", () => getAPI("/client/me"));
      await runRouteTest("bookings", () => getAPI("/client/bookings"));
      await runRouteTest("bookingDetail", () =>
        getAPI(`/client/bookings/${TEST_BOOKING_ID}`),
      );
      await runRouteTest("note", () =>
        postAPI(`/client/bookings/${TEST_BOOKING_ID}/notes`, {
          body: "Testing client note route.",
        }),
      );
      await runRouteTest("changeRequest", () =>
        postAPI(`/client/bookings/${TEST_BOOKING_ID}/change-request`, {
          type: "RESCHEDULE",
          message: "Testing change request route.",
          requestedDeliveryDate: null,
          requestedPickupDate: "2026-08-07",
        }),
      );

      setLoading(false);
    }

    testClientRoutes();
  }, []);

  const authUser = routeResults.authMe?.user;
  const client = routeResults.clientMe?.client || authUser?.client;
  const bookings = routeResults.bookings?.bookings || [];

  const successfulRoutes = Object.values(routeResults).filter(Boolean).length;
  const failedRoutes = Object.values(routeErrors).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-gray-950 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Client Dashboard Test
              </p>
              <h1 className="mt-2 text-3xl font-bold">
                {client?.displayName || authUser?.name || "Client Dashboard"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-300">
                This page is temporarily testing the new client backend routes
                and displaying each response on screen.
              </p>
            </div>

            <div className="flex gap-2">
              <StatusPill
                label={loading ? "Testing..." : `${successfulRoutes} passed`}
                type={loading ? "warning" : "success"}
              />
              {failedRoutes > 0 ? (
                <StatusPill label={`${failedRoutes} failed`} type="error" />
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard
            title="Auth Session"
            description="Result from GET /auth/me"
            status={
              routeErrors.authMe
                ? { label: "Failed", type: "error" }
                : routeResults.authMe
                  ? { label: "Working", type: "success" }
                  : { label: "Pending", type: "warning" }
            }
          >
            {routeErrors.authMe ? (
              <JsonPreview data={routeErrors.authMe} />
            ) : (
              <div>
                <FieldRow label="User ID" value={authUser?.id} />
                <FieldRow label="Name" value={authUser?.name} />
                <FieldRow label="Email" value={authUser?.email} />
                <FieldRow label="Access Level" value={authUser?.accessLevel} />
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Client Profile"
            description="Result from GET /client/me"
            status={
              routeErrors.clientMe
                ? { label: "Failed", type: "error" }
                : routeResults.clientMe
                  ? { label: "Working", type: "success" }
                  : { label: "Pending", type: "warning" }
            }
          >
            {routeErrors.clientMe ? (
              <JsonPreview data={routeErrors.clientMe} />
            ) : (
              <div>
                <FieldRow label="Client ID" value={client?.id} />
                <FieldRow label="Display Name" value={client?.displayName} />
                <FieldRow label="Email" value={client?.email} />
                <FieldRow label="Phone" value={client?.phone} />
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Route Summary"
            description="Quick health check for client endpoints"
            status={
              failedRoutes > 0
                ? { label: "Review", type: "warning" }
                : loading
                  ? { label: "Running", type: "warning" }
                  : { label: "Good", type: "success" }
            }
          >
            <div className="space-y-3">
              {[
                ["GET /auth/me", routeResults.authMe, routeErrors.authMe],
                ["GET /client/me", routeResults.clientMe, routeErrors.clientMe],
                [
                  "GET /client/bookings",
                  routeResults.bookings,
                  routeErrors.bookings,
                ],
                [
                  "GET /client/bookings/:id",
                  routeResults.bookingDetail,
                  routeErrors.bookingDetail,
                ],
                [
                  "POST /client/bookings/:id/notes",
                  routeResults.note,
                  routeErrors.note,
                ],
                [
                  "POST /client/bookings/:id/change-request",
                  routeResults.changeRequest,
                  routeErrors.changeRequest,
                ],
              ].map(([label, result, error]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-4 py-3"
                >
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <StatusPill
                    label={error ? "Fail" : result ? "OK" : "Pending"}
                    type={error ? "error" : result ? "success" : "warning"}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Bookings"
          description="Result from GET /client/bookings"
          status={
            routeErrors.bookings
              ? { label: "Failed", type: "error" }
              : routeResults.bookings
                ? { label: `${bookings.length} bookings`, type: "success" }
                : { label: "Pending", type: "warning" }
          }
        >
          {routeErrors.bookings ? (
            <JsonPreview data={routeErrors.bookings} />
          ) : (
            <BookingList bookings={bookings} />
          )}
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="Booking Detail Test"
            description={`Result from GET /client/bookings/${TEST_BOOKING_ID}`}
            status={
              routeErrors.bookingDetail
                ? { label: "Failed", type: "error" }
                : routeResults.bookingDetail
                  ? { label: "Working", type: "success" }
                  : { label: "Pending", type: "warning" }
            }
          >
            <JsonPreview
              data={routeErrors.bookingDetail || routeResults.bookingDetail}
            />
          </SectionCard>

          <SectionCard
            title="Client Note Test"
            description={`Result from POST /client/bookings/${TEST_BOOKING_ID}/notes`}
            status={
              routeErrors.note
                ? { label: "Failed", type: "error" }
                : routeResults.note
                  ? { label: "Working", type: "success" }
                  : { label: "Pending", type: "warning" }
            }
          >
            <JsonPreview data={routeErrors.note || routeResults.note} />
          </SectionCard>

          <SectionCard
            title="Change Request Test"
            description={`Result from POST /client/bookings/${TEST_BOOKING_ID}/change-request`}
            status={
              routeErrors.changeRequest
                ? { label: "Failed", type: "error" }
                : routeResults.changeRequest
                  ? { label: "Working", type: "success" }
                  : { label: "Pending", type: "warning" }
            }
          >
            <JsonPreview
              data={routeErrors.changeRequest || routeResults.changeRequest}
            />
          </SectionCard>

          <SectionCard
            title="Raw Client Response"
            description="Useful while we build the real dashboard services"
            status={
              routeResults.clientMe
                ? { label: "Loaded", type: "success" }
                : { label: "Pending", type: "warning" }
            }
          >
            <JsonPreview data={routeErrors.clientMe || routeResults.clientMe} />
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
