"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, Save, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function PersonalInfoSection({ user, onUpdateUser }) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || "1998-05-18",
    gender: user?.gender || "Male",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "1998-05-18",
        gender: user.gender || "Male",
      });
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onUpdateUser) {
        await onUpdateUser(formData);
      }
    } catch (err) {
      console.error("Profile save error:", err);
      toast.error("Failed to update profile info.");
    } finally {
      setTimeout(() => setIsSubmitting(false), 400);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
            Personal Information
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
            Update your personal details and contact information.
          </p>
        </div>
        <span className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34]">
          <User className="w-5 h-5" />
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium text-[#222123] outline-none focus:border-[#2F5D34] focus:bg-white focus:ring-2 focus:ring-[#2F5D34]/10 transition-all"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium text-[#222123] outline-none focus:border-[#2F5D34] focus:bg-white focus:ring-2 focus:ring-[#2F5D34]/10 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center justify-between">
              <span>Email Address <span className="text-rose-500">*</span></span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-10 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium text-[#222123] outline-none focus:border-[#2F5D34] focus:bg-white focus:ring-2 focus:ring-[#2F5D34]/10 transition-all"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-10 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium text-[#222123] outline-none focus:border-[#2F5D34] focus:bg-white focus:ring-2 focus:ring-[#2F5D34]/10 transition-all"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-10 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium text-[#222123] outline-none focus:border-[#2F5D34] focus:bg-white focus:ring-2 focus:ring-[#2F5D34]/10 transition-all"
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Gender (3 Options: Male, Female, Other) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium text-[#222123] outline-none focus:border-[#2F5D34] focus:bg-white focus:ring-2 focus:ring-[#2F5D34]/10 transition-all cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Information</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
