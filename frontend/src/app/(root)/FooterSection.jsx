"use client";

import Link from "next/link";
import Image from "next/image";

export default function FooterSection() {
  return (
    <footer className="footer-section w-full bg-[#1B351E] text-[#F6F3EC] border-t border-white/10">
      <div className="py-6 sm:py-8 px-6 md:px-12 max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/kln-logo.jpg"
            alt="KLN Ayurveda Logo"
            width={36}
            height={36}
            className="w-9 h-9 object-contain rounded-full border border-white/20"
          />
          <div>
            <span className="font-extrabold text-sm uppercase tracking-wider text-white block">
              KLN Ayurveda
            </span>
            <span className="text-[11px] text-[#C9A66B] font-medium block">
              A Taste Of Herbal Luxury
            </span>
          </div>
        </div>

        {/* Center: Legal & Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-gray-300">
          <Link href="/contact" className="hover:text-[#C9A66B] transition-colors">
            Contact Us
          </Link>
          <span className="text-gray-600 hidden sm:inline">•</span>
          <Link href="/privacy-policy" className="hover:text-[#C9A66B] transition-colors">
            Privacy Policy
          </Link>
          <span className="text-gray-600 hidden sm:inline">•</span>
          <Link href="/terms-and-conditions" className="hover:text-[#C9A66B] transition-colors">
            Terms & Conditions
          </Link>
          <span className="text-gray-600 hidden sm:inline">•</span>
          <Link href="/shipping-policy" className="hover:text-[#C9A66B] transition-colors">
            Shipping Policy
          </Link>
          <span className="text-gray-600 hidden sm:inline">•</span>
          <Link href="/return-policy" className="hover:text-[#C9A66B] transition-colors">
            Return & Refund Policy
          </Link>
        </div>

        {/* Right: Social Media Icons + Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <a
              href="https://www.youtube.com/@klnayurveda"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 flex items-center justify-center"
            >
              <img src="/images/youtube.svg" alt="YouTube" className="size-4" />
            </a>
            <a
              href="https://www.instagram.com/klnayurveda"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 flex items-center justify-center"
            >
              <img src="/images/instagram.svg" alt="Instagram" className="size-4" />
            </a>
            <a
              href="https://www.facebook.com/share/v/1CBjLKCJFA/"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 flex items-center justify-center"
            >
              <img src="/images/facebook.svg" alt="Facebook" className="size-4" />
            </a>
          </div>

          <span className="text-[11px] text-gray-400">
            © 2026 KLN Ayurveda. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
}
