"use client";

import { useEffect, useState } from "react";
import StepShell from "../step-shell/step-shell.component";
import {
  calculateDistanceMiles,
  searchMapboxAddresses,
} from "../../../../../../utils/mapbox";

import { WAREHOUSE_LOCATION } from "../../utils/booking-data";
import { calculateMileageFee } from "../../utils/booking-helpers";

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 ${
        props.className || ""
      }`}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 ${
        props.className || ""
      }`}
    />
  );
}

export default function StepStartAddress({
  bookingForm,
  updateBookingForm,
  goToNextStep,
}) {
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [addressSearchError, setAddressSearchError] = useState("");

  useEffect(() => {
    const query = bookingForm.address.query;

    if (!query || query.trim().length < 3) {
      setAddressSuggestions([]);
      setAddressSearchError("");
      return;
    }

    const controller = new AbortController();

    async function searchAddresses() {
      try {
        setIsSearchingAddress(true);
        setAddressSearchError("");

        const suggestions = await searchMapboxAddresses(query);

        if (!controller.signal.aborted) {
          setAddressSuggestions(suggestions);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Address search failed:", error);
          setAddressSearchError("Could not search addresses.");
          setAddressSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearchingAddress(false);
        }
      }
    }

    const timeout = setTimeout(searchAddresses, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [bookingForm.address.query]);

  function selectAddress(suggestion) {
    const distanceFromWarehouse = calculateDistanceMiles(WAREHOUSE_LOCATION, {
      longitude: suggestion.longitude,
      latitude: suggestion.latitude,
    });

    const mileageFee = calculateMileageFee(distanceFromWarehouse);

    updateBookingForm("address.query", suggestion.fullAddress);
    updateBookingForm("address.fullAddress", suggestion.fullAddress);
    updateBookingForm("address.address1", suggestion.address1);
    updateBookingForm("address.city", suggestion.city);
    updateBookingForm("address.state", suggestion.state);
    updateBookingForm("address.zip", suggestion.zip);
    updateBookingForm("address.longitude", suggestion.longitude);
    updateBookingForm("address.latitude", suggestion.latitude);
    updateBookingForm("address.distanceFromWarehouse", distanceFromWarehouse);
    updateBookingForm("pricing.mileageFee", mileageFee);

    setAddressSuggestions([]);
  }

  return (
    <StepShell
      title="Start address"
      description="Enter the delivery address and project type to begin your booking."
      onNext={goToNextStep}
      hideBack
    >
      <div className="space-y-4">
        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search Address
          </label>

          <Input
            placeholder="Start typing an address..."
            value={bookingForm.address.query}
            onChange={(e) => updateBookingForm("address.query", e.target.value)}
            autoComplete="off"
          />

          {isSearchingAddress && (
            <p className="mt-2 text-xs text-gray-500">Searching addresses...</p>
          )}

          {addressSearchError && (
            <p className="mt-2 text-xs text-red-600">{addressSearchError}</p>
          )}

          {addressSuggestions.length > 0 && (
            <div className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
              {addressSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => selectAddress(suggestion)}
                  className="block w-full border-b border-gray-100 px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-gray-50"
                >
                  <p className="font-medium text-gray-900">
                    {suggestion.address1 || suggestion.fullAddress}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {suggestion.fullAddress}
                  </p>
                </button>
              ))}
            </div>
          )}

          <p className="mt-2 text-xs text-gray-500">
            Start typing to search with Mapbox autocomplete.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Address
            </label>
            <Input
              value={bookingForm.address.fullAddress}
              onChange={(e) =>
                updateBookingForm("address.fullAddress", e.target.value)
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address Line 1
            </label>
            <Input
              value={bookingForm.address.address1}
              onChange={(e) =>
                updateBookingForm("address.address1", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              City
            </label>
            <Input
              value={bookingForm.address.city}
              onChange={(e) => updateBookingForm("address.city", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              State
            </label>
            <Input
              value={bookingForm.address.state}
              onChange={(e) =>
                updateBookingForm("address.state", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              ZIP
            </label>
            <Input
              value={bookingForm.address.zip}
              onChange={(e) => updateBookingForm("address.zip", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Project Type
            </label>
            <Select
              value={bookingForm.address.projectType}
              onChange={(e) =>
                updateBookingForm("address.projectType", e.target.value)
              }
            >
              <option value="">Select project type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Distance from Warehouse
            </label>
            <Input
              value={
                bookingForm.address.distanceFromWarehouse
                  ? `${bookingForm.address.distanceFromWarehouse} miles`
                  : ""
              }
              disabled
              readOnly
            />
          </div>
        </div>
      </div>
    </StepShell>
  );
}