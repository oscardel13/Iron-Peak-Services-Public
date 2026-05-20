const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export async function searchMapboxAddresses(
  query
){
  if (!MAPBOX_TOKEN) {
    throw new Error("Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN");
  }

  if (!query || query.trim().length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    q: query.trim(),
    access_token: MAPBOX_TOKEN,
    country: "us",
    limit: "5",
    autocomplete: "true",
    types: "address",
  });

  const url = `https://api.mapbox.com/search/geocode/v6/forward?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to search Mapbox addresses");
  }

  const data = await response.json();

  return (data.features || []).map((feature) => {
    const props = feature.properties || {};
    const coords = feature.geometry?.coordinates || [];

    const longitude = Number(coords[0]);
    const latitude = Number(coords[1]);

    const context = props.context || {};

    const addressNumber = props.address_number || "";
    const street = props.street || "";
    const address1 = [addressNumber, street].filter(Boolean).join(" ");

    return {
      id: props.mapbox_id || feature.id,
      fullAddress: props.full_address || props.place_formatted || props.name || "",
      address1: address1 || props.name || "",
      city:
        context.place?.name ||
        context.locality?.name ||
        context.district?.name ||
        "",
      state: context.region?.region_code || context.region?.name || "",
      zip: context.postcode?.name || "",
      longitude,
      latitude,
    };
  });
}

export function calculateDistanceMiles(
  from, to
) {
  const earthRadiusMiles = 3958.8;

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((earthRadiusMiles * c).toFixed(2));
}