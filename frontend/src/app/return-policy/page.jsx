"use client";

import { useState } from "react";
import Link from "next/link";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { RefreshCw, FileText, CheckCircle2, Mail, Phone, Clock, ArrowLeft, PackageCheck, AlertCircle, Video, Percent } from "lucide-react";

export default function ReturnPolicyPage() {
  const { t } = useLanguage();
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
    { id: "eligibility", title: "1. Return Eligibility" },
    { id: "time-period", title: "2. 5-Day Return Window" },
    { id: "unboxing-video", title: "3. Mandatory Unboxing Video" },
    { id: "fifty-percent-refund", title: "4. 50% Refund Terms" },
    { id: "damaged-products", title: "5. Damaged & Defective Items" },
    { id: "wrong-product", title: "6. Wrong Product Delivered" },
    { id: "non-returnable", title: "7. Non-Returnable Items" },
    { id: "request-process", title: "8. Return Request Steps" },
    { id: "replacement-option", title: "9. Replacement Option" },
    { id: "refund-process", title: "10. Refund Process & Methods" },
    { id: "refund-timeline", title: "11. Refund Timeline (5-7 Days)" },
    { id: "order-cancellation", title: "12. Order Cancellation" },
    { id: "shipping-charges", title: "13. Return Shipping Charges" },
    { id: "contact-information", title: "14. Contact Information" },
  ];

  return (
    <main className="min-h-screen w-full relative bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
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
            Return &amp; Refund Terms (5-Day Policy)
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B351E] tracking-tight mb-3">
            Return &amp; Refund Policy
          </h1>

          <p className="text-sm sm:text-base text-gray-600 font-paragraph max-w-2xl leading-relaxed">
            Return requests must be initiated within 5 days of delivery with a mandatory complete package opening video. Approved refunds receive 50% of the total payment amount.
          </p>

          <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-gray-500 bg-white/90 px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <Clock className="w-4 h-4 text-[#2F5D34]" />
            <span>Last Updated: September 2, 2026</span>
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
                Policy Sections
              </h3>
              <nav className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                {sectionsList.map((item) => (
                  <button
                    key={item.id}
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
                <p className="text-xs font-bold text-[#1B351E] mb-1">Need to Request a Return?</p>
                <p className="text-[11px] text-gray-600 font-paragraph mb-3">Initiate your return within 5 days with an unboxing video.</p>
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#224426] transition-all shadow-sm"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Go to My Orders</span>
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
                  <span>Important Return &amp; Refund Requirements</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-[#2F5D34]/15 text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase">Time Limit</span>
                    <span className="text-base font-black text-[#2F5D34]">Within 5 Days</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#2F5D34]/15 text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase">Required Media</span>
                    <span className="text-base font-black text-[#2F5D34]">Whole Unboxing Video</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#2F5D34]/15 text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase">Refund Amount</span>
                    <span className="text-base font-black text-[#2F5D34]">50% Refund</span>
                  </div>
                </div>
              </div>

              {/* Section 1: Return Eligibility */}
              <section id="eligibility" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>1. Return Eligibility</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  A product is eligible for return or replacement if it meets all of the following conditions:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>The return request is submitted strictly <strong>within 5 days</strong> of order delivery.</li>
                  <li>The customer provides a <strong>complete, unedited package opening video</strong> showing the parcel seal being broken and contents inspected.</li>
                  <li>The product arrived physically damaged, leaking, defective, or incorrect.</li>
                </ul>
              </section>

              {/* Section 2: 5-Day Return Window */}
              <section id="time-period" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>2. 5-Day Return Window</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Return requests must be initiated <strong>within 5 calendar days</strong> from the exact date of order delivery as recorded by courier delivery confirmation. Requests submitted after the 5-day delivery window cannot be processed or approved under any circumstances.
                </p>
              </section>

              {/* Section 3: Mandatory Complete Unboxing Video */}
              <section id="unboxing-video" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#2F5D34]" />
                  <span>3. Mandatory Whole Package Opening Video</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  To prevent fraudulent claims and verify product condition during transit, a <strong>complete package opening video (unboxing video) is strictly required</strong> for every return or refund request:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>The video must clearly capture the intact, sealed outer shipping parcel label and Order ID prior to opening.</li>
                  <li>The video must record the <strong>entire unboxing process continuously</strong> from start to finish without any cuts, pauses, or video editing.</li>
                  <li>The video must clearly show the condition of the inner bottle, pump/cap, and any damage or leakages.</li>
                  <li>Return requests submitted without a complete opening video will be declined.</li>
                </ul>
              </section>

              {/* Section 4: 50% Refund Terms */}
              <section id="fifty-percent-refund" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Percent className="w-5 h-5 text-[#2F5D34]" />
                  <span>4. 50% Refund Policy</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  For all verified and approved return requests:
                </p>
                <div className="mt-4 p-5 rounded-2xl bg-[#E7F0E4]/70 border border-[#2F5D34]/20 space-y-2">
                  <p className="text-sm font-bold text-[#1B351E]">
                    The monetary refund issued for an approved return will be <strong>50% of the total payment amount</strong> paid for the product.
                  </p>
                  <p className="text-xs text-gray-600 font-paragraph">
                    The remaining 50% covers mandatory courier logistics, return shipping handling, and product safety disposal costs associated with personal care formulations.
                  </p>
                </div>
              </section>

              {/* Section 5: Damaged & Defective Items */}
              <section id="damaged-products" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>5. Damaged &amp; Defective Products</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  If your package arrives crushed or leaking, record the full opening video showing the parcel label and leaking bottle within 5 days of delivery to qualify for return support.
                </p>
              </section>

              {/* Section 6: Wrong Product Delivered */}
              <section id="wrong-product" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>6. Wrong Product Delivered</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  If an incorrect product variant was shipped, submit your complete unboxing video within 5 days. We will arrange doorstep pickup and dispatch the correct product or process a 50% refund.
                </p>
              </section>

              {/* Section 7: Non-Returnable Items */}
              <section id="non-returnable" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>7. Non-Returnable Items &amp; Exclusions</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  The following items are non-returnable:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>Requests submitted after 5 days from order delivery.</li>
                  <li>Requests missing a continuous, unedited package opening video.</li>
                  <li>Products used substantially or missing inner foil seals (unless defective upon receipt).</li>
                </ul>
              </section>

              {/* Section 8: Return Request Steps */}
              <section id="request-process" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>8. Return Request Steps</span>
                </h2>
                <ol className="mt-3 list-decimal pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>Record a continuous unboxing video showing the unopened parcel, shipping label, and product opening.</li>
                  <li>Go to <strong>Profile &gt; My Orders</strong> within 5 days of delivery.</li>
                  <li>Select your Order ID and attach the unboxing video and damage description.</li>
                  <li>Alternatively, email your video to <code>ayurvedakln@gmail.com</code> or WhatsApp <code>7725820320</code>.</li>
                </ol>
              </section>

              {/* Section 9: Replacement Option */}
              <section id="replacement-option" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>9. Replacement Option</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Customers may opt for a free product replacement instead of a 50% monetary refund for verified damaged or wrong items.
                </p>
              </section>

              {/* Section 10: Refund Process & Methods */}
              <section id="refund-process" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>10. Refund Process &amp; Payment Methods</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  The approved 50% refund will be issued to:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li><strong>Prepaid Orders:</strong> Credited back to the original card, UPI, or net banking account.</li>
                  <li><strong>COD Orders:</strong> Transferred via UPI or NEFT bank transfer upon receiving bank details.</li>
                </ul>
              </section>

              {/* Section 11: Refund Timeline */}
              <section id="refund-timeline" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>11. Refund Timeline (5-7 Days)</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Once approved, the 50% refund is processed within <strong>5 to 7 business days</strong>.
                </p>
              </section>

              {/* Section 12: Order Cancellation */}
              <section id="order-cancellation" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>12. Order Cancellation</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Orders cancelled prior to courier dispatch receive a 100% refund. Once dispatched, return terms apply (within 5 days with unboxing video, 50% refund).
                </p>
              </section>

              {/* Section 13: Return Shipping Charges */}
              <section id="shipping-charges" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>13. Return Shipping Charges</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Pickup of return items is arranged by our courier partner. Return logistics are covered under the 50% refund calculation.
                </p>
              </section>

              {/* Section 14: Contact Information */}
              <section id="contact-information" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>14. Contact Information</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  For return requests, send your unboxing video to:
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#2F5D34] mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1B351E]">Returns Email</h5>
                      <a href="mailto:ayurvedakln@gmail.com" className="text-sm font-bold text-[#2F5D34] hover:underline">ayurvedakln@gmail.com</a>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#2F5D34] mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1B351E]">Returns Phone Line</h5>
                      <a href="tel:7725820320" className="text-sm font-bold text-[#2F5D34] hover:underline">7725820320</a>
                      <p className="text-[11px] text-gray-500 font-paragraph mt-0.5">Mon - Sat (9:00 AM - 7:00 PM IST)</p>
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
