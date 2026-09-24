"use client";

import { useState } from "react";
import { MapPin, Search, Navigation, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { searchLocationTomTom, reverseGeocodeTomTom } from "@/utils/tomtomApi";

export default function MapAddressSelector({ onSelectAddress, initialAddress = {} }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Search Location using TomTom API (with OSM Fallback)
  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);

    try {
      const results = await searchLocationTomTom(searchQuery);

      if (results && results.length > 0) {
        setSearchResults(results);
      } else {
        toast.error("No matching location found. Try another city or landmark.");
      }
    } catch (err) {
      console.warn("Map search error:", err);
      toast.error("Map location search failed. Please enter address manually.");
    } finally {
      setIsSearching(false);
    }
  };

  // Get Current Live Location via Browser Geolocation API + TomTom Reverse Geocoding
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const parsed = await reverseGeocodeTomTom(latitude, longitude);

          if (parsed) {
            setSelectedLocation(parsed);
            if (onSelectAddress) onSelectAddress(parsed);
            toast.success(`Detected live location using ${parsed.source || "Map"} API! 📍`);
          } else {
            toast.error("Could not fetch address details for your live position.");
          }
        } catch (err) {
          toast.error("Could not fetch location address details.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please search or enter address manually.");
        } else {
          toast.error("Unable to retrieve current live location.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handlePickResult = (item) => {
    setSelectedLocation(item);
    setSearchResults([]);
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) return;
    onSelectAddress(selectedLocation);
    toast.success("Address fields populated from Map location! 📍");
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2F5D34]/20 shadow-md my-4 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2 text-[#2F5D34]">
          <MapPin className="w-5 h-5" />
          <h4 className="font-bold text-sm uppercase tracking-wider text-[#222123]">Search & Select Map Location</h4>
        </div>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="px-3.5 py-1.5 rounded-full bg-[#E8F2E3] text-[#2F5D34] font-bold text-xs uppercase tracking-wider hover:bg-[#2F5D34] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
        >
          {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
          <span>Use My Location</span>
        </button>
      </div>

      {/* Location Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search landmark, street, city or PIN code..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34] bg-gray-50"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-5 py-3 rounded-xl bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#224426] transition-all cursor-pointer flex-none flex items-center gap-1.5"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search Map"}
        </button>
      </form>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 max-h-48 overflow-y-auto shadow-lg">
          {searchResults.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handlePickResult(item)}
              className="p-3 hover:bg-[#E8F2E3]/50 cursor-pointer text-xs transition-colors flex items-start gap-2"
            >
              <MapPin className="w-4 h-4 text-[#2F5D34] flex-none mt-0.5" />
              <div>
                <p className="font-bold text-[#222123]">{item.display_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Location Card */}
      {selectedLocation && (
        <div className="p-4 bg-[#E8F2E3]/60 rounded-2xl border border-[#2F5D34]/30 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F5D34] bg-white px-2.5 py-0.5 rounded-full border border-[#2F5D34]/20">
              ✓ Map Location Selected
            </span>
            <span className="text-[10px] text-gray-500 font-mono">
              {selectedLocation.lat?.toFixed(4)}, {selectedLocation.lon?.toFixed(4)}
            </span>
          </div>

          <p className="text-xs font-bold text-[#222123]">{selectedLocation.street}</p>
          <p className="text-xs text-gray-600 font-paragraph">
            {selectedLocation.city}, {selectedLocation.state} - <strong>{selectedLocation.pincode}</strong> ({selectedLocation.country})
          </p>

          <button
            type="button"
            onClick={handleConfirmLocation}
            className="w-full py-2.5 rounded-xl bg-[#2F5D34] text-white font-extrabold text-xs uppercase tracking-wider shadow hover:bg-[#224426] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply Map Address To Shipping Form</span>
          </button>
        </div>
      )}
    </div>
  );
}
