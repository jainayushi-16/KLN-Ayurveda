"use client";
import { useState } from "react";
import Image from "next/image";
export default function LuxuryProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted, }) {
    const [isHovered, setIsHovered] = useState(false);
    const primaryImage = product.images[0] || "/images/products/hairoil/oilf.jpeg";
    const hoverImage = product.images[1] || primaryImage;
    return (<div className="shop-card-item group relative bg-white/75 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-6 md:p-8 lg:p-10 shadow-xl hover:shadow-[0_35px_70px_rgba(47,93,52,0.22)] hover:-translate-y-3 transition-all duration-700 ease-out flex flex-col justify-between" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Large Showcase Image (~75% height) */}
      <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[520px] rounded-3xl overflow-hidden bg-[#F6F3EC]/80">
        <Image src={isHovered ? hoverImage : primaryImage} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover object-center group-hover:scale-108 transition-all duration-700 ease-out"/>

        {/* Wishlist Heart Icon */}
        <button onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
        }} aria-label="Add to Wishlist" className="absolute top-5 right-5 z-20 size-12 rounded-full bg-white/80 backdrop-blur-md border border-white/60 flex items-center justify-center text-xl shadow-lg hover:bg-white hover:scale-110 active:scale-90 transition-all duration-300">
          <span className={isWishlisted ? "text-red-500 scale-110" : "text-gray-400 group-hover:text-red-400"}>
            {isWishlisted ? "♥" : "♡"}
          </span>
        </button>

        {/* Badge Tag */}
        {product.badge && (<span className="absolute top-5 left-5 z-10 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#2F5D34] text-white shadow-md backdrop-blur-md">
            {product.badge}
          </span>)}
      </div>

      {/* Product Details & Luxury Typography */}
      <div className="mt-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-[#222123] group-hover:text-[#2F5D34] transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="text-sm md:text-base font-paragraph text-gray-600 mt-3 leading-relaxed line-clamp-2">
            {product.shortDesc}
          </p>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="mt-8 pt-6 border-t border-[#2F5D34]/15 flex items-center justify-between">
          <span className="text-2xl md:text-3xl font-bold text-[#2F5D34]">
            ${product.price}
          </span>

          <button onClick={() => onAddToCart(product)} className="px-8 py-4 rounded-full bg-[#2F5D34] text-white text-xs md:text-sm font-bold uppercase tracking-widest shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>);
}
