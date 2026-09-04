"use client";

function Row({ label, value, bold = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`text-sm text-right ${
          bold ? "font-semibold text-gray-900" : "text-gray-800"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function formatProjectType(projectType) {
  if (!projectType) return "";
  return projectType
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// pretend this exists for now
function getDistanceFromWarehouse(address) {
  return address.distanceFromWarehouse ?? null;
}

export default function BookingSummaryCard({ bookingForm }) {
  const distanceFromWarehouse = getDistanceFromWarehouse(bookingForm.address);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">
          Delivery location
        </h3>
        <p className="mt-2 text-sm text-gray-700">
          {bookingForm.address.fullAddress || "No address selected yet"}
        </p>

        <div className="mt-3 border-t border-gray-100 pt-2">
          <Row
            label="Project Type"
            value={formatProjectType(bookingForm.address.projectType)}
          />
          <Row
            label="Distance from Warehouse"
            value={
              distanceFromWarehouse != null
                ? `${distanceFromWarehouse} miles`
                : ""
            }
          />
          <Row
            label="Mileage Fee"
            value={`$${(bookingForm.pricing.mileageFee || 0).toFixed(2)}`}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Dumpster</h3>
        <div className="mt-3 border-t border-gray-100 pt-2">
          <Row label="Material" value={bookingForm.dumpster.material} />
          <Row
            label="Material Surcharge"
            value={`$${(bookingForm.pricing.materialSurcharge || 0).toFixed(2)}`}
          />
          <Row
            label="Container Size"
            value={
              bookingForm.dumpster.size
                ? `${bookingForm.dumpster.size} yd`
                : ""
            }
          />
          <Row label="Product" value={bookingForm.dumpster.productLabel} />
          <Row
            label="Included"
            value={bookingForm.dumpster.includedWeightText}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Add-ons</h3>
        <div className="mt-3 border-t border-gray-100 pt-2">
          <Row
            label="Priority Delivery"
            value={
              bookingForm.addons.priorityDelivery
                ? `$${bookingForm.pricing.priorityDeliveryFee.toFixed(2)}`
                : "Not added"
            }
          />
          <Row
            label="Driveway Surface Protection"
            value={
              bookingForm.addons.drivewayProtection
                ? `$${bookingForm.pricing.drivewayProtectionFee.toFixed(2)}`
                : "Not added"
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Date</h3>
        <div className="mt-3 border-t border-gray-100 pt-2">
          <Row label="Delivery" value={bookingForm.schedule.deliveryDate} />
          <Row
            label="Pickup"
            value={
              bookingForm.schedule.unknownPickup
                ? "I don't know yet"
                : bookingForm.schedule.pickupDate
            }
          />
          <Row
            label="Extra Days Fee"
            value={
              bookingForm.pricing.extraDaysFee
                ? `$${bookingForm.pricing.extraDaysFee.toFixed(2)}`
                : "$0.00"
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="border-t border-gray-100 pt-2">
          <Row
            label="Base Price"
            value={`$${(bookingForm.pricing.basePrice || 0).toFixed(2)}`}
          />
          <Row
            label="Total"
            value={`$${(bookingForm.pricing.total || 0).toFixed(2)}`}
            bold
          />
        </div>
      </div>
    </div>
  );
}