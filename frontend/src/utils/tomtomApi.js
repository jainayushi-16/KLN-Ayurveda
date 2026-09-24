/**
 * TomTom API Location Service Utility
 * Supports live location reverse geocoding and fuzzy location search
 * with automatic fallback to OpenStreetMap Nominatim when TomTom API key is not configured.
 */

const getTomTomApiKey = () => process.env.NEXT_PUBLIC_TOMTOM_API_KEY || "";

/**
 * Perform location search using TomTom Search API (or fallback to Nominatim)
 * @param {string} query 
 * @returns {Promise<Array>} Array of parsed address objects
 */
export async function searchLocationTomTom(query) {
  if (!query || !query.trim()) return [];
  const TOMTOM_API_KEY = getTomTomApiKey();

  // Try TomTom API if key is available
  if (TOMTOM_API_KEY && TOMTOM_API_KEY !== "YOUR_TOMTOM_API_KEY") {
    try {
      const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&countrySet=IN&limit=5`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.results && data.results.length > 0) {
          return data.results.map((item, idx) => {
            const addr = item.address || {};
            const poiName = item.poi?.name;
            const streetName = [addr.streetNumber, addr.streetName || addr.street, poiName].filter(Boolean).join(" ");
            
            return {
              id: item.id || idx,
              displayName: addr.freeformAddress || poiName || query,
              street: streetName || addr.freeformAddress || "",
              city: addr.municipality || addr.city || addr.municipalitySubdivision || addr.countrySecondarySubdivision || "",
              state: addr.countrySubdivisionName || addr.countrySubdivision || "",
              pincode: addr.postalCode || "",
              country: addr.country || "India",
              lat: item.position?.lat,
              lon: item.position?.lon,
              source: "TomTom",
            };
          });
        }
      }
    } catch (err) {
      console.warn("TomTom search API error, falling back to OSM Nominatim:", err);
    }
  }

  // Fallback to OpenStreetMap Nominatim API
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=in`
    );
    const data = await response.json();
    if (Array.isArray(data)) {
      return data.map((item, idx) => {
        const addr = item.address || {};
        return {
          id: item.place_id || idx,
          displayName: item.display_name,
          street: [addr.house_number, addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(", ") || item.display_name,
          city: addr.city || addr.town || addr.village || addr.county || addr.state_district || "",
          state: addr.state || "",
          pincode: addr.postcode || "",
          country: addr.country || "India",
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          source: "OpenStreetMap",
        };
      });
    }
  } catch (err) {
    console.error("OSM Nominatim search error:", err);
  }

  return [];
}

/**
 * Reverse geocode latitude and longitude to full address using TomTom API (or fallback to Nominatim)
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object|null>} Parsed address object
 */
export async function reverseGeocodeTomTom(latitude, longitude) {
  if (!latitude || !longitude) return null;
  const TOMTOM_API_KEY = getTomTomApiKey();

  // Try TomTom Reverse Geocode API if key is set
  if (TOMTOM_API_KEY && TOMTOM_API_KEY !== "YOUR_TOMTOM_API_KEY") {
    try {
      const url = `https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?key=${TOMTOM_API_KEY}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const addressObj = data?.addresses?.[0];
        if (addressObj && addressObj.address) {
          const addr = addressObj.address;
          const streetStr = [addr.buildingNumber || addr.streetNumber, addr.streetName || addr.street, addr.municipalitySubdivision].filter(Boolean).join(", ");

          return {
            displayName: addr.freeformAddress || `${latitude}, ${longitude}`,
            street: streetStr || addr.freeformAddress || "",
            city: addr.municipality || addr.city || addr.municipalitySubdivision || addr.countrySecondarySubdivision || "",
            state: addr.countrySubdivisionName || addr.countrySubdivision || "",
            pincode: addr.postalCode || "",
            country: addr.country || "India",
            lat: latitude,
            lon: longitude,
            source: "TomTom",
          };
        }
      }
    } catch (err) {
      console.warn("TomTom reverse geocode error, falling back to OSM Nominatim:", err);
    }
  }

  // Fallback to OpenStreetMap Nominatim API
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
    );
    const data = await res.json();
    if (data && data.address) {
      const addr = data.address;
      return {
        displayName: data.display_name,
        street: [addr.house_number, addr.road, addr.suburb, addr.neighbourhood, addr.residential].filter(Boolean).join(", ") || data.display_name,
        city: addr.city || addr.town || addr.village || addr.county || addr.state_district || "",
        state: addr.state || "",
        pincode: addr.postcode || "",
        country: addr.country || "India",
        lat: latitude,
        lon: longitude,
        source: "OpenStreetMap",
      };
    }
  } catch (err) {
    console.error("OSM Reverse geocode error:", err);
  }

  return null;
}
