"use client";

import { useState } from "react";
import Link from "next/link";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Mail, Phone, Clock, HelpCircle, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
    { id: "information-collected", title: "2. Information We Collect" },
    { id: "how-we-use-information", title: "3. How We Use Information" },
    { id: "cookies-technology", title: "4. Cookies & Similar Technologies" },
    { id: "sharing-providers", title: "5. Sharing with Service Providers" },
    { id: "data-security", title: "6. Data Security Measures" },
    { id: "data-retention", title: "7. Data Retention Policy" },
    { id: "customer-rights", title: "8. Your Customer Privacy Rights" },
    { id: "children-privacy", title: "9. Children's Privacy" },
    { id: "policy-updates", title: "10. Policy Updates" },
    { id: "contact-information", title: "11. Contact Information" },
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
            <ShieldCheck className="w-4 h-4 text-[#2F5D34]" />
            Legal & Customer Protection
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B351E] tracking-tight mb-3">
            Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-gray-600 font-paragraph max-w-2xl leading-relaxed">
            Your privacy and data security are fundamental to our authentic Ayurvedic values. Learn how KLN Ayurveda collects, uses, and safeguards your information.
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

              {/* Quick Contact Card */}
              <div className="mt-6 pt-5 border-t border-gray-100 bg-[#E7F0E4]/50 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-[#1B351E] mb-1">Have Privacy Questions?</p>
                <p className="text-[11px] text-gray-600 font-paragraph mb-3">Our privacy team is available Mon-Sat.</p>
                <a
                  href="mailto:ayurvedakln@gmail.com"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#224426] transition-all shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Privacy Team</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Document Content Panel */}
          <main className="lg:col-span-8">
            <div className="bg-white/95 backdrop-blur-xl border border-[#2F5D34]/15 rounded-3xl p-6 sm:p-10 shadow-xl space-y-10">
              
              {/* Highlight Guarantee Box */}
              <div className="bg-[#E7F0E4]/80 border border-[#2F5D34]/25 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-sm">
                <div className="p-3 rounded-2xl bg-[#2F5D34] text-white flex-none">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#1B351E] mb-1">Payment Security Notice</h4>
                  <p className="text-xs sm:text-sm text-gray-700 font-paragraph leading-relaxed">
                    KLN Ayurveda does <strong>NOT</strong> store complete credit/debit card numbers, CVVs, UPI PINs, or banking passwords on our servers. All electronic transactions are processed through secure, PCI-DSS compliant payment gateways.
                  </p>
                </div>
              </div>

              {/* Section 1: Introduction */}
              <section id="introduction" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>1. Introduction</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Welcome to <strong>KLN Ayurveda</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to maintaining the trust and confidence of our customers and website visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website (<code>https://kln-ayurveda.com</code>), register an account, or purchase our handcrafted Ayurvedic hair care formulations (including All Purpose Hair Oil, Protective Hair Mask, and All Purpose Hair Tonic).
                </p>
                <p className="mt-3 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  By accessing or using the KLN Ayurveda customer website, you acknowledge that you have read and understood the terms of this Privacy Policy.
                </p>
              </section>

              {/* Section 2: Information We Collect */}
              <section id="information-collected" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>2. Information We Collect</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  We collect information that you voluntarily provide to us when you interact with our website, as well as technical information automatically transmitted by your browser.
                </p>
                
                <h3 className="mt-5 text-base sm:text-lg font-bold text-[#2F5D34]">A. Information Provided by Customers</h3>
                <ul className="mt-2 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li><strong>Personal Contact Details:</strong> First name, last name, email address, mobile phone number.</li>
                  <li><strong>Delivery & Shipping Details:</strong> Street address, flat/house number, landmark, city, state, PIN code, country.</li>
                  <li><strong>Customer Inquiry Submissions:</strong> Information submitted via our Contact Us form or customer support channels.</li>
                </ul>

                <h3 className="mt-5 text-base sm:text-lg font-bold text-[#2F5D34]">B. Account Information</h3>
                <p className="mt-2 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  When you register a customer account, we store your profile preferences, encrypted account credentials, saved delivery addresses, wishlist items, and optional profile avatar pictures.
                </p>

                <h3 className="mt-5 text-base sm:text-lg font-bold text-[#2F5D34]">C. Order & Transaction Information</h3>
                <p className="mt-2 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Details of products purchased, order numbers (e.g. <code>#KLN-1001</code>), total amount paid, delivery status updates, invoice records, and promotional coupon codes applied.
                </p>

                <h3 className="mt-5 text-base sm:text-lg font-bold text-[#2F5D34]">D. Payment Information</h3>
                <p className="mt-2 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  We accept Credit Cards, Debit Cards, UPI, Net Banking, and Cash on Delivery (COD). All online payments are handled directly by PCI-DSS compliant third-party payment aggregators. We only receive confirmation of payment success or failure, transaction reference IDs, and payment method categories (e.g., &quot;Visa&quot; or &quot;UPI&quot;).
                </p>
              </section>

              {/* Section 3: How We Use Information */}
              <section id="how-we-use-information" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>3. How We Use Information</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  We use your personal information solely for legitimate business purposes, including:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>Processing, fulfilling, and delivering your order of Ayurvedic hair care kits.</li>
                  <li>Sending automated order receipts, shipment tracking numbers, and delivery alerts.</li>
                  <li>Providing customer service and resolving inquiries regarding usage or delivery.</li>
                  <li>Managing your registered account preferences, saved addresses, and wishlist items.</li>
                  <li>Sending optional promotional offers, discounts, and wellness guidance (only if subscribed).</li>
                  <li>Detecting, preventing, and addressing technical glitches or fraudulent activities.</li>
                </ul>
              </section>

              {/* Section 4: Cookies & Similar Technologies */}
              <section id="cookies-technology" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>4. Cookies &amp; Similar Technologies</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  KLN Ayurveda uses essential cookies and local storage (<code>localStorage</code>) to enable core website functionalities:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li><strong>Shopping Cart Persistence:</strong> Storing items added to your cart so they remain available while browsing.</li>
                  <li><strong>Language Preference:</strong> Remembering your chosen language setting (English or Hindi).</li>
                  <li><strong>Authentication Session Tokens:</strong> Keeping you securely signed in to your account.</li>
                  <li><strong>Recent Searches:</strong> Storing recent search terms locally on your browser for convenient navigation.</li>
                </ul>
                <p className="mt-3 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  You can control or disable cookie settings in your browser at any time; however, disabling essential cookies may impact shopping cart features.
                </p>
              </section>

              {/* Section 5: Sharing with Service Providers */}
              <section id="sharing-providers" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>5. Sharing of Information with Service Providers</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  We do not sell, rent, or trade your personal data to third parties. We share your information strictly with trusted third-party service providers necessary to operate our website:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li><strong>Shipping &amp; Logistics Partners:</strong> Delivery couriers (such as Delhivery, BlueDart, India Post) receive your name, address, and mobile number exclusively to deliver packages.</li>
                  <li><strong>Payment Processing Gateways:</strong> PCI-DSS certified payment gateways receive transaction amounts and encrypted details.</li>
                  <li><strong>Notification &amp; Email Services:</strong> Automated transactional email providers to deliver invoices and tracking updates.</li>
                </ul>
              </section>

              {/* Section 6: Data Security */}
              <section id="data-security" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>6. Data Security Measures</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  We implement robust administrative, technical, and physical security measures to protect your information against unauthorized access, loss, or alteration. These measures include SSL/TLS encryption for data in transit, password hashing algorithms, restricted database access, and regular security reviews.
                </p>
              </section>

              {/* Section 7: Data Retention */}
              <section id="data-retention" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>7. Data Retention Policy</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  We retain personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by Indian law for tax, accounting, or legal compliance.
                </p>
              </section>

              {/* Section 8: Customer Privacy Rights */}
              <section id="customer-rights" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>8. Your Customer Privacy Rights</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  As a customer of KLN Ayurveda, you have the right to:
                </p>
                <ul className="mt-3 list-disc pl-6 space-y-2 text-sm sm:text-base font-paragraph text-gray-700">
                  <li>Access and review your account details by visiting your Profile settings (<code>/profile</code>).</li>
                  <li>Update or correct your personal details, phone number, and delivery addresses at any time.</li>
                  <li>Opt out of marketing newsletters by clicking the unsubscribe link or contacting support.</li>
                  <li>Request account closure and personal data deletion by contacting our privacy team.</li>
                </ul>
              </section>

              {/* Section 9: Children's Privacy */}
              <section id="children-privacy" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>9. Children&apos;s Privacy</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  Our website and products are intended for purchase by adults aged 18 and above. We do not knowingly collect or solicit personal information from individuals under the age of 18 without parental consent.
                </p>
              </section>

              {/* Section 10: Policy Updates */}
              <section id="policy-updates" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>10. Policy Updates</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with an updated &quot;Last Updated&quot; date. We encourage you to review this policy periodically.
                </p>
              </section>

              {/* Section 11: Contact Information */}
              <section id="contact-information" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-[#1B351E] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span>11. Contact Information</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base font-paragraph text-gray-700 leading-relaxed">
                  If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our Customer Care desk:
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#2F5D34] mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1B351E]">Email Support</h5>
                      <a href="mailto:ayurvedakln@gmail.com" className="text-sm font-bold text-[#2F5D34] hover:underline">ayurvedakln@gmail.com</a>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#E7F0E4]/60 border border-[#2F5D34]/20 flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#2F5D34] mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1B351E]">Phone Assistance</h5>
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
