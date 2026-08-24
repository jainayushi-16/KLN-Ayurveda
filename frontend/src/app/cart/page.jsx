"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { PRODUCTS } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";
import toast from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const {
    items: cartItems,
    totalItems: totalItemsCount,
    subtotal,
    appliedCoupon,
    couponDiscount,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCartStore();
  const { wishlistIds, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
    try {
      setIsApplyingCoupon(true);
      await applyCoupon(couponCode);
      setCouponCode("");
    } catch (err) {
      // Toast handles error message
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode("");
  };

  const handleSaveForLater = async (productId) => {
    await removeItem(productId);
    toggleWishlist(productId);
    toast.success("Item saved to Wishlist ♥");
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    router.push("/checkout");
  };

  // Hydrate items with catalog details to ensure 100% price consistency
  const populatedItems = cartItems.map((item) => {
    const matched = PRODUCTS.find((p) => p.id === item.productId);
    return {
      ...item,
      product: matched || {
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice || item.price * 1.3,
        images: [item.image || "/images/products/hairoil/oilf.jpeg"],
        category: item.category || "Hair Care",
        shortDesc: "Authentic cold-pressed herbal formulation for complete care.",
      },
    };
  });

  const isFreeShip = appliedCoupon && appliedCoupon.isFreeShipping;
  const shipping = isFreeShip ? 0 : subtotal > 499 || subtotal === 0 ? 0 : 49;
  const discountAmount = appliedCoupon ? Number(appliedCoupon.discountAmount || 0) : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Number((taxableAmount * 0.05).toFixed(2));
  const finalTotal = Number(Math.max(0, taxableAmount + shipping + tax).toFixed(2));

  return (
    <ProtectedRoute pageTitle="your Shopping Cart">
      <main className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
        {/* Navbar */}
        <ShopNavBar searchQuery={searchQuery} onSearchChange={setSearchQuery} cartCount={totalItemsCount} wishlistCount={wishlistIds.length} />

        {/* Background Organic Botanical Accents */}
        <Image src="/images/branch.svg" alt="" width={450} height={450} className="absolute top-20 right-5 opacity-20 pointer-events-none floating-leaf z-0" />
        <Image src="/images/leaf.svg" alt="" width={350} height={350} className="absolute bottom-40 left-5 opacity-20 pointer-events-none floating-leaf z-0" />

        {/* Header Section with Back to Shop Button */}
        <section className="pt-12 pb-10 w-full px-6 md:px-12 lg:px-16 relative z-10">
          <div className="max-w-[1800px] mx-auto mb-6 flex items-center justify-between">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2F5D34] hover:bg-[#2F5D34] hover:text-white bg-white/90 px-5 py-2.5 rounded-full border border-[#2F5D34]/20 shadow-md transition-all duration-300 hover:scale-105"
            >
              <span>← Back to Shop</span>
            </Link>
          </div>

          <div className="max-w-[1800px] mx-auto text-center cart-header">
            <span className="inline-block px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#2F5D34]/15 text-[#2F5D34] text-xs md:text-sm font-bold uppercase tracking-widest mb-4 shadow-sm">
              Your Selection
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase text-[#2F5D34] tracking-tight leading-none">
              Shopping Cart
            </h1>
            <p className="text-gray-700 font-paragraph text-base md:text-xl mt-4 leading-relaxed max-w-2xl mx-auto">
              Review your pure Ayurvedic formulations before secure checkout.
            </p>
          </div>
        </section>

        {/* Main Cart Content */}
        <section className="pb-28 w-full px-6 md:px-12 lg:px-16 relative z-10">
          <div className="max-w-[1800px] mx-auto">
            {populatedItems.length === 0 ? (
              /* Empty State */
              <div className="text-center py-24 px-8 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-[#2F5D34]/30 max-w-xl mx-auto shadow-sm">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#222123] mb-3">
                  Your Shopping Cart is Empty
                </h2>
                <p className="text-gray-600 font-paragraph text-base mb-8 leading-relaxed">
                  You have no formulations in your cart. Discover our organic Ayurvedic hair oils, masks, and scalp tonics.
                </p>
                <Link href="/shop">
                  <button className="px-8 py-4 rounded-full bg-[#2F5D34] text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all">
                    Explore Collection
                  </button>
                </Link>
              </div>
            ) : (
              /* Cart Grid: Left List (2/3) + Right Summary (1/3) */
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* Left Column: Cart Items */}
                <div className="cart-left-section w-full lg:w-2/3 flex flex-col gap-6">
                  {populatedItems.map(({ productId, quantity, product }) => {
                    if (!product) return null;
                    return (
                      <div key={productId} className="bg-white/85 backdrop-blur-md rounded-[2rem] border border-white/80 p-5 sm:p-7 shadow-lg hover:shadow-xl transition-all flex flex-col sm:flex-row items-center gap-6">
                        {/* Product Thumbnail */}
                        <div className="relative size-32 sm:size-40 rounded-2xl overflow-hidden bg-[#F6F3EC] flex-none">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover object-center" />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 flex flex-col justify-between w-full">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-[#5B7C3A]">
                                {product.category}
                              </span>
                              <h3 className="text-xl sm:text-2xl font-bold text-[#222123]">
                                {product.name}
                              </h3>
                              <p className="text-xs sm:text-sm font-paragraph text-gray-600 mt-1 line-clamp-2">
                                {product.shortDesc}
                              </p>
                            </div>

                            <span className="text-xl sm:text-2xl font-bold text-[#2F5D34] flex-none">
                              ₹{(product.price * quantity).toFixed(2)}
                            </span>
                          </div>

                          {/* Controls: Quantity + Actions */}
                          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                            {/* Quantity Selector (+ / -) */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Qty:
                              </span>
                              <div className="flex items-center border border-[#2F5D34]/20 rounded-full px-2.5 py-1 bg-white">
                                <button
                                  onClick={() => updateQuantity(productId, Math.max(1, quantity - 1))}
                                  className="size-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 hover:bg-[#2F5D34] hover:text-white transition-colors"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-bold text-sm text-[#222123]">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(productId, quantity + 1)}
                                  className="size-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 hover:bg-[#2F5D34] hover:text-white transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Action Buttons: Save for Later & Remove */}
                            <div className="flex items-center gap-3">
                              <button onClick={() => handleSaveForLater(productId)} className="text-xs font-bold uppercase tracking-wider text-[#5B7C3A] hover:underline">
                                ♥ Save for Later
                              </button>
                              <span className="text-gray-300">|</span>
                              <button onClick={() => removeItem(productId)} className="text-xs font-bold uppercase tracking-wider text-red-500 hover:underline">
                                🗑️ Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column: Sticky Order Summary Card with In-Summary Product Controls */}
                <div className="cart-summary-card w-full lg:w-1/3 sticky top-28 bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-6 sm:p-8 shadow-2xl">
                  <h3 className="text-2xl font-bold uppercase text-[#2F5D34] mb-4 pb-3 border-b border-[#2F5D34]/15">
                    Order Summary
                  </h3>

                  {/* Product List inside Order Summary with Quick Add / Remove Controls */}
                  <div className="mb-6 flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Items in Summary:</span>
                    {populatedItems.map(({ productId, quantity, product }) => (
                      <div key={productId} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                        <div className="flex items-center gap-2 max-w-[55%]">
                          <div className="relative size-10 rounded-lg overflow-hidden bg-white flex-none border border-gray-200">
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#222123] text-xs line-clamp-1">{product.name}</h4>
                            <span className="text-[#2F5D34] font-bold">₹{(product.price * quantity).toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Order Summary Quantity & Remove Options */}
                        <div className="flex items-center gap-1.5 flex-none">
                          <div className="flex items-center border border-[#2F5D34]/20 rounded-full px-1.5 py-0.5 bg-white">
                            <button
                              onClick={() => updateQuantity(productId, Math.max(1, quantity - 1))}
                              className="size-5 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-700 hover:bg-[#2F5D34] hover:text-white transition-colors"
                            >
                              -
                            </button>
                            <span className="w-5 text-center font-bold text-xs text-[#222123]">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(productId, quantity + 1)}
                              className="size-5 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-700 hover:bg-[#2F5D34] hover:text-white transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(productId)}
                            className="text-xs text-red-500 hover:text-red-700 p-1"
                            title="Remove from Order"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subtotals Breakdown */}
                  <div className="flex flex-col gap-3.5 text-sm font-paragraph text-gray-700 border-t border-gray-100 pt-4">
                    <div className="flex justify-between">
                      <span>Total Items</span>
                      <span className="font-bold text-[#222123]">{totalItemsCount}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#222123]">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="font-bold text-[#2F5D34]">
                        {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Estimated Tax (5%)</span>
                      <span className="font-bold text-[#222123]">₹{tax.toFixed(2)}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-[#2F5D34] font-extrabold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline text-lg font-bold text-[#2F5D34]">
                      <span>Total Amount</span>
                      <span className="text-2xl text-[#2F5D34]">₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Have a Promo Code?
                    </label>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#2F5D34]/10 border border-[#2F5D34]/30">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-xs text-[#2F5D34] uppercase">{appliedCoupon.code}</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full shadow-sm">Applied</span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-0.5">You save ₹{appliedCoupon.discountAmount.toFixed(2)} on this order!</p>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs shadow-sm transition-all cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="e.g. KLN20"
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold uppercase outline-none focus:border-[#2F5D34]"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon}
                          className="px-5 py-2.5 rounded-xl bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#224426] transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isApplyingCoupon ? "Applying..." : "Apply"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Primary & Secondary Buttons */}
                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:shadow-[0_15px_35px_rgba(47,93,52,0.4)] hover:scale-102 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span>🔒 {isPlacingOrder ? "Placing Order..." : "Proceed to Checkout"}</span>
                    </button>

                    <Link href="/shop">
                      <button className="w-full py-3.5 rounded-full border-2 border-[#2F5D34] text-[#2F5D34] hover:bg-[#2F5D34] hover:text-white font-bold text-xs uppercase tracking-wider transition-all text-center block">
                        ← Back to Shop
                      </button>
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-2.5 text-xs font-bold text-[#5B7C3A]">
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>100% Secure Encrypted Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>Fast Express Global Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>100% Pure Organic Ayurvedic Botanicals</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <FooterSection />
      </main>
    </ProtectedRoute>
  );
}
