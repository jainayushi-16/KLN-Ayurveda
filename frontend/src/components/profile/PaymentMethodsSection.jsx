"use client";

import { useState } from "react";
import { CreditCard, Plus, CheckCircle2, Trash2, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/i18n/LanguageContext";

export default function PaymentMethodsSection({ paymentMethods, onUpdatePaymentMethods }) {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "Visa",
    cardNumber: "",
    cardHolder: "AYUSHI JAIN",
    expiry: "",
    upiId: "",
  });

  const handleSetDefault = (id) => {
    const updated = paymentMethods.map((pm) => ({
      ...pm,
      isDefault: pm.id === id,
    }));
    onUpdatePaymentMethods(updated);
    toast.success("Default payment method updated!", { icon: "💳" });
  };

  const handleDelete = (id) => {
    const updated = paymentMethods.filter((pm) => pm.id !== id);
    onUpdatePaymentMethods(updated);
    toast.success("Payment method removed.", { icon: "🗑️" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newCard;
    if (formData.type === "UPI") {
      newCard = {
        id: `pay-${Date.now()}`,
        type: "UPI",
        upiId: formData.upiId || "ayushi@upi",
        provider: "UPI ID / VPA",
        isDefault: paymentMethods.length === 0,
        badgeColor: "from-emerald-600 to-teal-800",
      };
    } else {
      const last4 = formData.cardNumber ? formData.cardNumber.slice(-4) : "9988";
      newCard = {
        id: `pay-${Date.now()}`,
        type: formData.type,
        cardNumber: `•••• •••• •••• ${last4}`,
        cardHolder: formData.cardHolder.toUpperCase(),
        expiry: formData.expiry || "12/29",
        isDefault: paymentMethods.length === 0,
        badgeColor: formData.type === "Visa" ? "from-blue-600 to-indigo-800" : "from-amber-600 to-rose-700",
      };
    }

    onUpdatePaymentMethods([...paymentMethods, newCard]);
    toast.success("Payment method added successfully!", { icon: "✨" });
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-[#2F5D34]/15 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
            {t("profilePage.paymentMethods", {}, "Payment Methods")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
            {t("profilePage.paymentMethodsDesc", {}, "Manage your saved credit cards, debit cards, and UPI payment options.")}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("profilePage.addPaymentMethod", {}, "Add Payment Method")}</span>
        </button>
      </div>

      {/* Payment Cards Grid */}
      {paymentMethods.length === 0 ? (
        <div className="text-center py-12 bg-gray-50/80 rounded-2xl border border-dashed border-gray-300">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#222123]">{t("profilePage.noPaymentMethods", {}, "No Payment Methods Saved")}</h3>
          <p className="text-xs text-gray-500 font-paragraph mt-1 mb-4">
            {t("profilePage.noPaymentMethodsDesc", {}, "Add your preferred payment option for quick checkouts.")}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow cursor-pointer"
          >
            {t("profilePage.addPaymentMethod", {}, "Add Payment Method")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((pm) => {
            const isUPI = pm.type === "UPI";

            return (
              <div
                key={pm.id}
                className={`rounded-2xl p-6 text-white shadow-xl bg-gradient-to-br ${pm.badgeColor} relative overflow-hidden flex flex-col justify-between h-48 border border-white/20`}
              >
                {/* Background watermark */}
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-9xl font-extrabold select-none">
                  {pm.type[0]}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold uppercase tracking-widest text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                      {pm.type}
                    </span>
                    {pm.isDefault && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white text-gray-900 px-2.5 py-0.5 rounded-full shadow">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Default
                      </span>
                    )}
                  </div>

                  {isUPI ? (
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-white/70 block">UPI Virtual Address</span>
                      <p className="font-mono text-base font-bold tracking-wider mt-1">{pm.upiId}</p>
                      <p className="text-xs text-white/80 mt-1">{pm.provider}</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-white/70 block">Card Number</span>
                      <p className="font-mono text-lg font-bold tracking-widest mt-1">{pm.cardNumber}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-end justify-between border-t border-white/20 pt-3 mt-2">
                  {!isUPI ? (
                    <div>
                      <p className="text-[9px] uppercase text-white/70">Card Holder</p>
                      <p className="text-xs font-bold">{pm.cardHolder}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[9px] uppercase text-white/70">Status</p>
                      <p className="text-xs font-bold text-emerald-200">Verified VPA</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {!pm.isDefault && (
                      <button
                        onClick={() => handleSetDefault(pm.id)}
                        className="text-[10px] font-bold uppercase underline text-white/90 hover:text-white"
                      >
                        Make Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(pm.id)}
                      title="Delete Method"
                      className="p-1.5 rounded-full bg-white/20 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer text-white"
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

      {/* Add Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-white">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#222123] mb-4">Add Payment Method</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Payment Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                >
                  <option value="Visa">Visa Credit/Debit Card</option>
                  <option value="MasterCard">MasterCard Credit/Debit Card</option>
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                </select>
              </div>

              {formData.type === "UPI" ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="username@okaxis or username@paytm"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4532 •••• •••• 8812"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cardHolder}
                        onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="08/28"
                        value={formData.expiry}
                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                      />
                    </div>
                  </div>
                </>
              )}

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
                  Save Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
