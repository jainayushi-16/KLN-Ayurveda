"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/constants/products";
export default function QuickViewModal({ product, onClose, onAddToCart, onSelectProduct, }) {
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("ingredients");
    useEffect(() => {
        setSelectedImgIndex(0);
        setQuantity(1);
    }, [product]);
    if (!product)
        return null;
    const currentImg = product.images[selectedImgIndex] || product.images[0];
    const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"/>

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#F6F3EC] rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/40 my-auto max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button onClick={onClose} aria-label="Close modal" className="absolute top-4 right-4 z-30 size-10 rounded-full bg-white/80 backdrop-blur-md border border-white/40 flex items-center justify-center text-[#222123] font-bold text-sm shadow hover:bg-white hover:scale-110 transition-all">
          ✕
        </button>

        {/* Left Column: Image Gallery */}
        <div className="w-full md:w-1/2 p-6 flex flex-col gap-4 bg-white/50 justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F6F3EC] shadow-inner border border-[#2F5D34]/10">
            <Image src={currentImg} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-center transition-all duration-500"/>

            {product.badge && (<span className="absolute top-4 left-4 z-10 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2F5D34] text-white shadow-md">
                {product.badge}
              </span>)}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (<button key={idx} onClick={() => setSelectedImgIndex(idx)} className={`relative size-16 flex-none rounded-xl overflow-hidden border-2 transition-all ${selectedImgIndex === idx
                ? "border-[#2F5D34] scale-105 shadow-md"
                : "border-transparent opacity-70 hover:opacity-100"}`}>
                <Image src={img} alt="" fill className="object-cover"/>
              </button>))}
          </div>
        </div>

        {/* Right Column: Product Information */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-white">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#5B7C3A] mb-2">
              <span>{product.category} • {product.type}</span>
              <span className="text-[#C9A66B]">★ {product.rating} ({product.reviewsCount} reviews)</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#222123] tracking-tight">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 my-3">
              <span className="text-2xl font-bold text-[#2F5D34]">
                ${product.price}
              </span>
              {product.originalPrice && (<span className="text-base font-paragraph text-gray-400 line-through">
                  ${product.originalPrice}
                </span>)}
              <span className="text-xs font-bold uppercase text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                In Stock
              </span>
            </div>

            {/* Full Description */}
            <p className="text-sm font-paragraph text-gray-600 leading-relaxed my-4">
              {product.fullDesc}
            </p>

            {/* Key Benefits Pills */}
            <div className="flex flex-wrap gap-2 my-4">
              {product.benefits.map((benefit, i) => (<span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-[#E7F0E4] text-[#2F5D34]">
                  ✓ {benefit}
                </span>))}
            </div>

            {/* Ingredients & Usage Tabs */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex gap-4 border-b border-gray-200 pb-2 mb-3 text-xs font-bold uppercase tracking-wider">
                <button onClick={() => setActiveTab("ingredients")} className={`pb-1 transition-all ${activeTab === "ingredients"
            ? "text-[#2F5D34] border-b-2 border-[#2F5D34]"
            : "text-gray-400 hover:text-gray-700"}`}>
                  Key Ingredients
                </button>
                <button onClick={() => setActiveTab("usage")} className={`pb-1 transition-all ${activeTab === "usage"
            ? "text-[#2F5D34] border-b-2 border-[#2F5D34]"
            : "text-gray-400 hover:text-gray-700"}`}>
                  How to Use
                </button>
              </div>

              {activeTab === "ingredients" ? (<div className="flex flex-wrap gap-1.5 text-xs text-gray-600">
                  {product.ingredients.map((ing, idx) => (<span key={idx} className="bg-gray-100 px-2.5 py-1 rounded-md font-paragraph">
                      • {ing}
                    </span>))}
                </div>) : (<p className="text-xs font-paragraph text-gray-600 leading-relaxed">
                  {product.usageInstructions}
                </p>)}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="size-7 rounded-full bg-white flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 shadow-sm">
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#222123]">
                  {quantity}
                </span>
                <button onClick={() => setQuantity((q) => q + 1)} className="size-7 rounded-full bg-white flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 shadow-sm">
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button onClick={() => {
            onAddToCart(product, quantity);
            onClose();
        }} className="flex-1 py-3.5 px-6 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] hover:scale-102 transition-all">
                Add to Cart • ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>

          {/* Related Products Mini Strip */}
          {relatedProducts.length > 0 && (<div className="mt-6 pt-4 border-t border-gray-100">
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                You May Also Like
              </span>
              <div className="flex gap-3">
                {relatedProducts.map((rel) => (<div key={rel.id} onClick={() => onSelectProduct(rel)} className="flex-1 flex items-center gap-2 p-2 rounded-xl bg-gray-50 hover:bg-[#E7F0E4] cursor-pointer transition-colors">
                    <div className="relative size-10 rounded-lg overflow-hidden flex-none">
                      <Image src={rel.images[0]} alt="" fill className="object-cover"/>
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-xs font-bold text-[#222123] truncate">
                        {rel.name}
                      </span>
                      <span className="block text-xs font-bold text-[#2F5D34]">
                        ${rel.price}
                      </span>
                    </div>
                  </div>))}
              </div>
            </div>)}
        </div>
      </div>
    </div>);
}
