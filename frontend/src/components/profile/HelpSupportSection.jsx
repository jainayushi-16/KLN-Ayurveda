"use client";

import { useState } from "react";
import { HelpCircle, Mail, Phone, MessageSquare, ChevronDown, RefreshCw, Truck, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/i18n/LanguageContext";

const HINDI_FAQ_MAP = {
  "How can I view my order status?": {
    q: "मैं अपने ऑर्डर की स्थिति कैसे देख सकता हूँ?",
    a: "आप अपने प्रोफ़ाइल मेनू में 'मेरे ऑर्डर' के तहत अपने ऑर्डर का विवरण देख सकते हैं या सीधे अपने ईमेल पर भेजे गए ऑर्डर अपडेट देख सकते हैं।",
  },
  "What is the expected delivery timeline?": {
    q: "अपेक्षित डिलीवरी समय क्या है?",
    a: "मानक मेट्रो ऑर्डर 2 से 4 कार्य दिवसों के भीतर पहुँचते हैं। क्षेत्रीय क्षेत्रों में तेज़ एयर एक्सप्रेस शिपिंग के माध्यम से 4 से 6 कार्य दिवस लगते हैं।",
  },
  "What is KLN Ayurveda's Return Policy?": {
    q: "KLN आयुर्वेद की वापसी नीति क्या है?",
    a: "हम डिलीवरी के 5 दिनों के भीतर बिना खोले, सीलबंद उत्पादों की वापसी स्वीकार करते हैं। वापसी सहायता के लिए कृपया हमारी सहायता टीम से संपर्क करें।",
  },
  "Are all KLN Ayurveda products 100% natural?": {
    q: "क्या KLN आयुर्वेद के सभी उत्पाद 100% प्राकृतिक हैं?",
    a: "हाँ! प्रत्येक उत्पाद 100% प्रमाणित आयुर्वेदिक, मिनरल-ऑयल मुक्त, क्रूरता-मुक्त और कोल्ड-प्रेस हर्बल अर्क से तैयार किया गया है।",
  },
  "How often should I apply KLN Hair Growth Oil?": {
    q: "KLN हेयर ऑयल का उपयोग कितनी बार करना चाहिए?",
    a: "उत्कृष्ट परिणामों के लिए सप्ताह में 2-3 बार सीधे स्कैल्प पर लगाएं। 10 मिनट हल्के हाथों से मालिश करें और हल्के प्राकृतिक शैम्पू से धोने से कम से कम 2 घंटे पहले या रात भर लगा रहने दें।",
  },
  "Does it contain mineral oil or artificial parabens?": {
    q: "क्या इसमें मिनरल ऑयल या कृत्रिम पैराबेन शामिल हैं?",
    a: "नहीं। KLN आयुर्वेद के सभी उत्पाद मिनरल ऑयल, पैराबेन, सिलिकॉन, सल्फेट और कृत्रिम सुगंध से 100% मुक्त हैं।",
  },
};

export default function HelpSupportSection({ faqs = [] }) {
  const { t, isHindi } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(null);

  const defaultFaqs = [
    {
      q: "How can I view my order status?",
      a: "You can view your order details under 'My Orders' in your profile menu or check order updates sent directly to your email.",
      q_hi: "मैं अपने ऑर्डर की स्थिति कैसे देख सकता हूँ?",
      a_hi: "आप अपने प्रोफ़ाइल मेनू में 'मेरे ऑर्डर' के तहत अपने ऑर्डर का विवरण देख सकते हैं या सीधे अपने ईमेल पर भेजे गए ऑर्डर अपडेट देख सकते हैं।",
    },
    {
      q: "What is the expected delivery timeline?",
      a: "Standard metro orders arrive within 2 to 4 business days. Regional areas take 4 to 6 business days via fast air express shipping.",
      q_hi: "अपेक्षित डिलीवरी समय क्या है?",
      a_hi: "मानक मेट्रो ऑर्डर 2 से 4 कार्य दिवसों के भीतर पहुँचते हैं। क्षेत्रीय क्षेत्रों में तेज़ एयर एक्सप्रेस शिपिंग के माध्यम से 4 से 6 कार्य दिवस लगते हैं।",
    },
    {
      q: "What is KLN Ayurveda's Return Policy?",
      a: "We accept returns for unopened, sealed products within 5 days of delivery. Please contact our support team for assistance with returns.",
      q_hi: "KLN आयुर्वेद की वापसी नीति क्या है?",
      a_hi: "हम डिलीवरी के 5 दिनों के भीतर बिना खोले, सीलबंद उत्पादों की वापसी स्वीकार करते हैं। वापसी सहायता के लिए कृपया हमारी सहायता टीम से संपर्क करें।",
    },
    {
      q: "Are all KLN Ayurveda products 100% natural?",
      a: "Yes! Every single product is 100% certified Ayurvedic, mineral-oil free, cruelty-free, and crafted with cold-pressed herbal extractions.",
      q_hi: "क्या KLN आयुर्वेद के सभी उत्पाद 100% प्राकृतिक हैं?",
      a_hi: "हाँ! प्रत्येक उत्पाद 100% प्रमाणित आयुर्वेदिक, मिनरल-ऑयल मुक्त, क्रूरता-मुक्त और कोल्ड-प्रेस हर्बल अर्क से तैयार किया गया है।",
    },
    {
      q: "How often should I apply KLN Hair Growth Oil?",
      a: "For optimal results, apply 2-3 times a week directly to the scalp. Gently massage for 10 minutes and leave on overnight or at least 2 hours before washing with a mild natural shampoo.",
      q_hi: "KLN हेयर ऑयल का उपयोग कितनी बार करना चाहिए?",
      a_hi: "उत्कृष्ट परिणामों के लिए सप्ताह में 2-3 बार सीधे स्कैल्प पर लगाएं। 10 मिनट हल्के हाथों से मालिश करें और हल्के प्राकृतिक शैम्पू से धोने से कम से कम 2 घंटे पहले या रात भर लगा रहने दें।",
    },
    {
      q: "Does it contain mineral oil or artificial parabens?",
      a: "No. All KLN Ayurveda products are 100% free from mineral oil, parabens, silicones, sulfates, and synthetic fragrances.",
      q_hi: "क्या इसमें मिनरल ऑयल या कृत्रिम पैराबेन शामिल हैं?",
      a_hi: "नहीं। KLN आयुर्वेद के सभी उत्पाद मिनरल ऑयल, पैराबेन, सिलिकॉन, सल्फेट और कृत्रिम सुगंध से 100% मुक्त हैं।",
    },
  ];

  const rawList = Array.isArray(faqs) && faqs.length > 0 ? faqs : defaultFaqs;
  const faqList = rawList.map((item) => {
    if (isHindi) {
      const matched = HINDI_FAQ_MAP[item.q] || HINDI_FAQ_MAP[item.question];
      return {
        q: item.q_hi || item.qHindi || (matched ? matched.q : item.q || item.question),
        a: item.a_hi || item.aHindi || (matched ? matched.a : item.a || item.answer),
      };
    }
    return {
      q: item.q || item.question,
      a: item.a || item.answer,
    };
  });

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const handleContactAction = (type) => {
    if (type === "chat") {
      toast.success("Opening WhatsApp Ayurvedic Live Support...", { icon: "💬" });
    } else if (type === "email") {
      toast.success("Opening Mail Client:klnayurveda@gmail.com", { icon: "✉️" });
    } else {
      toast.success("Calling Toll-Free Support: +91 7725820320", { icon: "📞" });
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
              <p className="text-[11px] text-gray-600 font-paragraph mt-1">{t("profilePage.returnPolicyDesc", {}, "5-day hassle-free doorstep returns")}</p>
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
          {faqList.map((faq, idx) => {
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
                <h3 className="text-xl font-bold text-[#2F5D34] mb-3">
                  {isHindi ? "KLN आयुर्वेद वापसी नीति" : "KLN Ayurveda Return Policy"}
                </h3>
                <div className="space-y-3 text-xs text-gray-600 font-paragraph leading-relaxed">
                  <p>{isHindi ? "• हम बिना खोले और सीलबंद आयुर्वेदिक उत्पादों पर 5-दिन की वापसी गारंटी प्रदान करते हैं।" : "• We offer a 5-day return guarantee on unopened and sealed Ayurvedic formulations."}</p>
                  <p>{isHindi ? "• यदि आपको क्षतिग्रस्त या छेड़छाड़ की गई बोतल प्राप्त होती है, तो त्वरित बदलाव के लिए 48 घंटों के भीतर हमें सूचित करें।" : "• If you receive a damaged or tampered bottle, notify us within 48 hours for immediate replacement."}</p>
                  <p>{isHindi ? "• हमारे लॉजिस्टिक्स पार्टनर द्वारा बिना किसी शुल्क के डोरस्टेप पिकअप की व्यवस्था की जाएगी।" : "• Doorstep pickup will be arranged by our logistics partners free of cost."}</p>
                  <p>{isHindi ? "• रिफंड 3 से 5 कार्य दिवसों के भीतर आपके मूल भुगतान विधि में वापस संसाधित कर दिया जाता है।" : "• Refunds are processed back to your original payment method within 3 to 5 business days."}</p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-[#2F5D34] mb-3">
                  {isHindi ? "KLN आयुर्वेद शिपिंग नीति" : "KLN Ayurveda Shipping Policy"}
                </h3>
                <div className="space-y-3 text-xs text-gray-600 font-paragraph leading-relaxed">
                  <p>{isHindi ? "• भारत भर में ₹499 से अधिक के सभी प्रीपेड ऑर्डरों पर मुफ्त शिपिंग स्वतः लागू होती है।" : "• Free shipping applies automatically to all prepaid orders over ₹499 across India."}</p>
                  <p>{isHindi ? "• दोपहर 1:00 बजे IST से पहले दिए गए ऑर्डर उसी कार्य दिवस पर भेज दिए जाते हैं।" : "• Orders placed before 1:00 PM IST are dispatched on the same business day."}</p>
                  <p>{isHindi ? "• टियर 1 शहरों के लिए मानक एक्सप्रेस ट्रांजिट समय 2 से 4 दिन और अन्य स्थानों के लिए 4 से 6 दिन है।" : "• Standard express transit time is 2 to 4 days for Tier 1 cities and 4 to 6 days for other locations."}</p>
                  <p>{isHindi ? "• कूरियर हैंडऑफ़ पर एसएमएस और व्हाट्सएप के माध्यम से रीयल-टाइम ट्रैकिंग आईडी साझा की जाती है।" : "• Real-time tracking IDs are shared via SMS and WhatsApp upon courier handoff."}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
