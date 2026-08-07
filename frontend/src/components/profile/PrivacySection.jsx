"use client";

import { useState } from "react";
import { Lock, Download, Trash2, AlertTriangle, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";

export default function PrivacySection() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [dataPrefs, setDataPrefs] = useState({
    personalizedAds: false,
    analyticsSharing: true,
    thirdPartyCookies: false,
  });

  const handleDownloadData = () => {
    toast.success("Preparing your account data archive. Download starting...", {
      icon: "📦",
    });

    setTimeout(() => {
      const dummyData = {
        user: "Ayushi Jain",
        email: "ayushi@example.com",
        customerID: "KLN-98421",
        memberSince: "January 2024",
        totalOrders: 12,
        loyaltyPoints: 1450,
      };

      const blob = new Blob([JSON.stringify(dummyData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kln-ayurveda-user-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toUpperCase() !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm account erasure.");
      return;
    }

    toast.error("Account deletion request submitted. Our privacy officer will process your request within 24 hours.", {
      duration: 5000,
    });
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Privacy & Data Settings */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
              Privacy & Data Settings
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
              Control your data export, cookie preferences, and account deletion options.
            </p>
          </div>
          <span className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34]">
            <Lock className="w-5 h-5" />
          </span>
        </div>

        {/* Data Export Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 gap-4 mb-6">
          <div className="flex items-start gap-4">
            <span className="p-3 rounded-xl bg-white text-[#2F5D34] shadow-sm">
              <Download className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-[#222123]">Download My Account Data</h4>
              <p className="text-xs text-gray-600 font-paragraph mt-0.5">
                Get a copy of your personal details, order history, addresses, and wishlist.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadData}
            className="px-6 py-2.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow hover:bg-[#224426] transition-all flex-none"
          >
            Download Data (JSON)
          </button>
        </div>

        {/* Data Preferences Toggles */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Data Sharing & Analytics</h4>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div>
              <p className="text-xs font-bold text-gray-800">Anonymous Usage Analytics</p>
              <p className="text-[11px] text-gray-500">Helps us optimize site performance and wellness recommendations.</p>
            </div>
            <input
              type="checkbox"
              checked={dataPrefs.analyticsSharing}
              onChange={(e) => setDataPrefs({ ...dataPrefs, analyticsSharing: e.target.checked })}
              className="w-4 h-4 rounded text-[#2F5D34]"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div>
              <p className="text-xs font-bold text-gray-800">Personalized Product Recommendations</p>
              <p className="text-[11px] text-gray-500">Tailor Ayurvedic herbal recommendations based on hair & skin type.</p>
            </div>
            <input
              type="checkbox"
              checked={dataPrefs.personalizedAds}
              onChange={(e) => setDataPrefs({ ...dataPrefs, personalizedAds: e.target.checked })}
              className="w-4 h-4 rounded text-[#2F5D34]"
            />
          </div>
        </div>

        {/* Danger Zone: Delete Account */}
        <div className="border-t border-gray-200 pt-6">
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="p-3 rounded-xl bg-rose-100 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-rose-900">Danger Zone: Delete Account</h4>
                <p className="text-xs text-rose-700 font-paragraph mt-0.5">
                  Permanently delete your profile, loyalty points, and purchase history.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-rose-700 transition-all flex-none"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-white">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="inline-block p-4 rounded-full bg-rose-100 text-rose-600 mb-3">
                <Trash2 className="w-8 h-8" />
              </span>
              <h3 className="text-xl font-bold text-rose-900">Are you absolutely sure?</h3>
              <p className="text-xs text-gray-600 font-paragraph mt-2 leading-relaxed">
                This action will permanently delete your account, earned <strong>1,450 Loyalty Points</strong>, saved addresses, and active order records.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                Type <span className="text-rose-600 font-black">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-2.5 rounded-xl border border-rose-300 text-sm font-bold text-rose-900 uppercase outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-rose-700 shadow"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
