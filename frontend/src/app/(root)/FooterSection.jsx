"use client";
import { useState } from "react";
import Link from "next/link";
import { contactApi } from "@/services/contact.api";
import toast from "react-hot-toast";
export default function FooterSection() {
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!newsletterEmail)
            return;
        setIsSubmitting(true);
        try {
            const res = await contactApi.subscribeNewsletter(newsletterEmail);
            if (res.success) {
                toast.success("Thank you for subscribing to KLN Ayurveda newsletter!");
                setNewsletterEmail("");
            }
        }
        catch (err) {
            toast.error(err.message || "Failed to subscribe.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<section className="footer-section w-full bg-[#1B351E] text-milk">
      <div className="relative pt-[10vh] pb-[8vh] px-6 md:px-12 max-w-[1800px] mx-auto">
        <div className="relative z-10 overflow-hidden">
          <h1 className="general-title text-center text-milk py-5 font-bold tracking-widest">
            #PURECARE
          </h1>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-5 md:mt-12 mt-5">
          <div className="social-btn p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
            <img src="/images/youtube.svg" alt="YouTube" className="size-6"/>
          </div>
          <div className="social-btn p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
            <img src="/images/instagram.svg" alt="Instagram" className="size-6"/>
          </div>
          <div className="social-btn p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
            <img src="/images/facebook.svg" alt="Facebook" className="size-6"/>
          </div>
        </div>

        <div className="relative z-10 mt-16 md:px-10 px-5 flex gap-10 md:flex-row flex-col justify-between text-milk font-paragraph md:text-lg font-medium border-t border-white/15 pt-12">
          <div className="flex flex-wrap items-start md:gap-16 gap-8">
            <div>
              <p className="font-bold text-[#E7F0E4] uppercase text-xs tracking-widest mb-3">
                Navigation
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-300">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop Collection
                </Link>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </div>
            </div>

            <div>
              <p className="font-bold text-[#E7F0E4] uppercase text-xs tracking-widest mb-3">
                Customer Care
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-300">
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Wishlist
                </Link>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </div>
            </div>

            <div>
              <p className="font-bold text-[#E7F0E4] uppercase text-xs tracking-widest mb-3">
                Formulations
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-300">
                <Link href="/shop" className="hover:text-white transition-colors">
                  Hair Growth Oil
                </Link>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Herbal Hair Mask
                </Link>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Scalp Tonic
                </Link>
              </div>
            </div>
          </div>

          <div className="md:max-w-lg">
            <p className="text-sm text-gray-200 leading-relaxed">
              Discover authentic Ayurvedic wellness. Stay informed about new herbal products, recipes, and exclusive offers!
            </p>

            <form onSubmit={handleSubscribe} className="flex justify-between items-center border-b border-[#D9D9D9] py-4 mt-6">
              <input type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your email address" className="w-full bg-transparent outline-none placeholder:text-[#999999] text-sm text-white"/>
              <button type="submit" disabled={isSubmitting} className="flex-none p-2 hover:scale-110 transition-transform disabled:opacity-50">
                <img src="/images/arrow.svg" alt="arrow" className="size-5"/>
              </button>
            </form>
          </div>
        </div>

        <div className="relative z-10 mt-16 pt-6 border-t border-white/10 px-5 md:px-10 flex flex-col sm:flex-row justify-between items-center text-milk text-xs text-gray-400 gap-4">
          <p>Copyright © 2025 KLN Ayurveda - All Rights Reserved</p>
          <div className="flex items-center gap-7">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </section>);
}
