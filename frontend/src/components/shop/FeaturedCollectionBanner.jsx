"use client";
import Image from "next/image";
export default function FeaturedCollectionBanner({ onExploreClick, }) {
    return (<div className="relative my-16 rounded-3xl overflow-hidden shadow-2xl bg-[#2F5D34] min-h-[380px] md:min-h-[420px] flex items-center group">
      {/* Background Image */}
      <Image src="/images/products/hairoil/oilbenefit.jpeg" alt="Ayurvedic Collection Banner" fill sizes="100vw" className="object-cover object-center opacity-35 group-hover:scale-105 group-hover:opacity-45 transition-all duration-1000 ease-out"/>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2F5D34] via-[#2F5D34]/80 to-transparent z-10"/>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-8 md:px-16 py-12 max-w-2xl text-white">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold uppercase tracking-widest text-[#E7F0E4] mb-4">
          Limited Edition Ritual
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F6F3EC] leading-tight">
          Harmonize Your Mind, Scalp & Skin
        </h2>

        <p className="text-sm sm:text-base font-paragraph text-[#E7F0E4]/90 mt-4 leading-relaxed">
          Experience the handcrafted Kshirapaka hair oil and botanical mask bundle. Formulated with organic Bhringraj and Hibiscus for holistic vitality.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button onClick={onExploreClick} className="px-8 py-4 rounded-full bg-[#E7F0E4] text-[#2F5D34] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300">
            Explore Bestsellers
          </button>
          <span className="text-xs font-bold text-[#E7F0E4] uppercase tracking-wider">
            Free Worldwide Shipping on orders $75+
          </span>
        </div>
      </div>
    </div>);
}
