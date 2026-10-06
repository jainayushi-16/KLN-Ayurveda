"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Navigation, Check, Loader2, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { searchLocationTomTom, reverseGeocodeTomTom } from "@/utils/tomtomApi";

export default function MapAddressSelector({ onSelectAddress, initialAddress = {} }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);

  // Live Auto-suggest search as user types (Debounced 300ms)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocationTomTom(trimmed);
        setSearchResults(results || []);
        setShowDropdown(true);
      } catch (err) {
        console.warn("Area auto-suggest error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener to dismiss suggested areas dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Form submission search handler
  const handleSearchSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchLocationTomTom(searchQuery);
      if (results && results.length > 0) {
        setSearchResults(results);
        setShowDropdown(true);
      } else {
        toast.error("No matching area found. Try another city or landmark.");
      }
    } catch (err) {
      toast.error("Location search failed. Please enter address manually.");
    } finally {
      setIsSearching(false);
    }
  };

  // Get Current Live Location via Geolocation API + TomTom Reverse Geocoding
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
            setSearchQuery(parsed.street || parsed.city || parsed.displayName);
            setShowDropdown(false);
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

  // User selects an area from the suggested dropdown list
  const handlePickResult = (item) => {
    setSelectedLocation(item);
    setShowDropdown(false);
    setSearchQuery(item.street || item.city || item.displayName);
    
    if (onSelectAddress) {
      onSelectAddress(item);
    }
    toast.success(`Selected ${item.street || item.city || "area"}! 📍`);
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) return;
    onSelectAddress(selectedLocation);
    toast.success("Address fields populated from Map location! 📍");
  };

  const handleClearQuery = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2F5D34]/20 shadow-md my-4 space-y-4 relative">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2 text-[#2F5D34]">
          <MapPin className="w-5 h-5" />
          <h4 className="font-bold text-sm uppercase tracking-wider text-[#4B0082]">Search & Select Map Area</h4>
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

      {/* Location Search Bar with Live Area Auto-suggest */}
      <div className="relative">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              placeholder="Type area, landmark, street, city or PIN code..."
              className="w-full pl-10 pr-9 py-3 rounded-xl border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34] focus:ring-2 focus:ring-[#2F5D34]/10 bg-gray-50 transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearQuery}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-3 rounded-xl bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#224426] transition-all cursor-pointer flex-none flex items-center gap-1.5 disabled:opacity-60"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </form>

        {/* Live Suggested Areas Dropdown */}
        {showDropdown && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[#2F5D34]/20 shadow-2xl z-50 overflow-hidden animate-fadeIn">
            <div className="px-3.5 py-2 bg-[#E8F2E3]/60 border-b border-gray-100 flex items-center justify-between text-[11px] font-bold text-[#2F5D34]">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#2F5D34]" /> Suggested Areas & Locations
              </span>
              <span className="text-gray-400 font-normal">{searchResults.length} results</span>
            </div>

            {isSearching ? (
              <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#2F5D34]" />
                <span>Searching matching areas...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500">
                No matching area or landmark found. Try another search query.
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto divide-y divide-gray-100">
                {searchResults.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => handlePickResult(item)}
                    className="p-3 hover:bg-[#E8F2E3]/50 cursor-pointer text-xs transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-1.5 rounded-lg bg-gray-100 text-[#2F5D34] group-hover:bg-[#2F5D34] group-hover:text-white transition-colors flex-none mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-[#4B0082] truncate group-hover:text-[#2F5D34] transition-colors">
                          {item.street || item.displayName}
                        </p>
                        {item.source && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 font-mono text-gray-500 uppercase flex-none">
                            {item.source}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-gray-500 font-paragraph truncate mt-0.5">
                        {[item.city, item.state, item.pincode, item.country].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Location Card */}
      {selectedLocation && (
        <div className="p-4 bg-[#E8F2E3]/60 rounded-2xl border border-[#2F5D34]/30 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F5D34] bg-white px-2.5 py-0.5 rounded-full border border-[#2F5D34]/20">
              ✓ Map Area Selected
            </span>
            <span className="text-[10px] text-gray-500 font-mono">
              {selectedLocation.lat?.toFixed(4)}, {selectedLocation.lon?.toFixed(4)}
            </span>
          </div>

          <p className="text-xs font-bold text-[#4B0082]">{selectedLocation.street || selectedLocation.displayName}</p>
          <p className="text-xs text-gray-600 font-paragraph">
            {selectedLocation.city}, {selectedLocation.state} - <strong>{selectedLocation.pincode}</strong> ({selectedLocation.country})
          </p>

          <button
            type="button"
            onClick={handleConfirmLocation}
            className="w-full py-2.5 rounded-xl bg-[#2F5D34] text-white font-extrabold text-xs uppercase tracking-wider shadow hover:bg-[#224426] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply Selected Area To Address Form</span>
          </button>
        </div>
      )}
    </div>
  );
}
