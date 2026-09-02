"use client";

import { useState } from "react";
import Link from "next/link";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { Truck, FileText, CheckCircle2, Mail, Phone, Clock, ArrowLeft, MapPin, AlertTriangle, Package, ShieldCheck } from "lucide-react";

export default function ShippingPolicyPage() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState("order-processing");

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
    { id: "order-processing", title: "1. Order Processing Time" },
    { id: "shipping-charges", title: "2. Shipping Charges (Free > ₹499)" },
    { id: "delivery-timelines", title: "3. Estimated Delivery Times" },
    { id: "delivery-areas", title: "4. Serviceable Delivery Areas" },
    { id: "address-requirements", title: "5. Address Requirements" },
    { id: "order-tracking", title: "6. Real-Time Order Tracking" },
    { id: "delayed-delivery", title: "7. Delayed Deliveries" },
    { id: "failed-attempts", title: "8. Failed Delivery Attempts" },
    { id: "damaged-package", title: "9. Damaged Package Protocol" },
    { id: "contact-information", title: "10. Contact Information" },
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
            <Truck className="w-4 h-4 text-[#2F5D34]" />
            Nationwide Logistics &amp; Delivery
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B351E] tracking-tight mb-3">
            Shipping &amp; Delivery Policy
          </h1>

          <p className="text-sm sm:text-base text-gray-600 font-paragraph max-w-2xl leading-relaxed">
            We deliver handcrafted Ayurvedic hair care products across 18,000+ PIN codes in India. Learn about our dispatch schedules, shipping fees, and tracking.
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

              {/* Quick Shipping Offer Card */}
              <div className="mt-6 pt-5 border-t border-gray-100 bg-[#E7F0E4]/50 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-[#1B351E] mb-1">FREE Express Shipping</p>
                <p className="text-[11px] text-gray-600 font-paragraph mb-3">Qualify for FREE shipping on orders above ₹499 across India.</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#224426] transition-all shadow-sm"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Shop Herbal Range</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Document Content Panel */}
          <main className="lg:col-span-8">
            <div className="bg-white/95 backdrop-blur-xl border border-[#2F5D34]/15 rounded-3xl p-6 sm:p-10 shadow-xl space-y-10">

              {/* Highlight Delivery Summary Card */}
              <div className="bg-[#E7F0E4]/80 border border-[#2F5D34]/25 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-sm">
                <div className="p-3 rounded-2xl bg-[#2F5D34] text-white flex-none">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#1B351E] mb-1">Fast &amp; Reliable Delivery Overview</h4>
                  <p className="text-xs sm:text-sm text-gray-700 font-paragraph leading-relaxed">
                    All orders are packed and dispatched within 1-2 business days. Enjoy FREE Express Delivery on orders above ₹499. Real-time courier tracking numbers are sent automatically upon dispatch.
                  </p>
                </div>
              </div>

              {/* Section 1: Order Processing Time */}
              <section id="order-processing" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>1. Order Processing Time</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Every order of KLN Ayurveda hair oil, mask, or tonic is carefully quality-checked prior to packing:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>Orders are processed and dispatched within <strong>1 to 2 business days</strong> (Monday through Saturday, excluding national holidays).</li>
                  <li>Orders placed on Sundays or public holidays will be processed on the next business day.</li>
                  <li>During festive sales or promotional launches, dispatch may require up to 24-48 additional hours.</li>
                </ul>
              </section>

              {/* Section 2: Shipping Charges */}
              <section id="shipping-charges" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>2. Shipping Charges</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  We believe in transparent pricing for our customers:
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2F5D34] block mb-1">Orders Above ₹499</span>
                    <p className="text-xl font-black text-[#1B351E]">FREE Express Shipping</p>
                    <p className="text-xs text-gray-600 font-paragraph mt-1">Zero delivery fee applied automatically at checkout.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Orders Below ₹499</span>
                    <p className="text-xl font-black text-[#1B351E]">₹50 Standard Delivery</p>
                    <p className="text-xs text-gray-600 font-paragraph mt-1">Flat nominal courier charge.</p>
                  </div>
                </div>
              </section>

              {/* Section 3: Estimated Delivery Times */}
              <section id="delivery-timelines" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>3. Estimated Delivery Timelines</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Delivery timelines depend on your geographic destination across India:
                </p>
                <div className="mt-4 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#E7F0E4] text-[#1B351E] font-bold">
                        <th className="p-3.5 border-b border-gray-200">Destination Region</th>
                        <th className="p-3.5 border-b border-gray-200">Estimated Delivery Window</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 font-paragraph">
                      <tr>
                        <td className="p-3.5 font-semibold text-[#1B351E]">Major Metro Cities (Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad)</td>
                        <td className="p-3.5 font-bold text-[#2F5D34]">3 - 4 Business Days</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold text-[#1B351E]">Tier 2 &amp; Tier 3 Cities / State Capitals</td>
                        <td className="p-3.5 font-bold text-[#2F5D34]">4 - 6 Business Days</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold text-[#1B351E]">Interior &amp; Special Hill Regions</td>
                        <td className="p-3.5 font-bold text-[#2F5D34]">6 - 8 Business Days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 4: Serviceable Delivery Areas */}
              <section id="delivery-areas" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>4. Serviceable Delivery Areas</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  We ship to over 18,000+ PIN codes across India in partnership with reputable courier networks (including Delhivery, BlueDart, and India Post). During checkout, PIN code validity is automatically checked.
                </p>
              </section>

              {/* Section 5: Delivery Address Requirements */}
              <section id="address-requirements" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>5. Delivery Address Requirements</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  To ensure prompt delivery without delays:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>Provide complete street address details, house/flat number, building name, and nearby landmarks.</li>
                  <li>Ensure the 6-digit PIN code matches your city and state.</li>
                  <li>Provide an active, working mobile phone number for courier delivery OTP or call confirmation.</li>
                </ul>
              </section>

              {/* Section 6: Real-Time Order Tracking */}
              <section id="order-tracking" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>6. Real-Time Order Tracking</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Once your parcel is handed over to our shipping partner:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>You will receive an automated email and SMS notification containing your Airway Bill (AWB) tracking number.</li>
                  <li>You can track delivery progress live at any time under your <Link href="/profile" className="text-[#2F5D34] font-bold hover:underline">Profile &gt; My Orders</Link> dashboard.</li>
                </ul>
              </section>

              {/* Section 7: Delayed Deliveries */}
              <section id="delayed-delivery" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>7. Delayed Deliveries</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  While we strive for on-time delivery, delays may occasionally arise due to adverse weather conditions, courier transport delays, or regional restrictions. Our customer support team actively tracks delayed shipments to expedite delivery.
                </p>
              </section>

              {/* Section 8: Failed Delivery Attempts */}
              <section id="failed-attempts" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>8. Failed Delivery Attempts</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Our courier partners will make up to <strong>3 delivery attempts</strong> to reach you. If delivery fails after 3 attempts due to an incorrect address or unreachability, the package will return to our fulfillment hub, and our team will contact you to arrange re-dispatch.
                </p>
              </section>

              {/* Section 9: Damaged Package Protocol */}
              <section id="damaged-package" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>9. Damaged Package Protocol</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Please inspect the outer shipping box upon arrival. If the parcel is visibly damaged or tampered with:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>Refuse to accept the package if the outer seal is completely broken.</li>
                  <li>If accepted, record a quick unboxing video or take photos of the box and product bottle.</li>
                  <li>Notify customer support at <code>ayurvedakln@gmail.com</code> within 48 hours for immediate replacement under our <Link href="/return-policy" className="text-[#2F5D34] font-bold hover:underline">Return &amp; Refund Policy</Link>.</li>
                </ul>
              </section>

              {/* Section 10: Contact Information */}
              <section id="contact-information" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>10. Contact Information</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  For shipping status inquiries or delivery assistance, reach out to our Logistics Desk:
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#2F5D34] mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1B351E]">Shipping Email Desk</h5>
                      <a href="mailto:ayurvedakln@gmail.com" className="text-sm font-bold text-[#2F5D34] hover:underline">ayurvedakln@gmail.com</a>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#2F5D34] mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1B351E]">Shipping Phone Support</h5>
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
