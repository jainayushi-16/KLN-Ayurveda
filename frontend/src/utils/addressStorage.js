export const DEFAULT_SAVED_ADDRESSES = [];

export function isSampleAddress(addr) {
  if (!addr) return false;
  const str = `${addr.fullName || ""} ${addr.street || ""} ${addr.city || ""} ${addr.pincode || ""} ${addr.landmark || ""}`.toLowerCase();
  return (
    str.includes("ayushi jain") ||
    str.includes("niranjan ward") ||
    str.includes("mahalaxmi nagar") ||
    str.includes("innovation tech park")
  );
}

export function deduplicateAddresses(list) {
  if (!Array.isArray(list)) return [];
  const seenKeys = new Set();
  const unique = [];

  for (const item of list) {
    if (!item || isSampleAddress(item)) continue;

    const street = (item.street || "").trim().toLowerCase();
    const city = (item.city || "").trim().toLowerCase();
    const state = (item.state || "").trim().toLowerCase();
    const pincode = (item.pincode || item.postalCode || "").trim();
    const fullName = (item.fullName || "").trim().toLowerCase();
    const phone = (item.phone || "").trim();

    // Composite key to check exact address uniqueness
    const key = `${fullName}|${street}|${city}|${state}|${pincode}|${phone}`;

    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      unique.push(item);
    }
  }

  return unique;
}

export function getStoredAddresses() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("kln_saved_addresses");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const clean = deduplicateAddresses(parsed);
        localStorage.setItem("kln_saved_addresses", JSON.stringify(clean));
        return clean;
      }
    }
  } catch (e) {
    console.error("Address storage read error:", e);
  }
  return [];
}

export function saveStoredAddresses(addresses) {
  if (typeof window === "undefined") return;
  try {
    const clean = deduplicateAddresses(addresses);
    localStorage.setItem("kln_saved_addresses", JSON.stringify(clean));
  } catch (e) {
    console.error("Address storage save error:", e);
  }
}

export function addStoredAddress(newAddr) {
  if (!newAddr || isSampleAddress(newAddr)) return getStoredAddresses();
  const current = getStoredAddresses();
  const addrWithId = {
    ...newAddr,
    id: newAddr.id || `addr-${Date.now()}`,
    title: newAddr.title || newAddr.type || "Home",
  };
  const updated = newAddr.isDefault
    ? [addrWithId, ...current.map((a) => ({ ...a, isDefault: false }))]
    : [...current, addrWithId];

  const unique = deduplicateAddresses(updated);
  saveStoredAddresses(unique);
  return unique;
}
