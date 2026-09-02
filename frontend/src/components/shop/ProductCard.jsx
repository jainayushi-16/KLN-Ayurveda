"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

function getProductFallbackImage(product, index = 0) {
  const pName = (product?.name || product?.category || product?.id || "").toLowerCase();
  if (pName.includes("mask")) {
    const maskImgs = [
      "/images/products/hairmask/maskf.jpeg",
      "/images/products/hairmask/hairmask.jpeg",
      "/images/products/hairmask/maskp.jpeg",
    ];
    return maskImgs[index] || maskImgs[0];
  }
  if (pName.includes("tonic") || pName.includes("scalp")) {
    const tonicImgs = [
      "/images/products/hairtonic/tonicf.jpeg",
      "/images/products/hairtonic/tonicb.jpeg",
      "/images/products/hairtonic/tonics.jpeg",
    ];
    return tonicImgs[index] || tonicImgs[0];
  }
  const oilImgs = [
    "/images/products/hairoil/oilf.jpeg",
    "/images/products/hairoil/oilbenefit.jpeg",
    "/images/products/hairoil/oilb.jpeg",
  ];
  return oilImgs[index] || oilImgs[0];
}

const HINDI_PRODUCT_MAP = {
  "kln-hair-oil-01": {
    name: "ऑल पर्पस हेयर ऑयल",
    shortDesc: "नारियल, जैतून, आर्गन और रोज़मेरी तेल के प्राकृतिक मिश्रण से बालों की जड़ों को मजबूती और स्कैल्प को पोषण दें।",
    badge: "बेस्टसेलर",
  },
  "kln-hair-mask-02": {
    name: "प्रोटेक्टिव हेयर मास्क",
    shortDesc: "नारियल, जैतून, आंवला, भृंगराज, नीम और मेथी से भरपूर कीटनाशक-मुक्त वनस्पति हेयर मास्क।",
    badge: "ऑर्गेनिक",
  },
  "kln-hair-tonic-03": {
    name: "ऑल पर्पस हेयर टॉनिक",
    shortDesc: "जड़ों को मजबूत करने और डैंड्रफ नियंत्रित करने के लिए 100% प्राकृतिक तेलों से समृद्ध प्राकृतिक आयुर्वेदिक हेयर टॉनिक।",
    badge: "100% प्राकृतिक",
  },
};

export default function ProductCard({ product, onAddToCart, onBuyNow, onToggleWishlist, isWishlisted }) {
    const { t, isHindi } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const localizedName = isHindi ? (HINDI_PRODUCT_MAP[product.id]?.name || product.name) : product.name;
    const localizedShortDesc = isHindi ? (HINDI_PRODUCT_MAP[product.id]?.shortDesc || product.shortDesc) : product.shortDesc;
    const localizedBadge = isHindi ? (HINDI_PRODUCT_MAP[product.id]?.badge || product.badge) : product.badge;

    let rawPrimary = typeof product?.images?.[0] === 'string'
      ? product.images[0]
      : product?.images?.[0]?.url || product?.image || product?.imageUrl;

    let rawHover = typeof product?.images?.[1] === 'string'
      ? product.images[1]
      : product?.images?.[1]?.url;

    const pName = (product?.name || product?.category || product?.id || "").toLowerCase();
    const isMask = pName.includes("mask");
    const isTonic = pName.includes("tonic") || pName.includes("scalp");

    if (!rawPrimary || (isMask && rawPrimary.includes("/hairoil/")) || (isTonic && rawPrimary.includes("/hairoil/"))) {
      rawPrimary = getProductFallbackImage(product, 0);
    }

    if (!rawHover || (isMask && rawHover.includes("/hairoil/")) || (isTonic && rawHover.includes("/hairoil/"))) {
      rawHover = getProductFallbackImage(product, 1);
    }

    const primaryImage = rawPrimary;
    const hoverImage = rawHover;

    return (
      <div className="h-full group relative bg-white/85 backdrop-blur-md rounded-[2.5rem] border border-white/80 p-6 md:p-8 shadow-xl hover:shadow-[0_30px_60px_rgba(47,93,52,0.25)] hover:-translate-y-3 transition-all duration-700 ease-out flex flex-col justify-between" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* Large Product Image Container with Link to PDP */}
        <Link href={`/product/${product.id}`} className="block relative w-full h-[320px] sm:h-[360px] lg:h-[380px] flex-none rounded-3xl overflow-hidden bg-[#F6F3EC]">
          <Image src={isHovered ? hoverImage : primaryImage} alt={localizedName} fill priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover object-center group-hover:scale-108 transition-all duration-700 ease-out"/>

          {/* Badge */}
          {localizedBadge && (
            <span className={`absolute top-5 left-5 z-10 px-2.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${
              product.badge === "Bestseller"
                ? "bg-[#2F5D34] text-white"
                : product.badge === "Organic"
                    ? "bg-[#5B7C3A] text-white"
                    : product.badge === "Award Winner"
                        ? "bg-[#C9A66B] text-[#222123]"
                        : "bg-[#222123] text-white"
            }`}>
              {localizedBadge}
            </span>
          )}
        </Link>

        {/* Wishlist Button */}
        <button onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
        }} aria-label={t("navigation.wishlist", {}, "Add to Wishlist")} className="absolute top-11 right-11 z-20 size-12 rounded-full bg-white/80 backdrop-blur-md border border-white/60 flex items-center justify-center text-xl shadow-lg hover:bg-white hover:scale-110 active:scale-90 transition-all duration-300">
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
              <span className="text-gray-400 font-normal">({product.reviewsCount} {t("product.reviews", {}, "reviews")})</span>
            </div>

            {/* Product Name Link */}
            <Link href={`/product/${product.id}`}>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#222123] group-hover:text-[#2F5D34] transition-colors leading-tight min-h-[3.2rem] flex items-center">
                {localizedName}
              </h3>
            </Link>

            {/* Short Description */}
            <p className="text-xs sm:text-sm md:text-base font-paragraph text-gray-600 mt-2.5 leading-relaxed line-clamp-2 min-h-[2.8rem]">
              {localizedShortDesc}
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
          {/* Add to Cart Button */}
          <button onClick={() => onAddToCart(product, quantity)} className="flex-1 py-3.5 px-4 rounded-full border-2 border-[#2F5D34] text-[#2F5D34] hover:bg-[#2F5D34] hover:text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-102 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
            <span>🛒</span>
            <span>{t("product.addToCart", {}, "Add to Cart")}</span>
          </button>

          {/* Buy Now Button */}
          <button onClick={() => onBuyNow(product, quantity)} className="flex-1 py-4 px-5 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-xl hover:shadow-[0_15px_35px_rgba(47,93,52,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
            <span>⚡</span>
            <span>{t("product.buyNow", {}, "Buy Now")}</span>
          </button>
        </div>
      </div>
    </div>);
}
