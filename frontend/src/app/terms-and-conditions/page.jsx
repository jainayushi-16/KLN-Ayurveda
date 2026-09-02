"use client";

import { useState } from "react";
import Link from "next/link";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { Scale, FileText, CheckCircle2, Mail, Phone, Clock, ArrowLeft, AlertTriangle } from "lucide-react";

export default function TermsAndConditionsPage() {
  const { t } = useLanguage();
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
    { id: "introduction", title: "1. Introduction" },
    { id: "acceptance-terms", title: "2. Acceptance of Terms" },
    { id: "eligibility", title: "3. Eligibility" },
    { id: "customer-accounts", title: "4. Customer Accounts" },
    { id: "product-information", title: "5. Product Information" },
    { id: "ayurvedic-disclaimer", title: "6. Ayurvedic Product Disclaimer" },
    { id: "availability-pricing", title: "7. Availability & Pricing" },
    { id: "orders-confirmation", title: "8. Orders & Confirmations" },
    { id: "payments", title: "9. Payments" },
    { id: "offers-discounts", title: "10. Offers & Discounts" },
    { id: "shipping-delivery", title: "11. Shipping & Delivery" },
    { id: "order-cancellation", title: "12. Order Cancellation" },
    { id: "returns-refunds", title: "13. Returns & Refunds" },
    { id: "customer-reviews", title: "14. Customer Reviews" },
    { id: "intellectual-property", title: "15. Intellectual Property" },
    { id: "prohibited-activities", title: "16. Prohibited Activities" },
    { id: "limitation-liability", title: "17. Limitation of Liability" },
    { id: "changes-governing-law", title: "18. Changes & Governing Law" },
    { id: "contact-information", title: "19. Contact Information" },
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
            <Scale className="w-4 h-4 text-[#2F5D34]" />
            Terms of Service &amp; Governance
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B351E] tracking-tight mb-3">
            Terms &amp; Conditions
          </h1>

          <p className="text-sm sm:text-base text-gray-600 font-paragraph max-w-2xl leading-relaxed">
            Please read these terms carefully before placing an order or using our customer website. These terms govern your rights and obligations when purchasing KLN Ayurveda formulations.
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
                Terms Sections
              </h3>
              <nav className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                {sectionsList.map((item) => (
                  <button
                    key={item.id}
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
                <p className="text-xs font-bold text-[#1B351E] mb-1">Questions About Terms?</p>
                <p className="text-[11px] text-gray-600 font-paragraph mb-3">Our customer legal team is here to assist you.</p>
                <a
                  href="mailto:ayurvedakln@gmail.com"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#224426] transition-all shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Customer Care</span>
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
                  <h4 className="text-base font-extrabold text-[#1B351E] mb-1">Ayurvedic Wellness Disclaimer</h4>
                  <p className="text-xs sm:text-sm text-gray-700 font-paragraph leading-relaxed">
                    KLN Ayurveda hair care formulations are prepared using natural botanical ingredients. Individual results may vary. Our formulations are intended for natural hair wellness and scalp care and are not intended to diagnose, treat, cure, or prevent medical scalp diseases. A 24-hour patch test is recommended prior to first use.
                  </p>
                </div>
              </div>

              {/* Section 1: Introduction */}
              <section id="introduction" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>1. Introduction</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  These Terms &amp; Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;Customer,&quot; &quot;User,&quot; or &quot;you&quot;) and <strong>KLN Ayurveda</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), regarding your access to and use of our customer website (<code>https://kln-ayurveda.com</code>) and the purchase of our products.
                </p>
              </section>

              {/* Section 2: Acceptance of Terms */}
              <section id="acceptance-terms" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>2. Acceptance of Terms</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  By accessing, browsing, registering an account, or purchasing products from our website, you agree to be bound by these Terms and our Privacy Policy, Return &amp; Refund Policy, and Shipping &amp; Delivery Policy. If you do not agree to these Terms, please do not use our website.
                </p>
              </section>

              {/* Section 3: Eligibility */}
              <section id="eligibility" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>3. Eligibility</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  You must be at least 18 years of age to make purchases on our website. If you are under 18 years of age, you may use the website only under the supervision of a parent or legal guardian who agrees to be bound by these Terms.
                </p>
              </section>

              {/* Section 4: Customer Accounts */}
              <section id="customer-accounts" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>4. Customer Accounts</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  When you create an account with KLN Ayurveda, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete details during registration and to update your account information in the Profile section whenever changes occur.
                </p>
              </section>

              {/* Section 5: Product Information */}
              <section id="product-information" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>5. Product Information</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  KLN Ayurveda offers handcrafted herbal hair care products including:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li><strong>All Purpose Hair Oil:</strong> Herbal oil blend featuring Coconut, Olive, Argan, and Rosemary oils with traditional herbs (Bhringraj, Amla, Shikakai, Neem).</li>
                  <li><strong>Protective Hair Mask:</strong> Natural conditioning hair mask formulated with botanical extracts to restore texture and manageability.</li>
                  <li><strong>All Purpose Hair Tonic:</strong> Water-light herbal scalp tonic enriched with natural botanical extracts for daily scalp nourishment.</li>
                </ul>
              </section>

              {/* Section 6: Ayurvedic Product Disclaimer */}
              <section id="ayurvedic-disclaimer" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>6. Ayurvedic &amp; Natural Product Disclaimer</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Our products are manufactured using over 250 traditionally prepared herbs and natural plant oils. Due to the handcrafted nature of natural herbs:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>Slight variations in color, natural herbal aroma, or texture between batches may occur and are normal indicators of natural ingredients.</li>
                  <li>Our products are topical cosmetic hair care preparations and should not replace medical treatment for clinical alopecia, scalp infections, or dermatological conditions.</li>
                  <li>We recommend conducting a 24-hour patch test on your inner elbow prior to full scalp application to check for individual sensitivity to botanical oils.</li>
                </ul>
              </section>

              {/* Section 7: Availability & Pricing */}
              <section id="availability-pricing" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>7. Product Availability &amp; Pricing</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  All prices listed on the website are displayed in Indian Rupees (INR ₹) and are inclusive of GST taxes unless specified otherwise. Product prices and availability are subject to change without prior notice.
                </p>
              </section>

              {/* Section 8: Orders & Confirmation */}
              <section id="orders-confirmation" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>8. Orders &amp; Order Confirmation</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Placing an order constitutes an offer to purchase. Upon order submission, an automated confirmation email and in-app order receipt with an assigned Order ID will be issued. We reserve the right to decline or cancel an order in cases of stock unavailability or incorrect address details.
                </p>
              </section>

              {/* Section 9: Payments */}
              <section id="payments" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>9. Payments</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  We support multiple secure payment options including Credit Cards, Debit Cards, UPI, Net Banking, and Cash on Delivery (COD). All online payments are securely processed by PCI-DSS compliant payment gateway aggregators.
                </p>
              </section>

              {/* Section 10: Offers & Discounts */}
              <section id="offers-discounts" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>10. Offers &amp; Discounts</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Promotional coupon codes (such as <code>KLN10</code> or <code>KLN20</code>) are valid for specified timeframes and minimum order values. Coupons cannot be combined with other conflicting promotional discounts unless stated.
                </p>
              </section>

              {/* Section 11: Shipping & Delivery */}
              <section id="shipping-delivery" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>11. Shipping &amp; Delivery</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Shipping and delivery terms are detailed in our dedicated <Link href="/shipping-policy" className="text-[#2F5D34] font-bold hover:underline">Shipping &amp; Delivery Policy</Link>. Free shipping applies to orders above ₹499.
                </p>
              </section>

              {/* Section 12: Order Cancellation */}
              <section id="order-cancellation" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>12. Order Cancellation</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Customers may request order cancellation prior to dispatch through their Account Profile (&quot;My Orders&quot; tab) or by contacting customer support. Once an order has been dispatched with a courier tracking ID, it cannot be cancelled in transit.
                </p>
              </section>

              {/* Section 13: Returns & Refunds */}
              <section id="returns-refunds" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>13. Returns &amp; Refunds</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Our <Link href="/return-policy" className="text-[#2F5D34] font-bold hover:underline">Return &amp; Refund Policy</Link> grants a 5-day return window from delivery date. Submitting a complete, unedited package opening video (unboxing video) is strictly required. Approved returns receive a 50% monetary refund of the product payment. Refunds are processed within 5-7 business days of verification.
                </p>
              </section>

              {/* Section 14: Customer Reviews */}
              <section id="customer-reviews" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>14. Customer Reviews</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Customer reviews submitted on product pages must reflect honest user experiences. We reserve the right to moderate or remove reviews containing abusive language, spam, or misleading claims.
                </p>
              </section>

              {/* Section 15: Intellectual Property */}
              <section id="intellectual-property" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>15. Intellectual Property</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  All trademarks, logos, brand names, product packaging designs, herb formulation names, website design, text, graphics, and video content are the exclusive intellectual property of KLN Ayurveda and Founder Neha Lunawat. Unauthorized reproduction or commercial use is strictly prohibited.
                </p>
              </section>

              {/* Section 16: Prohibited Activities */}
              <section id="prohibited-activities" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>16. Prohibited Activities</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Users are prohibited from engaging in fraudulent transactions, attempting to compromise website security, using automated scrapers, or impersonating other individuals on our platform.
                </p>
              </section>

              {/* Section 17: Limitation of Liability */}
              <section id="limitation-liability" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>17. Limitation of Liability</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  To the maximum extent permitted by applicable law, KLN Ayurveda shall not be liable for any indirect, incidental, or consequential damages arising out of website usage or product application. Our total liability for any claim shall not exceed the amount paid for the specific order.
                </p>
              </section>

              {/* Section 18: Changes & Governing Law */}
              <section id="changes-governing-law" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>18. Changes to Terms &amp; Governing Law</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  We reserve the right to revise these Terms at any time. These Terms shall be governed by and construed in accordance with the laws of India, subject to the exclusive jurisdiction of courts located in India.
                </p>
              </section>

              {/* Section 19: Contact Information */}
              <section id="contact-information" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>19. Contact Information</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  For any questions or clarifications regarding these Terms &amp; Conditions, please contact us:
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#2F5D34] mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1B351E]">Email Legal Desk</h5>
                      <a href="mailto:ayurvedakln@gmail.com" className="text-sm font-bold text-[#2F5D34] hover:underline">ayurvedakln@gmail.com</a>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#2F5D34] mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1B351E]">Customer Phone Line</h5>
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
