"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product, onAddToCart, onBuyNow, onToggleWishlist, isWishlisted }) {
    const [isHovered, setIsHovered] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const primaryImage = product.images[0] || "/images/products/hairoil/oilf.jpeg";
    const hoverImage = product.images[1] || primaryImage;

    return (
      <div className="shop-card-item group relative bg-white/85 backdrop-blur-md rounded-[2.5rem] border border-white/80 p-6 md:p-8 shadow-xl hover:shadow-[0_30px_60px_rgba(47,93,52,0.25)] hover:-translate-y-3 transition-all duration-700 ease-out flex flex-col justify-between" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* Large Product Image Container with Link to PDP */}
        <Link href={`/product/${product.id}`} className="block relative w-full h-[360px] sm:h-[400px] lg:h-[440px] rounded-3xl overflow-hidden bg-[#F6F3EC]">
          <Image src={isHovered ? hoverImage : primaryImage} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover object-center group-hover:scale-108 transition-all duration-700 ease-out"/>

          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-5 left-5 z-10 px-2.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${
              product.badge === "Bestseller"
                ? "bg-[#2F5D34] text-white"
                : product.badge === "Organic"
                    ? "bg-[#5B7C3A] text-white"
                    : product.badge === "Award Winner"
                        ? "bg-[#C9A66B] text-[#222123]"
                        : "bg-[#222123] text-white"
            }`}>
              {product.badge}
            </span>
          )}
        </Link>

        {/* Wishlist Button */}
        <button onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
        }} aria-label="Add to Wishlist" className="absolute top-11 right-11 z-20 size-12 rounded-full bg-white/80 backdrop-blur-md border border-white/60 flex items-center justify-center text-xl shadow-lg hover:bg-white hover:scale-110 active:scale-90 transition-all duration-300">
          <span className={isWishlisted ? "text-red-500 scale-110" : "text-gray-400 group-hover:text-red-400"}>
            {isWishlisted ? "♥" : "♡"}
          </span>
        </button>

        {/* Product Information */}
        <div className="mt-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Rating */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C9A66B] mb-2">
              <span>★ {product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount} reviews)</span>
            </div>

            {/* Product Name Link */}
            <Link href={`/product/${product.id}`}>
              <h3 className="text-2xl md:text-3xl font-bold text-[#222123] group-hover:text-[#2F5D34] transition-colors leading-tight">
                {product.name}
              </h3>
            </Link>

            {/* Short Description */}
            <p className="text-sm md:text-base font-paragraph text-gray-600 mt-2.5 leading-relaxed line-clamp-2">
              {product.shortDesc}
            </p>
          </div>

        {/* Price & Quantity Selector */}
        <div className="mt-6 pt-5 border-t border-[#2F5D34]/15 flex items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl md:text-3xl font-bold text-[#2F5D34]">
              ₹{product.price}
            </span>
            {product.originalPrice && (<span className="text-sm font-paragraph text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>)}
          </div>

          {/* Quantity Selector (+ / -) */}
          <div className="flex items-center border border-[#2F5D34]/20 rounded-full px-2.5 py-1 bg-white/90 shadow-inner">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="size-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 hover:bg-[#2F5D34] hover:text-white transition-colors">
              -
            </button>
            <span className="w-8 text-center font-bold text-sm text-[#222123]">
              {quantity}
            </span>
            <button onClick={() => setQuantity((q) => q + 1)} className="size-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 hover:bg-[#2F5D34] hover:text-white transition-colors">
              +
            </button>
          </div>
        </div>

        {/* Dual CTAs: Side-by-side on desktop, stacked on mobile */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {/* Add to Cart Button (Outlined/Herbal Green) */}
          <button onClick={() => onAddToCart(product, quantity)} className="flex-1 py-3.5 px-4 rounded-full border-2 border-[#2F5D34] text-[#2F5D34] hover:bg-[#2F5D34] hover:text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-102 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
            <span>🛒</span>
            <span>Add to Cart</span>
          </button>

          {/* Buy Now Button (Primary Filled Brand Gradient CTA) */}
          <button onClick={() => onBuyNow(product, quantity)} className="flex-1 py-4 px-5 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-xl hover:shadow-[0_15px_35px_rgba(47,93,52,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
            <span>⚡</span>
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>);
}
