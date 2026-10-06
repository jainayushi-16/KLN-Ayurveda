"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { RefreshCw, FileText, CheckCircle2, Mail, Phone, Clock, ArrowLeft, PackageCheck, AlertCircle, Video, Percent } from "lucide-react";

export default function ReturnPolicyPage() {
  const { t, isHindi } = useLanguage();
  const [activeSection, setActiveSection] = useState("eligibility");

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const sectionsList = [
    { id: "eligibility", title: isHindi ? "1. वापसी की पात्रता" : "1. Return Eligibility" },
    { id: "time-period", title: isHindi ? "2. 5-दिन की वापसी समय-सीमा" : "2. 5-Day Return Window" },
    { id: "unboxing-video", title: isHindi ? "3. अनिवार्य अनबॉक्सिंग वीडियो" : "3. Mandatory Unboxing Video" },
    { id: "fifty-percent-refund", title: isHindi ? "4. 50% रिफंड की शर्तें" : "4. 50% Refund Terms" },
    { id: "damaged-products", title: isHindi ? "5. क्षतिग्रस्त व खराब उत्पाद" : "5. Damaged & Defective Items" },
    { id: "wrong-product", title: isHindi ? "6. गलत उत्पाद की डिलीवरी" : "6. Wrong Product Delivered" },
    { id: "non-returnable", title: isHindi ? "7. वापसी न योग्य उत्पाद" : "7. Non-Returnable Items" },
    { id: "request-process", title: isHindi ? "8. वापसी अनुरोध के चरण" : "8. Return Request Steps" },
    { id: "replacement-option", title: isHindi ? "9. रीप्लेसमेंट विकल्प" : "9. Replacement Option" },
    { id: "refund-process", title: isHindi ? "10. रिफंड प्रक्रिया व तरीके" : "10. Refund Process & Methods" },
    { id: "refund-timeline", title: isHindi ? "11. रिफंड समय-सीमा (5-7 दिन)" : "11. Refund Timeline (5-7 Days)" },
    { id: "order-cancellation", title: isHindi ? "12. ऑर्डर रद्दीकरण" : "12. Order Cancellation" },
    { id: "shipping-charges", title: isHindi ? "13. रिटर्न शिपिंग शुल्क" : "13. Return Shipping Charges" },
    { id: "contact-information", title: isHindi ? "14. संपर्क जानकारी" : "14. Contact Information" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            const btn = document.getElementById(`sidebar-btn-${entry.target.id}`);
            if (btn) {
              btn.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }
        });
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: 0 }
    );

    sectionsList.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionsList]);

  return (
    <main className="min-h-screen w-full relative bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#3D1A4F]">
      {/* Navigation Header */}
      <ShopNavBar />

      {/* Hero Header Section */}
      <section className="pt-8 pb-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#2F5D34]/20 text-[#2F5D34] text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#2F5D34] hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t("contactPage.returnHome", {}, "Return to Home")}</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E7F0E4] text-[#2F5D34] text-xs font-black uppercase tracking-widest mb-3 shadow-sm border border-[#2F5D34]/20">
            <RefreshCw className="w-4 h-4 text-[#2F5D34]" />
            {isHindi ? "वापसी और रिफंड की शर्तें (5-दिवसीय नीति)" : "Return & Refund Terms (5-Day Policy)"}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B351E] tracking-tight mb-3">
            {t("footer.returnPolicy", {}, "Return & Refund Policy")}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 font-paragraph max-w-2xl leading-relaxed">
            {isHindi
              ? "वापसी अनुरोध डिलीवरी के 5 दिनों के भीतर अनिवार्य पैकेज खोलने के वीडियो (Unboxing Video) के साथ शुरू किया जाना चाहिए। स्वीकृत रिफंड में कुल राशि का 50% प्राप्त होता है।"
              : "Return requests must be initiated within 3 days of delivery with a mandatory complete package opening video. Approved refunds receive 50% of the total payment amount."}
          </p>

          <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-gray-500 bg-white/90 px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <Clock className="w-4 h-4 text-[#2F5D34]" />
            <span>{isHindi ? "अंतिम अपडेट: 2 सितंबर 2026" : "Last Updated: September 2, 2026"}</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Table of Contents Sidebar */}
          <aside className="lg:col-span-4 sticky top-24 z-20">
            <div className="bg-white/90 backdrop-blur-xl border border-[#2F5D34]/15 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#1B351E] mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <FileText className="w-4 h-4 text-[#2F5D34]" />
                {isHindi ? "नीति अनुभाग" : "Policy Sections"}
              </h3>
              <nav className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                {sectionsList.map((item) => (
                  <button
                    key={item.id}
                    id={`sidebar-btn-${item.id}`}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      activeSection === item.id
                        ? "bg-[#2F5D34] text-white shadow-md font-bold"
                        : "text-gray-700 hover:bg-[#E7F0E4]/70 hover:text-[#2F5D34]"
                    }`}
                  >
                    <span>{item.title}</span>
                    {activeSection === item.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </nav>

              {/* Quick Action Box */}
              <div className="mt-6 pt-5 border-t border-gray-100 bg-[#E7F0E4]/50 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-[#1B351E] mb-1">{isHindi ? "वापसी का अनुरोध करना चाहते हैं?" : "Need to Request a Return?"}</p>
                <p className="text-[11px] text-gray-600 font-paragraph mb-3">{isHindi ? "अनबॉक्सिंग वीडियो के साथ 5 दिनों के भीतर अपनी वापसी शुरू करें।" : "Initiate your return within 3 days with an unboxing video."}</p>
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#224426] transition-all shadow-sm"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>{isHindi ? "मेरे ऑर्डर पर जाएं" : "Go to My Orders"}</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Document Content Panel */}
          <main className="lg:col-span-8">
            <div className="bg-white/95 backdrop-blur-xl border border-[#2F5D34]/15 rounded-3xl p-6 sm:p-10 shadow-xl space-y-10">

              {/* Key Rules Highlight Box */}
              <div className="bg-[#E7F0E4]/80 border border-[#2F5D34]/25 rounded-2xl p-5 sm:p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-[#1B351E] font-black text-base">
                  <AlertCircle className="w-5 h-5 text-[#2F5D34]" />
                  <span>{isHindi ? "महत्वपूर्ण वापसी व रिफंड आवश्यकताएं" : "Important Return & Refund Requirements"}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-[#2F5D34]/15 text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase">{isHindi ? "समय सीमा" : "Time Limit"}</span>
                    <span className="text-base font-black text-[#2F5D34]">{isHindi ? "3 दिनों के भीतर" : "Within 3 Days"}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#2F5D34]/15 text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase">{isHindi ? "अनिवार्य प्रमाण" : "Required Media"}</span>
                    <span className="text-base font-black text-[#2F5D34]">{isHindi ? "पूरा अनबॉक्सिंग वीडियो" : "Whole Unboxing Video"}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#2F5D34]/15 text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase">{isHindi ? "रिफंड राशि" : "Refund Amount"}</span>
                    <span className="text-base font-black text-[#2F5D34]">{isHindi ? "50% रिफंड" : "50% Refund"}</span>
                  </div>
                </div>
              </div>

              {/* Section 1: Return Eligibility */}
              <section id="eligibility" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "1. वापसी की पात्रता" : "1. Return Eligibility"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "एक उत्पाद वापसी या प्रतिस्थापन के लिए पात्र है यदि यह निम्नलिखित सभी शर्तों को पूरा करता है:"
                    : "A product is eligible for return or replacement if it meets all of the following conditions:"}
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>{isHindi ? "वापसी का अनुरोध डिलीवरी के 3 दिनों के भीतर सबमिट किया गया है।" : "The return request is submitted strictly within 3 days of order delivery."}</li>
                  <li>{isHindi ? "ग्राहक पार्सल सील टूटने और सामग्री निरीक्षण को दर्शाने वाला एक पूरा, अनकट पैकेज खोलने का वीडियो प्रदान करता है।" : "The customer provides a complete, unedited package opening video showing the parcel seal being broken and contents inspected."}</li>
                  <li>{isHindi ? "उत्पाद क्षतिग्रस्त, लीक, खराब या गलत प्राप्त हुआ है।" : "The product arrived physically damaged, leaking, defective, or incorrect."}</li>
                </ul>
              </section>

              {/* Section 2: 5-Day Return Window */}
              <section id="time-period" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "2. 5-दिन की वापसी समय-सीमा" : "2. 5-Day Return Window"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "वापसी अनुरोध कूरियर डिलीवरी पुष्टि द्वारा दर्ज डिलीवरी की सटीक तारीख से 5 दिनों के भीतर शुरू किया जाना चाहिए।"
                    : "Return requests must be initiated within 5 calendar days from the exact date of order delivery as recorded by courier delivery confirmation. Requests submitted after the 5-day delivery window cannot be processed or approved under any circumstances."}
                </p>
              </section>

              {/* Section 3: Mandatory Complete Unboxing Video */}
              <section id="unboxing-video" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#2F5D34]" />
                  <span>{isHindi ? "3. अनिवार्य अनबॉक्सिंग वीडियो" : "3. Mandatory Whole Package Opening Video"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "धोखाधड़ी के दावों को रोकने और पारगमन के दौरान उत्पाद की स्थिति सत्यापित करने के लिए, हर वापसी या रिफंड अनुरोध के लिए एक पूरा पैकेज खोलने का वीडियो (अनबॉक्सिंग वीडियो) सख्ती से आवश्यक है:"
                    : "To prevent fraudulent claims and verify product condition during transit, a complete package opening video (unboxing video) is strictly required for every return or refund request:"}
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>{isHindi ? "वीडियो में खोलने से पहले सीलबंद बाहरी शिपिंग लेबल और ऑर्डर आईडी स्पष्ट रूप से दिखाई देनी चाहिए।" : "The video must clearly capture the intact, sealed outer shipping parcel label and Order ID prior to opening."}</li>
                  <li>{isHindi ? "वीडियो में बिना किसी कट, ठहराव या वीडियो संपादन के शुरू से अंत तक पूरी प्रक्रिया रिकॉर्ड होनी चाहिए।" : "The video must record the entire unboxing process continuously from start to finish without any cuts, pauses, or video editing."}</li>
                  <li>{isHindi ? "वीडियो में बोतल की स्थिति और किसी भी क्षति या रिसाव को स्पष्ट रूप से दिखाया जाना चाहिए।" : "The video must clearly show the condition of the inner bottle, pump/cap, and any damage or leakages."}</li>
                </ul>
              </section>

              {/* Section 4: 50% Refund Terms */}
              <section id="fifty-percent-refund" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Percent className="w-5 h-5 text-[#2F5D34]" />
                  <span>{isHindi ? "4. 50% रिफंड की शर्तें (केवल वॉलेट रिफंड)" : "4. 50% Refund Policy (Wallet Refund Only)"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi ? "सभी सत्यापित एवं स्वीकृत वापसी अनुरोधों के लिए:" : "For all verified and approved return requests:"}
                </p>
                <div className="mt-4 p-5 rounded-2xl bg-[#E7F0E4]/70 border border-[#2F5D34]/20 space-y-2">
                  <p className="text-sm font-bold text-[#1B351E]">
                    {isHindi
                      ? "स्वीकृत वापसी के लिए जारी किया गया रिफंड उत्पाद के लिए भुगतान की गई कुल राशि का 50% होगा, जो केवल आपके KLN वॉलेट में क्रेडिट किया जाएगा।"
                      : "The monetary refund issued for an approved return will be 50% of the total payment amount paid for the product, credited exclusively to your KLN Wallet balance."}
                  </p>
                  <p className="text-xs text-gray-600 font-paragraph">
                    {isHindi
                      ? "शेष 50% कूरियर लॉजिस्टिक्स, रिटर्न शिपिंग और उत्पाद निपटान लागत को कवर करता है। रिफंड केवल KLN वॉलेट में क्रेडिट किया जाता है और इसे बैंक/नकद में स्थानांतरित नहीं किया जा सकता।"
                      : "The remaining 50% covers mandatory courier logistics, return shipping handling, and product safety disposal costs. All approved refunds are credited solely as KLN Wallet balance for future store purchases."}
                  </p>
                </div>
              </section>

              {/* Section 5: Damaged & Defective Items */}
              <section id="damaged-products" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "5. क्षतिग्रस्त व खराब उत्पाद" : "5. Damaged & Defective Products"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "यदि आपका पैकेज टूटा हुआ या लीक होता हुआ पहुंचता है, तो डिलीवरी के 3 दिनों के भीतर पूरा वीडियो रिकॉर्ड करें।"
                    : "If your package arrives crushed or leaking, record the full opening video showing the parcel label and leaking bottle within 3 days of delivery to qualify for return support."}
                </p>
              </section>

              {/* Section 6: Wrong Product Delivered */}
              <section id="wrong-product" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "6. गलत उत्पाद की डिलीवरी" : "6. Wrong Product Delivered"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "यदि गलत उत्पाद भेजा गया है, तो 3 दिनों के भीतर अपना अनबॉक्सिंग वीडियो जमा करें। हम सही उत्पाद भेजेंगे या KLN वॉलेट में 50% रिफंड क्रेडिट करेंगे।"
                    : "If an incorrect product variant was shipped, submit your complete unboxing video within 3 days. We will arrange doorstep pickup and dispatch the correct product or process a 50% refund credited to your KLN Wallet."}
                </p>
              </section>

              {/* Section 7: Non-Returnable Items */}
              <section id="non-returnable" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "7. वापसी न योग्य उत्पाद" : "7. Non-Returnable Items & Exclusions"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi ? "निम्नलिखित आइटम वापस योग्य नहीं हैं:" : "The following items are non-returnable:"}
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>{isHindi ? "डिलीवरी के 3 दिनों के बाद सबमिट किए गए अनुरोध।" : "Requests submitted after 3 days from order delivery."}</li>
                  <li>{isHindi ? "बिना अनकट अनबॉक्सिंग वीडियो वाले अनुरोध।" : "Requests missing a continuous, unedited package opening video."}</li>
                  <li>{isHindi ? "उपयोग किए गए या फॉइल सील टूटे हुए उत्पाद।" : "Products used substantially or missing inner foil seals (unless defective upon receipt)."}</li>
                </ul>
              </section>

              {/* Section 8: Return Request Steps */}
              <section id="request-process" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "8. वापसी अनुरोध के चरण" : "8. Return Request Steps"}</span>
                </h2>
                <ol className="mt-3 list-decimal pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>{isHindi ? "अविभाजित अनबॉक्सिंग वीडियो रिकॉर्ड करें।" : "Record a continuous unboxing video showing the unopened parcel, shipping label, and product opening."}</li>
                  <li>{isHindi ? "डिलीवरी के 3 दिनों के भीतर प्रोफ़ाइल > मेरे ऑर्डर पर जाएं।" : "Go to Profile > My Orders within 3 days of delivery."}</li>
                  <li>{isHindi ? "अपनी ऑर्डर आईडी चुनें और अनबॉक्सिंग वीडियो संलग्न करें।" : "Select your Order ID and attach the unboxing video and damage description."}</li>
                  <li>{isHindi ? "वैकल्पिक रूप से, अपना वीडियो ayurvedakln@gmail.com या व्हाट्सएप 7725820320 पर ईमेल करें।" : "Alternatively, email your video to ayurvedakln@gmail.com or WhatsApp 7725820320."}</li>
                </ol>
              </section>

              {/* Section 9: Replacement Option */}
              <section id="replacement-option" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "9. रीप्लेसमेंट विकल्प" : "9. Replacement Option"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "ग्राहक क्षतिग्रस्त या गलत वस्तुओं के लिए 50% वॉलेट रिफंड के बजाय मुफ्त उत्पाद प्रतिस्थापन चुन सकते हैं।"
                    : "Customers may opt for a free product replacement instead of a 50% wallet credit refund for verified damaged or wrong items."}
                </p>
              </section>

              {/* Section 10: Refund Process & Methods (Wallet Only) */}
              <section id="refund-process" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "10. रिफंड प्रक्रिया (केवल KLN वॉलेट)" : "10. Refund Process (KLN Wallet Only)"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi ? "स्वीकृत रिफंड केवल ग्राहक के पंजीकृत KLN आयुर्वेद वॉलेट में क्रेडिट के रूप में जमा किया जाता है:" : "The approved refund is credited exclusively to the customer's registered KLN Ayurveda Wallet balance:"}
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li><strong>{isHindi ? "प्रीपेड और COD ऑर्डर:" : "Prepaid & COD Orders:"}</strong> {isHindi ? "सभी स्वीकृत रिफंड (ऑर्डर मान का 50%) सीधे आपके KLN वॉलेट में क्रेडिट किए जाते हैं।" : "All approved refunds (50% of the product payment) are credited directly to your KLN Wallet balance upon verification."}</li>
                  <li><strong>{isHindi ? "केवल वॉलेट क्रेडिट:" : "Wallet Credit Policy:"}</strong> {isHindi ? "रिफंड किसी भी बैंक खाते, क्रेडिट कार्ड या नकद में स्थानांतरित नहीं किए जाते हैं। रिफंड राशि केवल आपके KLN वॉलेट में जोड़ी जाती है।" : "Refunds are not transferred back to bank accounts, credit cards, or cash. Refunds are strictly credited to your KLN Wallet balance only."}</li>
                  <li><strong>{isHindi ? "वॉलेट उपयोग:" : "Wallet Balance Redemption:"}</strong> {isHindi ? "आपके KLN वॉलेट बैलेंस का उपयोग भविष्य की किसी भी खरीदारी के लिए चेकआउट पर तुरंत किया जा सकता है।" : "Your KLN Wallet balance can be redeemed immediately towards any future purchases during checkout."}</li>
                </ul>
              </section>

              {/* Section 11: Refund Timeline */}
              <section id="refund-timeline" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "11. रिफंड समय-सीमा (24-48 घंटे)" : "11. Refund Timeline (24-48 Hours)"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "एक बार अनबॉक्सिंग वीडियो सत्यापित होने के बाद, 50% रिफंड 24 से 48 घंटों के भीतर आपके KLN वॉलेट में क्रेडिट कर दिया जाता है।"
                    : "Once the return and unboxing video are verified and approved, the 50% refund is credited to your KLN Wallet within 24 to 48 hours."}
                </p>
              </section>

              {/* Section 12: Order Cancellation */}
              <section id="order-cancellation" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "12. ऑर्डर रद्दीकरण" : "12. Order Cancellation"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "कूरियर डिस्पैच से पहले रद्द किए गए ऑर्डर पर 100% रिफंड आपके KLN वॉलेट में क्रेडिट किया जाता है।"
                    : "Orders cancelled prior to courier dispatch receive a 100% refund credited directly to your KLN Wallet. Once dispatched, return terms apply (within 3 days with unboxing video, 50% wallet refund)."}
                </p>
              </section>

              {/* Section 13: Return Shipping Charges */}
              <section id="shipping-charges" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "13. रिटर्न शिपिंग शुल्क" : "13. Return Shipping Charges"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "रिटर्न पिकअप की व्यवस्था हमारे कूरियर पार्टनर द्वारा की जाती है।"
                    : "Pickup of return items is arranged by our courier partner. Return logistics are covered under the 50% refund calculation."}
                </p>
              </section>

              {/* Section 14: Contact Information */}
              <section id="contact-information" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "14. संपर्क जानकारी" : "14. Contact Information"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi ? "वापसी अनुरोध के लिए अपना अनबॉक्सिंग वीडियो यहां भेजें:" : "For return requests, send your unboxing video to:"}
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#2F5D34] mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1B351E]">{isHindi ? "रिटर्न ईमेल" : "Returns Email"}</h5>
                      <a href="mailto:ayurvedakln@gmail.com" className="text-sm font-bold text-[#2F5D34] hover:underline">ayurvedakln@gmail.com</a>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#2F5D34] mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1B351E]">{isHindi ? "रिटर्न फोन लाइन" : "Returns Phone Line"}</h5>
                      <a href="tel:7725820320" className="text-sm font-bold text-[#2F5D34] hover:underline">7725820320</a>
                      <p className="text-[11px] text-gray-500 font-paragraph mt-0.5">{isHindi ? "सोम - शनि (सुबह 9:00 - शाम 7:00 बजे IST)" : "Mon - Sat (9:00 AM - 7:00 PM IST)"}</p>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </main>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
