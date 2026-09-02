"use client";

import { useState } from "react";
import Link from "next/link";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { RefreshCw, FileText, CheckCircle2, Mail, Phone, Clock, ArrowLeft, PackageCheck, AlertCircle, Truck, DollarSign } from "lucide-react";

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
    { id: "time-period", title: "2. Return Time Window (15 Days)" },
    { id: "damaged-products", title: "3. Damaged Products Arrival" },
    { id: "defective-products", title: "4. Defective Products" },
    { id: "wrong-product", title: "5. Wrong Product Delivered" },
    { id: "non-returnable", title: "6. Non-Returnable Items" },
    { id: "request-process", title: "7. Return Request Process" },
    { id: "required-info", title: "8. Required Order Proof & Media" },
    { id: "replacement-option", title: "9. Replacement Option" },
    { id: "refund-process", title: "10. Refund Process & Methods" },
    { id: "refund-timeline", title: "11. Refund Timelines (5-7 Days)" },
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
            Hassle-Free Doorstep Guarantee
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B351E] tracking-tight mb-3">
            Return &amp; Refund Policy
          </h1>

          <p className="text-sm sm:text-base text-gray-600 font-paragraph max-w-2xl leading-relaxed">
            Your satisfaction is our priority. We offer a 15-day doorstep return policy for damaged, defective, or incorrect items delivered.
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
                <p className="text-[11px] text-gray-600 font-paragraph mb-3">Initiate return from your account profile or contact support.</p>
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

              {/* Guarantee Highlight Box */}
              <div className="bg-[#E7F0E4]/80 border border-[#2F5D34]/25 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-sm">
                <div className="p-3 rounded-2xl bg-[#2F5D34] text-white flex-none">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#1B351E] mb-1">15-Day Doorstep Guarantee Summary</h4>
                  <p className="text-xs sm:text-sm text-gray-700 font-paragraph leading-relaxed">
                    If your item arrives damaged, defective, or incorrect, notify us within 15 days of delivery. We arrange free doorstep pickup and issue a full refund or express replacement within 5-7 business days of verification.
                  </p>
                </div>
              </div>

              {/* Section 1: Return Eligibility */}
              <section id="eligibility" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>1. Return Eligibility</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  A product is eligible for return or replacement if it fulfills any of the following conditions:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>The product arrived physically damaged or leaking during transit.</li>
                  <li>The product has a manufacturing packaging defect (e.g. broken pump nozzle, unsealed bottle cap).</li>
                  <li>An incorrect item variant or category was delivered (e.g. delivered Hair Tonic instead of Hair Oil).</li>
                  <li>The product received is expired or past its shelf-life date.</li>
                </ul>
              </section>

              {/* Section 2: Return Time Window */}
              <section id="time-period" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>2. Return Time Window (15 Days)</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Return requests must be initiated within <strong>15 days</strong> from the date of package delivery as confirmed by courier tracking records. Requests submitted after 15 days from delivery cannot be accepted.
                </p>
              </section>

              {/* Section 3: Damaged Products Arrival */}
              <section id="damaged-products" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>3. Damaged Products Arrival</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  If your order package arrives visibly damaged, squashed, or leaking:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>If possible, refuse delivery if the outer shipping box is severely crushed.</li>
                  <li>If delivered, take clear photographs/videos of the damaged outer box and product bottle.</li>
                  <li>Report the issue to customer care within 48 hours of delivery for expedited resolution.</li>
                </ul>
              </section>

              {/* Section 4: Defective Products */}
              <section id="defective-products" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>4. Defective Products</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  If a product packaging mechanism fails (e.g., defective spray nozzle or broken flip-cap), report the defect to receive a complimentary replacement component or new item.
                </p>
              </section>

              {/* Section 5: Wrong Product Delivered */}
              <section id="wrong-product" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>5. Wrong Product Delivered</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  If the item inside the parcel does not match your order receipt, we will arrange immediate pickup of the incorrect item and dispatch the correct product at zero additional cost.
                </p>
              </section>

              {/* Section 6: Non-Returnable Items */}
              <section id="non-returnable" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>6. Non-Returnable Items &amp; Exclusions</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Due to strict personal care hygiene and safety standards, the following items are non-returnable:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>Products with broken inner protective foil seals or opened inner caps (unless defective upon receipt).</li>
                  <li>Products used substantially or missing more than 15% of net contents.</li>
                  <li>Items returned without original brand boxes, batch labels, or free promotional gifts included in the order.</li>
                  <li>Return requests submitted after the 15-day return window.</li>
                </ul>
              </section>

              {/* Section 7: Return Request Process */}
              <section id="request-process" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>7. Return Request Process</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  To initiate a return or replacement:
                </p>
                <ol className="mt-3 list-decimal pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>Navigate to your <strong>Profile &gt; My Orders</strong> tab on our website.</li>
                  <li>Select the specific order (e.g. <code>#KLN-1002</code>) and click &quot;Request Support / Return.&quot;</li>
                  <li>Alternatively, email <code>ayurvedakln@gmail.com</code> or WhatsApp <code>7725820320</code> with your Order ID.</li>
                  <li>Upon approval, our courier partner will pick up the item from your doorstep.</li>
                </ol>
              </section>

              {/* Section 8: Required Order Information & Media */}
              <section id="required-info" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>8. Required Order Information &amp; Media</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  When submitting a return claim for damaged or wrong products, please provide:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>Your assigned Order ID (e.g., <code>#KLN-1001</code>) and registered phone number.</li>
                  <li>Clear photograph or short unboxing video showing the damaged product and outer shipping label.</li>
                  <li>Brief description of the issue.</li>
                </ul>
              </section>

              {/* Section 9: Replacement Option */}
              <section id="replacement-option" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>9. Replacement Option</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  If you choose a replacement instead of a monetary refund, a fresh item will be dispatched within 1-2 business days of claim verification with express tracking updates.
                </p>
              </section>

              {/* Section 10: Refund Process & Methods */}
              <section id="refund-process" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>10. Refund Process &amp; Payment Methods</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Once returned items are received and inspected:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li><strong>Prepaid Orders (Cards, UPI, NetBanking):</strong> Refunds are credited directly back to the original payment method used during checkout.</li>
                  <li><strong>Cash on Delivery (COD) Orders:</strong> Refunds are transferred via UPI or NEFT direct bank transfer upon providing account details to customer support.</li>
                </ul>
              </section>

              {/* Section 11: Refund Timelines */}
              <section id="refund-timeline" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>11. Refund Timelines (5-7 Business Days)</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Approved refunds are processed within <strong>5 to 7 business days</strong>. Depending on your bank or credit card issuer, it may take an additional 2-3 business days to reflect on your bank statement.
                </p>
              </section>

              {/* Section 12: Order Cancellation */}
              <section id="order-cancellation" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>12. Order Cancellation Policy</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Orders can be cancelled at zero cost prior to package dispatch. Prepaid orders cancelled before shipping receive an automatic 100% refund. Once dispatched with a tracking ID, order cancellation is not permitted in transit.
                </p>
              </section>

              {/* Section 13: Return Shipping Charges */}
              <section id="shipping-charges" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>13. Return Shipping Charges</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  KLN Ayurveda covers <strong>100% of doorstep pickup and return shipping charges</strong> for damaged, defective, or incorrectly delivered products. You will not be charged any return fee for legitimate claims.
                </p>
              </section>

              {/* Section 14: Contact Information */}
              <section id="contact-information" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>14. Contact Information</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  For return or refund assistance, contact our Customer Returns Desk:
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
