"use client";

import { useEffect, useState } from "react";
import { MATERIAL_OPTIONS } from "../../utils/booking-data";
import { getAPI } from "@/utils/api";
import StepShell from "../step-shell/step-shell.component";

function SectionTitle({ children }) {
  return <h3 className="text-lg font-semibold text-gray-900">{children}</h3>;
}

export default function StepDumpsterDetails({
  bookingForm,
  updateBookingForm,
  setSelectedProduct,
  toggleAddon,
  goToNextStep,
  goToPreviousStep,
  formErrors = {},
}) {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isLoadingDumpsters, setIsLoadingDumpsters] = useState(false);
  const [dumpstersError, setDumpstersError] = useState("");

  useEffect(() => {
    async function fetchAvailableDumpsters() {
      const deliveryDate = bookingForm.schedule.deliveryDate;
      const pickupDate = bookingForm.schedule.pickupDate;
      const unknownPickup = bookingForm.schedule.unknownPickup;

      if (!deliveryDate) {
        setAvailableProducts([]);
        return;
      }

      try {
        setIsLoadingDumpsters(true);
        setDumpstersError("");

        const params = new URLSearchParams();
        params.set("deliveryDate", deliveryDate);

        if (!unknownPickup && pickupDate) {
          params.set("pickupDate", pickupDate);
        }

        const response = await getAPI(
          `/inventory/dumpsters/available?${params.toString()}`,
        );

        setAvailableProducts(response.data || []);
      } catch (error) {
        console.error("Failed to fetch available dumpsters:", error);
        setAvailableProducts([]);
        setDumpstersError("Could not load available dumpsters.");
      } finally {
        setIsLoadingDumpsters(false);
      }
    }

    fetchAvailableDumpsters();
  }, [
    bookingForm.schedule.deliveryDate,
    bookingForm.schedule.pickupDate,
    bookingForm.schedule.unknownPickup,
  ]);

  function handleMaterialSelect(materialValue) {
    updateBookingForm("dumpster.material", materialValue);
    updateBookingForm("dumpster.productId", "");
    updateBookingForm("dumpster.productLabel", "");
    updateBookingForm("dumpster.size", "");
    updateBookingForm("dumpster.basePrice", 0);
    updateBookingForm("dumpster.concretePrice", 0);
    updateBookingForm("dumpster.includedWeightText", "");
  }

  return (
    <StepShell
      title="Choose your dumpster"
      description="Select the material for pricing, then choose your dumpster."
      onNext={goToNextStep}
      onBack={goToPreviousStep}
      errors={formErrors}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <SectionTitle>Material</SectionTitle>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {MATERIAL_OPTIONS.map((option) => {
              const isSelected = bookingForm.dumpster.material === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleMaterialSelect(option.value)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <p className="font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>

          {bookingForm.dumpster.material === "concrete" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-800">
                Concrete disposal surcharge applies
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <SectionTitle>Available dumpsters</SectionTitle>

          {!bookingForm.schedule.deliveryDate ? (
            <p className="text-sm text-gray-500">
              Choose a delivery date first so we can check dumpster
              availability.
            </p>
          ) : isLoadingDumpsters ? (
            <p className="text-sm text-gray-500">
              Checking available dumpsters...
            </p>
          ) : dumpstersError ? (
            <p className="text-sm text-red-600">{dumpstersError}</p>
          ) : availableProducts.length === 0 ? (
            <p className="text-sm text-gray-500">
              No dumpsters are available for the selected dates.
            </p>
          ) : (
            <div className="grid gap-4">
              {availableProducts.map((product) => {
                const isSelected =
                  bookingForm.dumpster.productId === product.id;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {product.label}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Size: {product.size} yd
                        </p>

                        {product.includedWeightText && (
                          <p className="mt-1 text-sm text-gray-500">
                            Included: {product.includedWeightText}
                          </p>
                        )}

                        <p className="mt-1 text-sm text-gray-500">
                          {product.includedDays || 7} days included, then
                          $25/day
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xl font-semibold text-gray-900">
                          ${Number(product.basePrice || 0).toFixed(2)}
                        </p>

                        {bookingForm.dumpster.material === "concrete" && (
                          <p className="mt-1 text-sm text-amber-700">
                            + ${Number(product.concretePrice || 0).toFixed(2)}{" "}
                            concrete fee
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <SectionTitle>Add-ons</SectionTitle>

          <div className="grid gap-4">
            {/* <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4">
              <div>
                <p className="font-semibold text-gray-900">Priority Delivery</p>
                <p className="mt-1 text-sm text-gray-500">
                  Move your delivery up in scheduling priority.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">
                  $49.99
                </span>
                <input
                  type="checkbox"
                  checked={bookingForm.addons.priorityDelivery}
                  onChange={(e) =>
                    toggleAddon("priorityDelivery", e.target.checked)
                  }
                  className="h-5 w-5"
                />
              </div>
            </label> */}

            <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4">
              <div>
                <p className="font-semibold text-gray-900">
                  Driveway Surface Protection
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Protective boards for driveway contact points.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">
                  $30.00
                </span>
                <input
                  type="checkbox"
                  checked={bookingForm.addons.drivewayProtection}
                  onChange={(e) =>
                    toggleAddon("drivewayProtection", e.target.checked)
                  }
                  className="h-5 w-5"
                />
              </div>
            </label>
          </div>
        </div>
      </div>
    </StepShell>
  );
}
