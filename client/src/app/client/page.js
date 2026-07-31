"use client";

import { useEffect } from "react";
import { getAPI, postAPI } from "@/utils/api";

export default function ClientDashboardPage() {
  useEffect(() => {
    async function testClientRoutes() {
      try {
        const me = await getAPI("/auth/me");
        console.log("AUTH ME:", me.data);

        const clientMe = await getAPI("/client/me");
        console.log("CLIENT ME:", clientMe.data);

        const bookings = await getAPI("/client/bookings");
        console.log("CLIENT BOOKINGS:", bookings.data);

        const bookingDetail = await getAPI("/client/bookings/test-booking-id");
        console.log("CLIENT BOOKING DETAIL:", bookingDetail.data);

        const note = await postAPI("/client/bookings/test-booking-id/notes", {
          body: "Testing client note route.",
        });
        console.log("CLIENT NOTE:", note.data);

        const changeRequest = await postAPI(
          "/client/bookings/test-booking-id/change-request",
          {
            type: "RESCHEDULE",
            message: "Testing change request route.",
            requestedDeliveryDate: null,
            requestedPickupDate: "2026-08-07",
          },
        );
        console.log("CLIENT CHANGE REQUEST:", changeRequest.data);
      } catch (error) {
        console.error("Client route test failed:", {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message,
        });
      }
    }

    testClientRoutes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Client Dashboard Test
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Open the browser console to verify the client routes.
        </p>
      </div>
    </main>
  );
}
