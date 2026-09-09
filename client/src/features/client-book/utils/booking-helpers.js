// TODO: Move warehouse location to config or database also update for production
import { WAREHOUSE_LOCATION } from "./booking-data";

export function calculateRentalDays(deliveryDate, pickupDate) {
  if (!deliveryDate || !pickupDate) return 0;

  const start = new Date(`${deliveryDate}T00:00:00`);
  const end = new Date(`${pickupDate}T00:00:00`);

  const diff = end.getTime() - start.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return days > 0 ? days : 0;
}

export function calculateExtraDaysFee(rentalDays) {
  if (!rentalDays || rentalDays <= 7) return 0;
  return (rentalDays - 7) * 25;
}

export function getMaterialSurcharge(material) {
  if (material === "concrete") return 75;
  return 0;
}

export function getMaterialLabel(material, materialOptions = []) {
  const found = materialOptions.find((item) => item.value === material);
  return found?.label || material || "";
}

export function productSupportsMaterial(product, material) {
  if (!material) return true;

  /**
   * If the backend does not send supportedMaterials yet,
   * assume the dumpster supports the material.
   *
   * This prevents every product from becoming disabled just because
   * supportedMaterials is missing from the API response.
   */
  if (!Array.isArray(product?.supportedMaterials)) return true;

  if (product.supportedMaterials.length === 0) return true;

  return product.supportedMaterials.includes(material);
}

const FREE_MILE_RADIUS = 20;
const MILEAGE_RATE_AFTER_FREE_RADIUS = 2;

export function calculateMileageFee(distanceFromWarehouse) {
  if (distanceFromWarehouse == null) return 0;

  const distance = Number(distanceFromWarehouse);

  if (!Number.isFinite(distance) || distance <= FREE_MILE_RADIUS) {
    return 0;
  }

  const billableMiles = distance - FREE_MILE_RADIUS;
  const mileageFee = billableMiles * MILEAGE_RATE_AFTER_FREE_RADIUS;

  return Number(mileageFee.toFixed(2));
}

export function calculateBookingTotal(form) {
  return (
    Number(form.pricing.basePrice || 0) +
    Number(form.pricing.materialSurcharge || 0) +
    Number(form.pricing.drivewayProtectionFee || 0) +
    Number(form.pricing.priorityDeliveryFee || 0) +
    Number(form.pricing.extraDaysFee || 0) +
    Number(form.pricing.mileageFee || 0)
  );
}

export function getDistanceFromWarehouse(lat, lng) {
  if (lat == null || lng == null) return null;

  const warehouseLat = WAREHOUSE_LOCATION.latitude;
  const warehouseLng = WAREHOUSE_LOCATION.longitude;

  const toRad = (value) => (value * Math.PI) / 180;

  const R = 3958.8;
  const dLat = toRad(lat - warehouseLat);
  const dLng = toRad(lng - warehouseLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(warehouseLat)) *
      Math.cos(toRad(lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}
