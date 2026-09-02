"use client";

import { useState } from "react";
import { HelpCircle, Mail, Phone, MessageSquare, ChevronDown, RefreshCw, Truck, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/i18n/LanguageContext";

export default function HelpSupportSection({ faqs }) {
  const { t } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const handleContactAction = (type) => {
    if (type === "chat") {
      toast.success("Opening WhatsApp Ayurvedic Live Support...", { icon: "💬" });
    } else if (type === "email") {
      toast.success("Opening Mail Client: care@klnayurveda.com", { icon: "✉️" });
    } else {
      toast.success("Calling Toll-Free Support: +91 1800-425-KLN", { icon: "📞" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Support Cards Header */}
      <div className="bg-white/90 backdrop-blur-xl border border-[#2F5D34]/15 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
              {t("profilePage.helpHubTitle", {}, "Help & Support Hub")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
              {t("profilePage.helpHubDesc", {}, "Have questions about your order or Ayurvedic hair formulation usage? We're here to help.")}
            </p>
          </div>
          <span className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34]">
            <HelpCircle className="w-5 h-5" />
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Contact Support */}
          <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex flex-col justify-between h-40">
            <div>
              <MessageSquare className="w-6 h-6 text-[#2F5D34] mb-2" />
              <h4 className="font-bold text-sm text-[#222123]">{t("profilePage.contactSupport", {}, "Contact Support")}</h4>
              <p className="text-[11px] text-gray-600 font-paragraph mt-1">{t("profilePage.liveDesk", {}, "24/7 Live Ayurvedic Care Desk")}</p>
            </div>
            <button
              onClick={() => handleContactAction("chat")}
              className="w-full py-2 rounded-xl bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#224426] transition-all cursor-pointer"
            >
              {t("profilePage.liveChat", {}, "Live Chat")}
            </button>
          </div>

          {/* Card 2: Return Policy */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#2F5D34]/30 shadow-sm flex flex-col justify-between h-40">
            <div>
              <RefreshCw className="w-6 h-6 text-[#C9A66B] mb-2" />
              <h4 className="font-bold text-sm text-[#222123]">{t("profilePage.returnPolicy", {}, "Return Policy")}</h4>
              <p className="text-[11px] text-gray-600 font-paragraph mt-1">{t("profilePage.returnPolicyDesc", {}, "15-day hassle-free doorstep returns")}</p>
            </div>
            <button
              onClick={() => setActiveModal("return")}
              className="w-full py-2 rounded-xl bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-all cursor-pointer"
            >
              {t("profilePage.readPolicy", {}, "Read Policy")}
            </button>
          </div>

          {/* Card 3: Shipping Policy */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#2F5D34]/30 shadow-sm flex flex-col justify-between h-40">
            <div>
              <Truck className="w-6 h-6 text-[#5B7C3A] mb-2" />
              <h4 className="font-bold text-sm text-[#222123]">{t("profilePage.shippingPolicy", {}, "Shipping Policy")}</h4>
              <p className="text-[11px] text-gray-600 font-paragraph mt-1">{t("profilePage.shippingPolicyDesc", {}, "Free shipping on orders above ₹499")}</p>
            </div>
            <button
              onClick={() => setActiveModal("shipping")}
              className="w-full py-2 rounded-xl bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-all cursor-pointer"
            >
              {t("profilePage.readPolicy", {}, "Read Policy")}
            </button>
          </div>

          {/* Card 4: Toll Free Phone */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#2F5D34]/30 shadow-sm flex flex-col justify-between h-40">
            <div>
              <Phone className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="font-bold text-sm text-[#222123]">{t("profilePage.callAssistance", {}, "Call Assistance")}</h4>
              <p className="text-[11px] text-gray-600 font-paragraph mt-1">{t("profilePage.supportTiming", {}, "Mon-Sat (9 AM - 7 PM IST)")}</p>
            </div>
            <button
              onClick={() => handleContactAction("phone")}
              className="w-full py-2 rounded-xl bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-all cursor-pointer"
            >
              {t("profilePage.callUs", {}, "Call Us")}
            </button>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#222123] mb-3">{t("profilePage.faqsTitle", {}, "Frequently Asked Questions")}</h3>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/50 transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left font-bold text-sm text-[#222123] flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-gray-600 font-paragraph leading-relaxed border-t border-gray-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Policy Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-white">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === "return" ? (
              <div>
                <h3 className="text-xl font-bold text-[#2F5D34] mb-3">KLN Ayurveda Return Policy</h3>
                <div className="space-y-3 text-xs text-gray-600 font-paragraph leading-relaxed">
                  <p>• We offer a 15-day return guarantee on unopened and sealed Ayurvedic formulations.</p>
                  <p>• If you receive a damaged or tampered bottle, notify us within 48 hours for immediate replacement.</p>
                  <p>• Doorstep pickup will be arranged by our logistics partners free of cost.</p>
                  <p>• Refunds are processed back to your original payment method within 3 to 5 business days.</p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-[#2F5D34] mb-3">KLN Ayurveda Shipping Policy</h3>
                <div className="space-y-3 text-xs text-gray-600 font-paragraph leading-relaxed">
                  <p>• Free shipping applies automatically to all prepaid orders over ₹499 across India.</p>
                  <p>• Orders placed before 1:00 PM IST are dispatched on the same business day.</p>
                  <p>• Standard express transit time is 2 to 4 days for Tier 1 cities and 4 to 6 days for other locations.</p>
                  <p>• Real-time tracking IDs are shared via SMS and WhatsApp upon courier handoff.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
