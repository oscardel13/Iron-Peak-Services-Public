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
  return Array.isArray(product.supportedMaterials)
    ? product.supportedMaterials.includes(material)
    : false;
}

export function calculateBookingTotal(form) {
  return (
    (form.pricing.basePrice || 0) +
    (form.pricing.materialSurcharge || 0) +
    (form.pricing.drivewayProtectionFee || 0) +
    (form.pricing.priorityDeliveryFee || 0) +
    (form.pricing.extraDaysFee || 0)
  );
}