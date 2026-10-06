"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { Scale, FileText, CheckCircle2, Mail, Phone, Clock, ArrowLeft, AlertTriangle } from "lucide-react";

export default function TermsAndConditionsPage() {
  const { t, isHindi } = useLanguage();
  const [activeSection, setActiveSection] = useState("introduction");

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
    { id: "introduction", title: isHindi ? "1. परिचय" : "1. Introduction" },
    { id: "acceptance-terms", title: isHindi ? "2. शर्तों की स्वीकृति" : "2. Acceptance of Terms" },
    { id: "eligibility", title: isHindi ? "3. पात्रता" : "3. Eligibility" },
    { id: "customer-accounts", title: isHindi ? "4. ग्राहक खाता" : "4. Customer Accounts" },
    { id: "product-information", title: isHindi ? "5. उत्पाद जानकारी" : "5. Product Information" },
    { id: "ayurvedic-disclaimer", title: isHindi ? "6. आयुर्वेदिक अस्वीकरण" : "6. Ayurvedic Product Disclaimer" },
    { id: "availability-pricing", title: isHindi ? "7. उपलब्धता व मूल्य" : "7. Availability & Pricing" },
    { id: "orders-confirmation", title: isHindi ? "8. ऑर्डर व पुष्टि" : "8. Orders & Confirmations" },
    { id: "payments", title: isHindi ? "9. भुगतान नियम" : "9. Payments" },
    { id: "offers-discounts", title: isHindi ? "10. ऑफ़र व छूट" : "10. Offers & Discounts" },
    { id: "shipping-delivery", title: isHindi ? "11. शिपिंग व डिलीवरी" : "11. Shipping & Delivery" },
    { id: "order-cancellation", title: isHindi ? "12. ऑर्डर रद्दीकरण" : "12. Order Cancellation" },
    { id: "returns-refunds", title: isHindi ? "13. वापसी व रिफंड" : "13. Returns & Refunds" },
    { id: "customer-reviews", title: isHindi ? "14. ग्राहक समीक्षाएं" : "14. Customer Reviews" },
    { id: "intellectual-property", title: isHindi ? "15. बौद्धिक संपदा" : "15. Intellectual Property" },
    { id: "prohibited-activities", title: isHindi ? "16. निषिद्ध गतिविधियां" : "16. Prohibited Activities" },
    { id: "limitation-liability", title: isHindi ? "17. दायित्व की सीमा" : "17. Limitation of Liability" },
    { id: "changes-governing-law", title: isHindi ? "18. नियम परिवर्तन" : "18. Changes & Governing Law" },
    { id: "contact-information", title: isHindi ? "19. संपर्क जानकारी" : "19. Contact Information" },
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
    <main className="min-h-screen w-full relative bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#4B0082]">
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
            <Scale className="w-4 h-4 text-[#2F5D34]" />
            {isHindi ? "सेवा की शर्तें एवं कानूनी नियम" : "Terms of Service & Governance"}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B351E] tracking-tight mb-3">
            {t("footer.termsOfService", {}, "Terms & Conditions")}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 font-paragraph max-w-2xl leading-relaxed">
            {isHindi
              ? "केएलएन आयुर्वेद के उत्पादों को खरीदने या हमारी ग्राहक वेबसाइट का उपयोग करने से पहले कृपया इन नियमों को ध्यान से पढ़ें।"
              : "Please read these terms carefully before placing an order or using our customer website. These terms govern your rights and obligations when purchasing KLN Ayurveda formulations."}
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
                {isHindi ? "नियम अनुभाग" : "Terms Sections"}
              </h3>
              <nav className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                {sectionsList.map((item) => (
                  <button
                    key={item.id}
                    id={`sidebar-btn-${item.id}`}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
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

              {/* Quick Contact Card */}
              <div className="mt-6 pt-5 border-t border-gray-100 bg-[#E7F0E4]/50 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-[#1B351E] mb-1">{isHindi ? "नियमों के बारे में प्रश्न?" : "Questions About Terms?"}</p>
                <p className="text-[11px] text-gray-600 font-paragraph mb-3">{isHindi ? "हमारी ग्राहक कानूनी टीम सहायता के लिए उपलब्ध है।" : "Our customer legal team is here to assist you."}</p>
                <a
                  href="mailto:ayurvedakln@gmail.com"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#224426] transition-all shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{isHindi ? "ग्राहक सेवा से संपर्क करें" : "Contact Customer Care"}</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Document Content Panel */}
          <main className="lg:col-span-8">
            <div className="bg-white/95 backdrop-blur-xl border border-[#2F5D34]/15 rounded-3xl p-6 sm:p-10 shadow-xl space-y-10">

              {/* Disclaimer Highlight Box */}
              <div className="bg-[#E7F0E4]/80 border border-[#2F5D34]/25 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-sm">
                <div className="p-3 rounded-2xl bg-[#2F5D34] text-white flex-none">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#1B351E] mb-1">
                    {isHindi ? "आयुर्वेदिक कल्याण अस्वीकरण" : "Ayurvedic Wellness Disclaimer"}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 font-paragraph leading-relaxed">
                    {isHindi
                      ? "केएलएन आयुर्वेद हेयर केयर फॉर्मूलेशन प्राकृतिक वनस्पति घटकों से तैयार किए जाते हैं। व्यक्तिगत परिणाम भिन्न हो सकते हैं। हमारे उत्पाद प्राकृतिक बालों और स्कैल्प की देखभाल के लिए हैं और किसी चिकित्सा बीमारी का इलाज या रोकथाम नहीं करते हैं। उपयोग से पूर्व पैच टेस्ट की सलाह दी जाती है।"
                      : "KLN Ayurveda hair care formulations are prepared using natural botanical ingredients. Individual results may vary. Our formulations are intended for natural hair wellness and scalp care and are not intended to diagnose, treat, cure, or prevent medical scalp diseases. A 24-hour patch test is recommended prior to first use."}
                  </p>
                </div>
              </div>

              {/* Section 1: Introduction */}
              <section id="introduction" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "1. परिचय" : "1. Introduction"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "ये नियम एवं शर्तें ('नियम') आपके और केएलएन आयुर्वेद के बीच एक कानूनी रूप से बाध्यकारी समझौता हैं, जो हमारी वेबसाइट (https://kln-ayurveda.com) और हमारे उत्पादों की खरीद के आपके उपयोग को नियंत्रित करते हैं।"
                    : "These Terms & Conditions (\"Terms\") constitute a legally binding agreement between you (\"Customer,\" \"User,\" or \"you\") and KLN Ayurveda (\"we,\" \"us,\" or \"our\"), regarding your access to and use of our customer website (https://kln-ayurveda.com) and the purchase of our products."}
                </p>
              </section>

              {/* Section 2: Acceptance of Terms */}
              <section id="acceptance-terms" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "2. शर्तों की स्वीकृति" : "2. Acceptance of Terms"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "हमारी वेबसाइट पर पहुंचकर, खाता बनाकर या उत्पाद खरीदकर, आप इन नियमों, गोपनीयता नीति, और वापसी व शिपिंग नीतियों से बाध्य होने के लिए सहमत होते हैं।"
                    : "By accessing, browsing, registering an account, or purchasing products from our website, you agree to be bound by these Terms and our Privacy Policy, Return & Refund Policy, and Shipping & Delivery Policy. If you do not agree to these Terms, please do not use our website."}
                </p>
              </section>

              {/* Section 3: Eligibility */}
              <section id="eligibility" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "3. पात्रता" : "3. Eligibility"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "खरीददारी करने के लिए आपकी आयु कम से कम 18 वर्ष होनी चाहिए। 18 वर्ष से कम आयु के व्यक्ति केवल अपने माता-पिता या अभिभावक की देखरेख में ही इसका उपयोग कर सकते हैं।"
                    : "You must be at least 18 years of age to make purchases on our website. If you are under 18 years of age, you may use the website only under the supervision of a parent or legal guardian who agrees to be bound by these Terms."}
                </p>
              </section>

              {/* Section 4: Customer Accounts */}
              <section id="customer-accounts" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "4. ग्राहक खाता" : "4. Customer Accounts"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "जब आप खाता बनाते हैं, तो आप अपने लॉगिन क्रेडेंशियल की गोपनीयता बनाए रखने और अपने खाते के तहत होने वाली सभी गतिविधियों के लिए जिम्मेदार होते हैं।"
                    : "When you create an account with KLN Ayurveda, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete details during registration and to update your account information in the Profile section whenever changes occur."}
                </p>
              </section>

              {/* Section 5: Product Information */}
              <section id="product-information" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "5. उत्पाद जानकारी" : "5. Product Information"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "केएलएन आयुर्वेद हस्तनिर्मित हर्बल हेयर केयर उत्पाद प्रदान करता है जिसमें शामिल हैं:"
                    : "KLN Ayurveda offers handcrafted herbal hair care products including:"}
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li><strong>{isHindi ? "ऑल पर्पस हेयर ऑयल:" : "All Purpose Hair Oil:"}</strong> {isHindi ? "नारियल, जैतून, आर्गन और रोज़मेरी तेलों का पारंपरिक जड़ी-बूटियों (भृंगराज, आंवला, शिकाकाई, नीम) के साथ हर्बल मिश्रण।" : "Herbal oil blend featuring Coconut, Olive, Argan, and Rosemary oils with traditional herbs (Bhringraj, Amla, Shikakai, Neem)."}</li>
                  <li><strong>{isHindi ? "प्रोटेक्टिव हेयर मास्क:" : "Protective Hair Mask:"}</strong> {isHindi ? "बालों की बनावट और कोमलता को पुनर्स्थापित करने के लिए प्राकृतिक वनस्पति अर्क से निर्मित मास्क।" : "Natural conditioning hair mask formulated with botanical extracts to restore texture and manageability."}</li>
                  <li><strong>{isHindi ? "ऑल पर्पस हेयर टॉनिक:" : "All Purpose Hair Tonic:"}</strong> {isHindi ? "दैनिक स्कैल्प पोषण के लिए प्राकृतिक वनस्पति अर्क से समृद्ध जल-हल्का हर्बल टॉनिक।" : "Water-light herbal scalp tonic enriched with natural botanical extracts for daily scalp nourishment."}</li>
                </ul>
              </section>

              {/* Section 6: Ayurvedic Product Disclaimer */}
              <section id="ayurvedic-disclaimer" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "6. आयुर्वेदिक अस्वीकरण" : "6. Ayurvedic & Natural Product Disclaimer"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "हमारे उत्पाद 250 से अधिक पारंपरिक जड़ी-बूटियों और प्राकृतिक तेलों से तैयार किए जाते हैं:"
                    : "Our products are manufactured using over 250 traditionally prepared herbs and natural plant oils. Due to the handcrafted nature of natural herbs:"}
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>{isHindi ? "बैच के बीच रंग, प्राकृतिक सुगंध या बनावट में मामूली बदलाव हो सकते हैं, जो प्राकृतिक सामग्री का संकेत हैं।" : "Slight variations in color, natural herbal aroma, or texture between batches may occur and are normal indicators of natural ingredients."}</li>
                  <li>{isHindi ? "हमारे उत्पाद कॉस्मेटिक हेयर केयर उत्पाद हैं और इन्हें किसी चिकित्सीय बीमारी के इलाज के रूप में नहीं माना जाना चाहिए।" : "Our products are topical cosmetic hair care preparations and should not replace medical treatment for clinical alopecia, scalp infections, or dermatological conditions."}</li>
                  <li>{isHindi ? "मुख्य उपयोग से पहले 24 घंटे का पैच टेस्ट करने की सलाह दी जाती है।" : "We recommend conducting a 24-hour patch test on your inner elbow prior to full scalp application to check for individual sensitivity to botanical oils."}</li>
                </ul>
              </section>

              {/* Section 7: Availability & Pricing */}
              <section id="availability-pricing" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "7. उपलब्धता व मूल्य" : "7. Product Availability & Pricing"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "वेबसाइट पर सूचीबद्ध सभी कीमतें भारतीय रुपये (INR ₹) में हैं और इनमें जीएसटी कर शामिल हैं। कीमतें बिना पूर्व सूचना के बदली जा सकती हैं।"
                    : "All prices listed on the website are displayed in Indian Rupees (INR ₹) and are inclusive of GST taxes unless specified otherwise. Product prices and availability are subject to change without prior notice."}
                </p>
              </section>

              {/* Section 8: Orders & Confirmation */}
              <section id="orders-confirmation" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "8. ऑर्डर व पुष्टि" : "8. Orders & Order Confirmation"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "ऑर्डर सबमिट करने पर, एक स्वचालित पुष्टि ईमेल और इन-ऐप ऑर्डर रसीद जारी की जाएगी। हम स्टॉक अनुपलब्धता या गलत पते के मामलों में ऑर्डर रद्द करने का अधिकार सुरक्षित रखते हैं।"
                    : "Placing an order constitutes an offer to purchase. Upon order submission, an automated confirmation email and in-app order receipt with an assigned Order ID will be issued. We reserve the right to decline or cancel an order in cases of stock unavailability or incorrect address details."}
                </p>
              </section>

              {/* Section 9: Payments */}
              <section id="payments" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "9. भुगतान नियम" : "9. Payments"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "हम क्रेडिट कार्ड, डेबिट कार्ड, यूपीआई, नेट बैंकिंग और कैश ऑन डिलीवरी (COD) सहित कई सुरक्षित भुगतान विकल्पों का समर्थन करते हैं।"
                    : "We support multiple secure payment options including Credit Cards, Debit Cards, UPI, Net Banking, and Cash on Delivery (COD). All online payments are securely processed by PCI-DSS compliant payment gateway aggregators."}
                </p>
              </section>

              {/* Section 10: Offers & Discounts */}
              <section id="offers-discounts" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "10. ऑफ़र व छूट" : "10. Offers & Discounts"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "प्रमोशनल कूपन कोड (जैसे KLN10 या KLN20) निर्दिष्ट समय सीमा और न्यूनतम ऑर्डर मूल्यों के लिए मान्य हैं।"
                    : "Promotional coupon codes (such as KLN10 or KLN20) are valid for specified timeframes and minimum order values. Coupons cannot be combined with other conflicting promotional discounts unless stated."}
                </p>
              </section>

              {/* Section 11: Shipping & Delivery */}
              <section id="shipping-delivery" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "11. शिपिंग व डिलीवरी" : "11. Shipping & Delivery"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi ? "शिपिंग और डिलीवरी की शर्तें हमारी समर्पित " : "Shipping and delivery terms are detailed in our dedicated "}
                  <Link href="/shipping-policy" className="text-[#2F5D34] font-bold hover:underline">
                    {isHindi ? "शिपिंग और डिलीवरी नीति" : "Shipping & Delivery Policy"}
                  </Link>
                  {isHindi ? " में दी गई हैं। ₹499 से अधिक के ऑर्डर पर मुफ्त शिपिंग लागू होती है।" : ". Free shipping applies to orders above ₹499."}
                </p>
              </section>

              {/* Section 12: Order Cancellation */}
              <section id="order-cancellation" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "12. ऑर्डर रद्दीकरण" : "12. Order Cancellation"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "ग्राहक कूरियर डिस्पैच से पहले अपने खाता प्रोफ़ाइल से ऑर्डर रद्दीकरण का अनुरोध कर सकते हैं। कूरियर ट्रैकिंग आईडी के साथ डिस्पैच होने के बाद इसे रद्द नहीं किया जा सकता।"
                    : "Customers may request order cancellation prior to dispatch through their Account Profile (\"My Orders\" tab) or by contacting customer support. Once an order has been dispatched with a courier tracking ID, it cannot be cancelled in transit."}
                </p>
              </section>

              {/* Section 13: Returns & Refunds */}
              <section id="returns-refunds" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "13. वापसी व रिफंड" : "13. Returns & Refunds"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi ? "हमारी " : "Our "}
                  <Link href="/return-policy" className="text-[#2F5D34] font-bold hover:underline">
                    {isHindi ? "वापसी और रिफंड नीति" : "Return & Refund Policy"}
                  </Link>
                  {isHindi
                    ? " डिलीवरी की तारीख से 5-दिन की वापसी अवधि देती है। पैकेज खोलने का अनकट वीडियो आवश्यक है। स्वीकृत वापसी पर 50% रिफंड मिलता है।"
                    : " grants a 5-day return window from delivery date. Submitting a complete, unedited package opening video (unboxing video) is strictly required. Approved returns receive a 50% monetary refund of the product payment. Refunds are processed within 5-7 business days of verification."}
                </p>
              </section>

              {/* Section 14: Customer Reviews */}
              <section id="customer-reviews" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "14. ग्राहक समीक्षाएं" : "14. Customer Reviews"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "उत्पाद पृष्ठों पर सबमिट की गई ग्राहक समीक्षाएं ईमानदार अनुभवों को दर्शाने वाली होनी चाहिए। हम आपत्तिजनक भाषा वाली समीक्षाओं को हटाने का अधिकार सुरक्षित रखते हैं।"
                    : "Customer reviews submitted on product pages must reflect honest user experiences. We reserve the right to moderate or remove reviews containing abusive language, spam, or misleading claims."}
                </p>
              </section>

              {/* Section 15: Intellectual Property */}
              <section id="intellectual-property" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "15. बौद्धिक संपदा" : "15. Intellectual Property"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "सभी ट्रेडमार्क, लोगो, ब्रांड नाम, पैकेजिंग डिज़ाइन और कंटेंट केएलएन आयुर्वेद और संस्थापक नेहा लुणावत की विशेष बौद्धिक संपदा हैं।"
                    : "All trademarks, logos, brand names, product packaging designs, herb formulation names, website design, text, graphics, and video content are the exclusive intellectual property of KLN Ayurveda and Founder Neha Lunawat. Unauthorized reproduction or commercial use is strictly prohibited."}
                </p>
              </section>

              {/* Section 16: Prohibited Activities */}
              <section id="prohibited-activities" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "16. निषिद्ध गतिविधियां" : "16. Prohibited Activities"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "उपयोगकर्ताओं को धोखाधड़ी वाले लेनदेन, वेबसाइट सुरक्षा से समझौता करने या स्वचालित स्क्रैपर्स का उपयोग करने से प्रतिबंधित किया गया है।"
                    : "Users are prohibited from engaging in fraudulent transactions, attempting to compromise website security, using automated scrapers, or impersonating other individuals on our platform."}
                </p>
              </section>

              {/* Section 17: Limitation of Liability */}
              <section id="limitation-liability" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "17. दायित्व की सीमा" : "17. Limitation of Liability"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "लागू कानून द्वारा अनुमत अधिकतम सीमा तक, केएलएन आयुर्वेद अप्रत्यक्ष या आकस्मिक नुकसान के लिए उत्तरदायी नहीं होगा। हमारी कुल देनदारी उस विशिष्ट ऑर्डर के लिए भुगतान की गई राशि से अधिक नहीं होगी।"
                    : "To the maximum extent permitted by applicable law, KLN Ayurveda shall not be liable for any indirect, incidental, or consequential damages arising out of website usage or product application. Our total liability for any claim shall not exceed the amount paid for the specific order."}
                </p>
              </section>

              {/* Section 18: Changes & Governing Law */}
              <section id="changes-governing-law" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "18. नियम परिवर्तन" : "18. Changes to Terms & Governing Law"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "हम किसी भी समय इन नियमों को संशोधित करने का अधिकार सुरक्षित रखते हैं। ये नियम भारत के कानूनों के अनुसार शासित और व्याख्यायित होंगे।"
                    : "We reserve the right to revise these Terms at any time. These Terms shall be governed by and construed in accordance with the laws of India, subject to the exclusive jurisdiction of courts located in India."}
                </p>
              </section>

              {/* Section 19: Contact Information */}
              <section id="contact-information" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>{isHindi ? "19. संपर्क जानकारी" : "19. Contact Information"}</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  {isHindi
                    ? "इन नियमों और शर्तों के संबंध में किसी भी प्रश्न या स्पष्टीकरण के लिए, कृपया हमसे संपर्क करें:"
                    : "For any questions or clarifications regarding these Terms & Conditions, please contact us:"}
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#2F5D34] mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1B351E]">{isHindi ? "ईमेल लीगल डेस्क" : "Email Legal Desk"}</h5>
                      <a href="mailto:ayurvedakln@gmail.com" className="text-sm font-bold text-[#2F5D34] hover:underline">ayurvedakln@gmail.com</a>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#2F5D34] mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1B351E]">{isHindi ? "ग्राहक फोन लाइन" : "Customer Phone Line"}</h5>
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
