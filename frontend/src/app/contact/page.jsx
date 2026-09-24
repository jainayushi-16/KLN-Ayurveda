"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import { contactApi } from "@/services/contact.api";
import { useLanguage } from "@/i18n/LanguageContext";
import toast from "react-hot-toast";
import { MapPin, Mail, Phone, MessageSquare, Sparkles, Send, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await contactApi.submitContact({
        name,
        email,
        phone,
        subject: subject || "General Inquiry",
        message,
      });

      setSubmitted(true);
      toast.success(res?.message || t("contactPage.successTitle", {}, "Thank you! Your message has been sent successfully."));
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(err?.message || t("messages.error", {}, "Failed to submit contact form. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full relative bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123] overflow-x-hidden">
      {/* Navigation Header */}
      <ShopNavBar />

      {/* Main Container with Top Clearance for Sticky Header */}
      <div className="pt-8 sm:pt-12 pb-20 px-4 sm:px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          
          {/* Top Navigation Bar & Category Pill */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2F5D34]/15 pb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 border border-[#2F5D34]/20 text-[#2F5D34] text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#2F5D34] hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("contactPage.returnHome", {}, "Return to Home")}</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E7F0E4] border border-[#2F5D34]/20 text-[#2F5D34] text-xs font-bold uppercase tracking-widest shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2F5D34]" />
              <span>{t("contactPage.gateway", {}, "KLN Ayurveda Care Gateway")}</span>
            </span>
          </div>

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E7F0E4] border border-[#2F5D34]/20 text-[#2F5D34] text-xs font-bold uppercase tracking-widest">
              {t("contactPage.getInTouch", {}, "Get In Touch")}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#1B351E] tracking-tight uppercase">
              {t("contactPage.title", {}, "Contact KLN Ayurveda")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-paragraph leading-relaxed">
              {t("contactPage.subtitle", {}, "Have questions about our authentic Ayurvedic formulations, personalized hair care recommendations, or your recent order? We'd love to hear from you.")}
            </p>
          </div>

          {/* Perfectly Aligned 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Contact Cards Stack (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
              
              {/* Card 1: Manufacturing & Headquarters */}
              <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/80 shadow-xl hover:shadow-2xl transition-all space-y-3">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-[#E7F0E4] text-[#2F5D34] flex items-center justify-center flex-none shadow-xs border border-[#2F5D34]/10">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B351E] text-base">
                      {t("contactPage.hqTitle", {}, "Manufacturing & Headquarters")}
                    </h3>
                    <p className="text-xs text-[#2F5D34] font-semibold">
                      {t("contactPage.hqSub", {}, "KLN Ayurveda Pvt. Ltd.")}
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-paragraph leading-relaxed pt-1 border-t border-gray-100">
                  {t("contactPage.hqAddress", {}, "160/2, Niranjan Ward, Kareli, 487221, Dist. Narsingpur (M.P.), Bharat")}
                </p>
              </div>

              {/* Card 2: Customer Care & Support */}
              <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/80 shadow-xl hover:shadow-2xl transition-all space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-[#E7F0E4] text-[#2F5D34] flex items-center justify-center flex-none shadow-xs border border-[#2F5D34]/10">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B351E] text-base">
                      {t("contactPage.supportTitle", {}, "Customer Support")}
                    </h3>
                    <p className="text-xs text-[#2F5D34] font-semibold">
                      {t("contactPage.supportSub", {}, "Direct Customer Care & Support")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm font-paragraph text-gray-700 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-bold">{t("contactPage.emailLabel", {}, "Email:")}</span>
                    <a
                      href="mailto:ayurvedakln@gmail.com"
                      className="font-bold text-[#2F5D34] hover:underline"
                    >
                      ayurvedakln@gmail.com
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-bold">{t("contactPage.phoneLabel", {}, "Phone:")}</span>
                    <a
                      href="tel:7725820320"
                      className="font-bold text-[#2F5D34] hover:underline"
                    >
                      7725820320
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <a
                    href="tel:7725820320"
                    className="flex-1 py-2.5 rounded-xl bg-[#E7F0E4] text-[#2F5D34] font-bold text-xs uppercase tracking-wider text-center hover:bg-[#2F5D34] hover:text-white transition-all border border-[#2F5D34]/20 flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href="mailto:ayurvedakln@gmail.com"
                    className="flex-1 py-2.5 rounded-xl bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider text-center hover:bg-[#224426] transition-all border border-[#2F5D34] flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </a>
                </div>
              </div>

              {/* Card 3: Ayurvedic Consultation Feature Banner */}
              <div className="bg-gradient-to-br from-[#1B351E] via-[#2F5D34] to-[#1B351E] text-white p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between border border-white/20">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🌿</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-gray-950 font-extrabold text-[10px] uppercase tracking-wider">
                      Vaidya Expert Advice
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1.5 uppercase">
                    {t("contactPage.consultationTitle", {}, "Ayurvedic Consultation")}
                  </h3>
                  <p className="text-xs text-gray-200 font-paragraph leading-relaxed">
                    {t("contactPage.consultationDesc", {}, "Our certified Vaidyas and holistic wellness experts are available to guide you on formulations tailored specifically to your Dosha profile.")}
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Contact Form Card (7 Cols) */}
            <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-white shadow-2xl flex flex-col justify-between">
              {submitted ? (
                <div className="text-center py-16 space-y-5 my-auto">
                  <div className="size-20 rounded-full bg-[#E7F0E4] text-[#2F5D34] flex items-center justify-center mx-auto shadow-inner border border-[#2F5D34]/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#1B351E] mb-2 uppercase">
                      {t("contactPage.successTitle", {}, "Message Sent Successfully!")}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-paragraph max-w-md mx-auto leading-relaxed">
                      {t("contactPage.successDesc", {}, "Thank you for reaching out to KLN Ayurveda. A confirmation email has been dispatched via our SMTP gateway, and our care team will get back to you within 24 hours.")}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 rounded-full bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#224426] transition-all cursor-pointer shadow-md"
                    >
                      {t("contactPage.sendAnother", {}, "Send Another Message")}
                    </button>
                    <Link
                      href="/"
                      className="px-6 py-3 rounded-full border border-[#2F5D34] text-[#2F5D34] text-xs font-bold uppercase tracking-widest hover:bg-[#2F5D34] hover:text-white transition-all"
                    >
                      {t("contactPage.returnHome", {}, "Return to Home")}
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-gray-100 pb-4 mb-2">
                    <h2 className="text-2xl font-bold text-[#1B351E] uppercase tracking-tight flex items-center gap-2">
                      <MessageSquare className="w-6 h-6 text-[#2F5D34]" />
                      <span>{t("contactPage.formTitle", {}, "Send Us a Message")}</span>
                    </h2>
                    <p className="text-xs text-gray-500 font-paragraph mt-1">
                      Fill out the details below and our Ayurvedic specialists will respond promptly.
                    </p>
                  </div>

                  {/* Input Grid 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        {t("contactPage.fullName", {}, "Full Name")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ananya Sharma"
                        className="w-full py-3.5 px-4 rounded-xl bg-gray-50/90 border border-gray-200 text-sm font-medium outline-none focus:border-[#2F5D34] focus:bg-white text-[#222123] shadow-2xs transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        {t("contactPage.email", {}, "Email Address")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ananya@example.com"
                        className="w-full py-3.5 px-4 rounded-xl bg-gray-50/90 border border-gray-200 text-sm font-medium outline-none focus:border-[#2F5D34] focus:bg-white text-[#222123] shadow-2xs transition-all"
                      />
                    </div>
                  </div>

                  {/* Input Grid 2: Phone & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        {t("contactPage.phone", {}, "Phone Number")}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full py-3.5 px-4 rounded-xl bg-gray-50/90 border border-gray-200 text-sm font-medium outline-none focus:border-[#2F5D34] focus:bg-white text-[#222123] shadow-2xs transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        {t("contactPage.subject", {}, "Subject")}
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={t("contactPage.subjectPlaceholder", {}, "Product Recommendation / Order Inquiry")}
                        className="w-full py-3.5 px-4 rounded-xl bg-gray-50/90 border border-gray-200 text-sm font-medium outline-none focus:border-[#2F5D34] focus:bg-white text-[#222123] shadow-2xs transition-all"
                      />
                    </div>
                  </div>

                  {/* Textarea Input */}
                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      {t("contactPage.message", {}, "Your Message")} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("contactPage.messagePlaceholder", {}, "How can we assist your wellness journey today?")}
                      className="w-full py-3.5 px-4 rounded-xl bg-gray-50/90 border border-gray-200 text-sm font-paragraph outline-none focus:border-[#2F5D34] focus:bg-white resize-none text-[#222123] shadow-2xs transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? t("contactPage.submitting", {}, "Sending Inquiry...")
                        : t("contactPage.submitBtn", {}, "Submit Inquiry & Send Email")}
                    </span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
