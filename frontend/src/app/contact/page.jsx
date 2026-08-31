"use client";

import { useState } from "react";
import Link from "next/link";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import { contactApi } from "@/services/contact.api";
import { useLanguage } from "@/i18n/LanguageContext";
import toast from "react-hot-toast";

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
      toast.success(res.message || t("messages.success", {}, "Thank you! Your message has been sent successfully."));
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(err.message || t("messages.error", {}, "Failed to submit contact form. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full relative bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
      {/* Navigation Header */}
      <ShopNavBar />

      <div className="py-6 sm:py-8 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Top Breadcrumb & Return to Home */}
          <div className="mb-4 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 border border-[#2F5D34]/20 text-[#2F5D34] text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#2F5D34] hover:text-white transition-all cursor-pointer"
            >
              <span>← {t("common.back", {}, "Return to Home")}</span>
            </Link>
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A]">
              KLN Ayurveda Care Gateway
            </span>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E7F0E4] border border-[#2F5D34]/20 text-[#2F5D34] text-xs font-bold uppercase tracking-widest mb-3">
              {t("common.contact", {}, "Get In Touch")}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#1B351E] tracking-tight">
              {t("common.contact", {}, "Contact KLN Ayurveda")}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mt-4 font-paragraph">
              Have questions about our authentic Ayurvedic formulations, personalized hair care recommendations, or your recent order? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Contact Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-200 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-12 rounded-full bg-[#E7F0E4] flex items-center justify-center text-xl text-[#2F5D34]">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B351E] text-base">Manufacturing & Headquarters</h3>
                    <p className="text-xs text-gray-500">KLN Ayurveda Pvt. Ltd.</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-paragraph">
                  160/2, Niranjan Ward, Kareli,<br />
                  487221, Dist. Narsingpur (M.P.), Bharat
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-200 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-12 rounded-full bg-[#E7F0E4] flex items-center justify-center text-xl text-[#2F5D34]">
                    ✉️
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B351E] text-base">{t("footer.customerCare", {}, "Customer Support")}</h3>
                    <p className="text-xs text-gray-500">Direct Customer Care & Support</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-paragraph">
                  <strong>Email:</strong> <a href="mailto:ayurvedakln@gmail.com" className="hover:underline text-[#2F5D34]">ayurvedakln@gmail.com</a><br />
                  <strong>Phone:</strong> <a href="tel:7725820320" className="hover:underline text-[#2F5D34]">7725820320</a>
                </p>
              </div>

              <div className="bg-[#1B351E] text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                <span className="text-3xl mb-3 block">🌿</span>
                <h3 className="text-xl font-bold mb-2">Ayurvedic Consultation</h3>
                <p className="text-xs text-gray-300 leading-relaxed font-paragraph">
                  Our certified Vaidyas and holistic wellness experts are available to guide you on formulations tailored specifically to your Dosha profile.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-200 shadow-2xl">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-2xl font-bold text-[#1B351E] mb-2">{t("messages.success", {}, "Message Sent Successfully!")}</h3>
                  <p className="text-sm text-gray-600 mb-6 font-paragraph max-w-md mx-auto">
                    Thank you for reaching out to KLN Ayurveda. A confirmation email has been dispatched via our SMTP gateway, and our care team will get back to you within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 rounded-full bg-[#1B351E] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2A4D2E] transition-all cursor-pointer"
                    >
                      Send Another Message
                    </button>
                    <Link
                      href="/"
                      className="px-6 py-3 rounded-full border border-[#1B351E] text-[#1B351E] text-xs font-bold uppercase tracking-widest hover:bg-[#1B351E] hover:text-white transition-all"
                    >
                      {t("common.home", {}, "Return to Home")}
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#1B351E]">{t("common.contact", {}, "Send Us a Message")}</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        {t("checkout.firstName", {}, "Full Name")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ananya Sharma"
                        className="w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium outline-none focus:border-[#2F5D34] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        {t("checkout.email", {}, "Email Address")} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ananya@example.com"
                        className="w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium outline-none focus:border-[#2F5D34] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        {t("checkout.phone", {}, "Phone Number")}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium outline-none focus:border-[#2F5D34] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Product Recommendation / Order Inquiry"
                        className="w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium outline-none focus:border-[#2F5D34] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we assist your wellness journey today?"
                      className="w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium outline-none focus:border-[#2F5D34] focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-102 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? t("common.loading", {}, "Sending Inquiry...") : t("common.save", {}, "Submit Inquiry & Send Email")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </main>
  );
}
