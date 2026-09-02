"use client";

import { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, Home, Building2, X } from "lucide-react";
import toast from "react-hot-toast";
import { profileApi } from "@/services/profile.api";
import { saveStoredAddresses } from "@/utils/addressStorage";
import { useLanguage } from "@/i18n/LanguageContext";

export default function AddressBookSection({ addresses, onUpdateAddresses }) {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [formData, setFormData] = useState({
    title: "Home",
    type: "Home Address",
    fullName: "Ayushi Jain",
    phone: "+91 98765 43210",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      title: "Home",
      type: "Home Address",
      fullName: "Ayushi Jain",
      phone: "+91 98765 43210",
      street: "",
      landmark: "",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "",
      country: "India",
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    setFormData({ ...addr });
    setIsModalOpen(true);
  };

  const handleSetDefault = async (id) => {
    try {
      await profileApi.setDefaultAddress(id);
      const updated = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }));
      saveStoredAddresses(updated);
      onUpdateAddresses(updated);
      toast.success("Default shipping address updated!", { icon: "📍" });
    } catch (err) {
      toast.error(err?.message || "Failed to set default address.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await profileApi.deleteAddress(id);
      const updated = addresses.filter((addr) => addr.id !== id);
      saveStoredAddresses(updated);
      onUpdateAddresses(updated);
      toast.success("Address removed from address book.", { icon: "🗑️" });
    } catch (err) {
      toast.error(err?.message || "Failed to delete address.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.pincode || formData.postalCode || "560001",
        country: formData.country || "India",
        isDefault: formData.isDefault,
      };

      if (editingAddress) {
        const res = await profileApi.updateAddress(editingAddress.id, payload);
        const updatedAddr = res.data || { ...formData, id: editingAddress.id };
        const updated = addresses.map((a) => (a.id === editingAddress.id ? updatedAddr : a));
        saveStoredAddresses(updated);
        onUpdateAddresses(updated);
        toast.success("Address updated successfully!", { icon: "🏡" });
      } else {
        const res = await profileApi.addAddress(payload);
        const newAddr = res.data || { ...formData, id: `addr-${Date.now()}` };
        const updated = [...addresses, newAddr];
        saveStoredAddresses(updated);
        onUpdateAddresses(updated);
        toast.success("New delivery address saved!", { icon: "📍" });
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.message || "Failed to save address.");
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-[#2F5D34]/15 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
            {t("profilePage.savedAddresses", {}, "Saved Addresses")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
            {t("profilePage.savedAddressesDesc", {}, "Manage your default delivery addresses and shipping details.")}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("profilePage.addNewAddress", {}, "Add New Address")}</span>
        </button>
      </div>

      {/* Address Cards Grid */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50/80 rounded-2xl border border-dashed border-gray-300">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#222123]">{t("profilePage.noAddressesFound", {}, "No Addresses Found")}</h3>
          <p className="text-xs text-gray-500 font-paragraph mt-1 mb-4">
            {t("profilePage.noAddressesDesc", {}, "Save your shipping addresses for seamless checkout.")}
          </p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow cursor-pointer"
          >
            {t("profilePage.addNewAddress", {}, "Add New Address")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => {
            const labelLower = (addr.title || addr.type || "").toLowerCase();
            const isHome = labelLower.includes("home");
            const isWork = labelLower.includes("work") || labelLower.includes("office");
            const prefTitle = addr.title || addr.type || (addr.isDefault ? "Home" : "Work");

            return (
              <div
                key={addr.id}
                className={`relative rounded-2xl p-6 border-2 transition-all flex flex-col justify-between ${
                  addr.isDefault
                    ? "bg-[#E7F0E4]/40 border-[#2F5D34] shadow-md ring-1 ring-[#2F5D34]/20"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-[#2F5D34]/10 text-[#2F5D34]">
                        {isHome ? (
                          <Home className="w-4 h-4" />
                        ) : isWork ? (
                          <Building2 className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-bold text-base text-[#222123]">
                        {prefTitle} Preference
                      </span>
                    </div>

                    {addr.isDefault && (
                      <span className="px-3 py-1 rounded-full bg-[#2F5D34] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3" /> Primary Preference
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-gray-800 mb-1">
                    {addr.fullName}
                  </h4>
                  <p className="text-xs text-gray-600 font-paragraph leading-relaxed mb-1">
                    {addr.street} {addr.landmark && `, ${addr.landmark}`}
                  </p>
                  <p className="text-xs text-gray-600 font-paragraph leading-relaxed mb-3">
                    {addr.city}, {addr.state} - <strong className="font-semibold">{addr.pincode}</strong>
                  </p>
                  <p className="text-xs text-gray-500 font-paragraph">
                    📞 Phone: {addr.phone} | Country: {addr.country || "India"}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs font-bold text-[#2F5D34] hover:underline"
                    >
                      Set as Primary Preference
                    </button>
                  ) : (
                    <span className="text-xs text-[#2F5D34] font-bold flex items-center gap-1">
                      <span>✓</span> Default Delivery Location
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(addr)}
                      title="Edit Address Preference"
                      className="p-2 rounded-xl bg-gray-100 hover:bg-[#2F5D34] hover:text-white transition-colors cursor-pointer text-gray-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      title="Delete Address Preference"
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-white animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#222123] mb-4">
              {editingAddress ? "Edit Delivery Address" : "Add New Delivery Address"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Address Category Type
                </label>
                <div className="flex gap-2 mb-3">
                  {[
                    { type: "Home", label: "🏡 Home" },
                    { type: "Work", label: "🏢 Work" },
                    { type: "Other", label: "📍 Other" },
                  ].map((cat) => (
                    <button
                      key={cat.type}
                      type="button"
                      onClick={() => setFormData({ ...formData, title: cat.type, type: cat.type })}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        formData.title === cat.type || formData.type === cat.type
                          ? "bg-[#2F5D34] text-white border-[#2F5D34] shadow-sm"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Address Label / Nickname
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value, type: e.target.value })}
                    placeholder="Home, Work, Other"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Street Address / House No.
                </label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Flat No, Apartment Name, Street"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Pincode / Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country || "India"}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. India, UAE, USA"
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded text-[#2F5D34] focus:ring-[#2F5D34]"
                />
                <label htmlFor="isDefault" className="text-xs text-gray-700 font-medium cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 font-bold text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow hover:bg-[#224426]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
