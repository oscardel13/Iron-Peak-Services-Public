// utils/geocode.js
const axios = require("axios");

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

function shouldGeocodeAddress(nextAddr = {}, prevAddr = {}) {
  if (!nextAddr || Object.keys(nextAddr).length === 0) return false;
  if (!prevAddr || Object.keys(prevAddr).length === 0) return true;
  const next = (nextAddr.formatted || "").trim();
  const prev = (prevAddr.formatted || "").trim();

  // easiest: formatted string changed
  if (next && next !== prev) return true;

  // or if key fields changed (fallback)
  const keys = ["street1", "street2", "city", "state", "zip", "country"];
  return keys.some((k) => (nextAddr[k] || "") !== (prevAddr[k] || ""));
}

function buildFormattedAddress(address = {}) {
  const parts = [
    address.street1,
    address.street2,
    address.city,
    address.state,
    address.zip,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
}

async function geocodeAddress(address = {}) {
  if (!MAPBOX_TOKEN) {
    throw new Error("MAPBOX_ACCESS_TOKEN not configured");
  }

  const formatted = buildFormattedAddress(address);

  if (!formatted) {
    throw new Error("No address data provided for geocoding");
  }

  const encoded = encodeURIComponent(formatted);

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_TOKEN,
        limit: 1,
      },
    });

    const features = response.data.features || [];

    if (!features.length) {
      throw new Error("No geocoding results found");
    }

    const top = features[0];

    const [lng, lat] = top.center;

    return {
      formatted: top.place_name || formatted,

      location: {
        type: "Point",
        coordinates: [lng, lat],
      },

      geocode: {
        provider: "mapbox",
        featureId: top.id || "",
        placeId: "", // mapbox doesn’t really use placeId
        precision: top.place_type?.[0] || "",
        geocodedAt: new Date(),
      },
    };
  } catch (err) {
    console.error("Geocoding error:", err.message);
    throw new Error("Failed to geocode address");
  }
}

module.exports = { geocodeAddress, shouldGeocodeAddress };