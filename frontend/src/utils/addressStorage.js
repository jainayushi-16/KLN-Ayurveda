export const DEFAULT_SAVED_ADDRESSES = [
  {
    id: "addr-home-1",
    title: "Home",
    type: "Home Address",
    fullName: "Ayushi Jain",
    phone: "+91 77258 20320",
    street: "160/2 Niranjan Ward, Kareli",
    landmark: "Near Central Square",
    city: "Kareli",
    state: "Madhya Pradesh",
    pincode: "487221",
    country: "India",
    isDefault: true,
  },
  {
    id: "addr-work-2",
    title: "Work",
    type: "Work Address",
    fullName: "Ayushi Jain",
    phone: "+91 77258 20320",
    street: "Plot 42, Innovation Tech Park, Indiranagar",
    landmark: "Opposite Metro Station",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    country: "India",
    isDefault: false,
  },
];

export function getStoredAddresses() {
  if (typeof window === "undefined") return DEFAULT_SAVED_ADDRESSES;
  try {
    const raw = localStorage.getItem("kln_saved_addresses");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return DEFAULT_SAVED_ADDRESSES;
}

export function saveStoredAddresses(addresses) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("kln_saved_addresses", JSON.stringify(addresses));
  } catch (e) {}
}

export function addStoredAddress(newAddr) {
  const current = getStoredAddresses();
  const addrWithId = {
    ...newAddr,
    id: newAddr.id || `addr-${Date.now()}`,
    title: newAddr.title || newAddr.type || "Home",
  };
  const updated = newAddr.isDefault
    ? [addrWithId, ...current.map((a) => ({ ...a, isDefault: false }))]
    : [addrWithId, ...current];
  saveStoredAddresses(updated);
  return updated;
}
