"use client";

import { MATERIAL_OPTIONS } from "../../utils/booking-data";
import {
  getMaterialLabel,
  getMaterialSurcharge,
} from "../../utils/booking-helpers";
import StepShell from "../step-shell/step-shell.component";

function SectionTitle({ children }) {
  return <h3 className="text-lg font-semibold text-gray-900">{children}</h3>;
}

export default function StepDumpsterDetails({
  bookingForm,
  updateBookingForm,
  setSelectedProduct,
  toggleAddon,
  availableProducts,
  goToNextStep,
  goToPreviousStep,
}) {
  const concreteSurcharge = getMaterialSurcharge(bookingForm.dumpster.material);

  return (
    <StepShell
      title="Choose your dumpster"
      description="Select the material for pricing, then choose your dumpster."
      onNext={goToNextStep}
      onBack={goToPreviousStep}
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
                  onClick={() => {
                    updateBookingForm("dumpster.material", option.value);
                    updateBookingForm("dumpster.productId", "");
                    updateBookingForm("dumpster.productLabel", "");
                    updateBookingForm("dumpster.size", "");
                    updateBookingForm("dumpster.includedWeightText", "");
                  }}
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
              <p className="mt-1 text-sm text-amber-700">
                Concrete costs more to dump, so a frontend surcharge of $
                {concreteSurcharge.toFixed(2)} has been added for now. Final
                pricing will be confirmed by the backend.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <SectionTitle>Available dumpsters</SectionTitle>

          {availableProducts.length === 0 ? (
            <p className="text-sm text-gray-500">
              No dumpsters are currently available.
            </p>
          ) : (
            <div className="grid gap-4">
              {availableProducts.map((product) => {
                const isSelected = bookingForm.dumpster.productId === product.id;

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
                        <p className="mt-1 text-sm text-gray-500">
                          Included: {product.includedWeightText}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.includedDays} days included, then $25/day
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xl font-semibold text-gray-900">
                          ${product.basePrice.toFixed(2)}
                        </p>
                        {bookingForm.dumpster.material === "concrete" && (
                          <p className="mt-1 text-sm text-amber-700">
                            + ${concreteSurcharge.toFixed(2)} concrete fee
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
            <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4">
              <div>
                <p className="font-semibold text-gray-900">
                  Priority Delivery
                </p>
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
            </label>

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
                  $29.99
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