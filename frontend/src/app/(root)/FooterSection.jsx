"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Phone, Mail, ArrowRight } from "lucide-react";

export default function FooterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Thank you for subscribing to KLN Ayurveda! 🌿");
    setEmail("");
  };

  return (
    <footer className="footer-section w-full bg-[#132A15] text-[#F6F3EC] pt-14 pb-8 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 pb-12">
          
          {/* Col 1: NAVIGATION */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] mb-4">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs font-paragraph text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: CUSTOMER CARE */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] mb-4">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2.5 text-xs font-paragraph text-gray-300">
              <li>
                <a href="tel:7725820320" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={14} className="text-[#C9A66B]" />
                  <span>7725820320</span>
                </a>
              </li>
              <li>
                <a href="mailto:ayurvedakln@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={14} className="text-[#C9A66B]" />
                  <span>ayurvedakln@gmail.com</span>
                </a>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Saved Items
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  My Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: POLICIES & LEGAL */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] mb-4">
              POLICIES & LEGAL
            </h4>
            <ul className="space-y-2.5 text-xs font-paragraph text-gray-300">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-white transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: FORMULATIONS */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] mb-4">
              FORMULATIONS
            </h4>
            <ul className="space-y-2.5 text-xs font-paragraph text-gray-300">
              <li>
                <Link href="/shop?type=Oil" className="hover:text-white transition-colors">
                  Hair Growth Oil
                </Link>
              </li>
              <li>
                <Link href="/shop?type=Mask" className="hover:text-white transition-colors">
                  Herbal Hair Mask
                </Link>
              </li>
              <li>
                <Link href="/shop?type=Tonic" className="hover:text-white transition-colors">
                  Scalp Tonic
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: NEWSLETTER SUBSCRIBE */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <p className="text-xs font-paragraph text-gray-300 leading-relaxed mb-4">
                Discover authentic Ayurvedic wellness. Stay informed about new herbal products, recipes, and exclusive offers!
              </p>
              
              <form onSubmit={handleSubscribe} className="relative pt-2">
                <div className="flex items-center border-b border-white/40 pb-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none pr-8 font-paragraph"
                  />
                  <button type="submit" aria-label="Subscribe to newsletter" className="text-white hover:text-[#C9A66B] transition-colors">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-paragraph text-gray-400">
          <div>
            © 2026 KLN Ayurveda. All rights reserved.
          </div>

          {/* Legal Links Right Side */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-paragraph text-gray-300">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/return-policy" className="hover:text-white transition-colors">
              Return & Refund Policy
            </Link>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">
              Shipping & Delivery Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
