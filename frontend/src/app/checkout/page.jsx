"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useOrderStore } from "@/store/useOrderStore";
import { PRODUCTS } from "@/constants/products";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, totalItems: totalItemsCount, subtotal } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { shippingAddress, setShippingAddress, deliveryMethod, setDeliveryMethod, couponCode, discountPercent, applyCoupon } = useOrderStore();

  const [promoInput, setPromoInput] = useState(couponCode);
  const [formErrors, setFormErrors] = useState({});

  const shippingCost = deliveryMethod === "express" ? 99 : subtotal > 499 || subtotal === 0 ? 0 : 49;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const discountAmount = Number((subtotal * discountPercent).toFixed(2));
  const grandTotal = Math.max(0, Number((subtotal + shippingCost + tax - discountAmount).toFixed(2)));

  const populatedItems = cartItems.map((item) => {
    const matched = PRODUCTS.find((p) => p.id === item.productId);
    return {
      ...item,
      product: matched || {
        name: item.name,
        price: item.price,
        images: [item.image || "/images/products/hairoil/oilf.jpeg"],
        category: item.category || "Hair Care",
      },
    };
  });

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const result = applyCoupon(promoInput);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!shippingAddress.fullName?.trim()) errors.fullName = "Full name is required";
    if (!shippingAddress.email?.trim() || !shippingAddress.email.includes("@")) errors.email = "Valid email is required";
    if (!shippingAddress.phone?.trim() || shippingAddress.phone.length < 10) errors.phone = "Valid 10-digit phone number is required";
    if (!shippingAddress.street?.trim()) errors.street = "Street address is required";
    if (!shippingAddress.city?.trim()) errors.city = "City is required";
    if (!shippingAddress.state?.trim()) errors.state = "State is required";
    if (!shippingAddress.pincode?.trim()) errors.pincode = "Pincode is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!validateForm()) {
      toast.error("Please correct the errors in the shipping form.");
      return;
    }

    router.push("/payment");
  };

  return (
    <ProtectedRoute pageTitle="Checkout">
      <main className="min-h-screen w-full relative bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
        <ShopNavBar cartCount={totalItemsCount} wishlistCount={wishlistIds.length} />

        {/* Header */}
        <section className="pt-24 pb-8 w-full px-6 md:px-12 max-w-[1800px] mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2F5D34]/10 text-[#2F5D34] text-xs font-bold uppercase tracking-widest mb-3">
              Step 1 of 2 — Delivery Details
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold uppercase text-[#2F5D34]">Checkout</h1>
            <p className="text-gray-600 font-paragraph text-sm sm:text-base mt-2">
              Enter your delivery address and choose shipping speed.
            </p>
          </div>
        </section>

        {/* Main Content Grid: Address Form (Left 60%) + Order Summary (Right 40%) */}
        <section className="pb-28 w-full px-6 md:px-12 max-w-[1800px] mx-auto">
          {populatedItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl p-8 max-w-lg mx-auto shadow-xl">
              <div className="text-5xl mb-4">🛍️</div>
              <h3 className="text-2xl font-bold text-[#222123] mb-2">No Items to Checkout</h3>
              <p className="text-gray-600 font-paragraph text-sm mb-6">Your cart is empty. Add Ayurvedic formulations to proceed.</p>
              <Link href="/shop">
                <button className="px-8 py-3.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#224426] transition-all">
                  Explore Shop
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              {/* Left Column: Shipping Address & Delivery Options */}
              <div className="w-full lg:w-3/5 flex flex-col gap-8">
                {/* Contact & Shipping Form */}
                <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 border border-white shadow-xl">
                  <h3 className="text-2xl font-bold uppercase text-[#2F5D34] mb-6 pb-3 border-b border-[#2F5D34]/15">
                    Shipping Address
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ fullName: e.target.value })}
                        placeholder="e.g. Aarav Patel"
                        className={`w-full p-3.5 rounded-xl border text-sm outline-none transition-colors ${
                          formErrors.fullName ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-[#2F5D34]"
                        }`}
                      />
                      {formErrors.fullName && <span className="text-xs text-red-500 mt-1 block">{formErrors.fullName}</span>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({ email: e.target.value })}
                        placeholder="aarav@example.com"
                        className={`w-full p-3.5 rounded-xl border text-sm outline-none transition-colors ${
                          formErrors.email ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-[#2F5D34]"
                        }`}
                      />
                      {formErrors.email && <span className="text-xs text-red-500 mt-1 block">{formErrors.email}</span>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className={`w-full p-3.5 rounded-xl border text-sm outline-none transition-colors ${
                          formErrors.phone ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-[#2F5D34]"
                        }`}
                      />
                      {formErrors.phone && <span className="text-xs text-red-500 mt-1 block">{formErrors.phone}</span>}
                    </div>

                    {/* Street Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Flat / House No. & Street Address *</label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({ street: e.target.value })}
                        placeholder="House No, Apartment name, Street"
                        className={`w-full p-3.5 rounded-xl border text-sm outline-none transition-colors ${
                          formErrors.street ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-[#2F5D34]"
                        }`}
                      />
                      {formErrors.street && <span className="text-xs text-red-500 mt-1 block">{formErrors.street}</span>}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">City *</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ city: e.target.value })}
                        placeholder="Mumbai"
                        className={`w-full p-3.5 rounded-xl border text-sm outline-none transition-colors ${
                          formErrors.city ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-[#2F5D34]"
                        }`}
                      />
                      {formErrors.city && <span className="text-xs text-red-500 mt-1 block">{formErrors.city}</span>}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">State *</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ state: e.target.value })}
                        placeholder="Maharashtra"
                        className={`w-full p-3.5 rounded-xl border text-sm outline-none transition-colors ${
                          formErrors.state ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-[#2F5D34]"
                        }`}
                      />
                      {formErrors.state && <span className="text-xs text-red-500 mt-1 block">{formErrors.state}</span>}
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">PIN Code *</label>
                      <input
                        type="text"
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({ pincode: e.target.value })}
                        placeholder="400050"
                        className={`w-full p-3.5 rounded-xl border text-sm outline-none transition-colors ${
                          formErrors.pincode ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-[#2F5D34]"
                        }`}
                      />
                      {formErrors.pincode && <span className="text-xs text-red-500 mt-1 block">{formErrors.pincode}</span>}
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Country</label>
                      <input
                        type="text"
                        disabled
                        value="India"
                        className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-100 text-sm font-bold text-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Method Selection */}
                <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 border border-white shadow-xl">
                  <h3 className="text-2xl font-bold uppercase text-[#2F5D34] mb-6 pb-3 border-b border-[#2F5D34]/15">
                    Delivery Speed
                  </h3>

                  <div className="flex flex-col gap-4">
                    {/* Standard Delivery */}
                    <label
                      onClick={() => setDeliveryMethod("standard")}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        deliveryMethod === "standard"
                          ? "border-[#2F5D34] bg-[#E8F2E3]/50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === "standard"}
                          onChange={() => setDeliveryMethod("standard")}
                          className="size-5 accent-[#2F5D34]"
                        />
                        <div>
                          <h4 className="font-bold text-[#222123] text-base">Standard Shipping (3-5 Business Days)</h4>
                          <p className="text-xs font-paragraph text-gray-600 mt-0.5">Reliable surface delivery via Express Logistics.</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#2F5D34] text-sm">
                        {subtotal > 499 ? "FREE" : "₹49"}
                      </span>
                    </label>

                    {/* Express Air Delivery */}
                    <label
                      onClick={() => setDeliveryMethod("express")}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        deliveryMethod === "express"
                          ? "border-[#2F5D34] bg-[#E8F2E3]/50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === "express"}
                          onChange={() => setDeliveryMethod("express")}
                          className="size-5 accent-[#2F5D34]"
                        />
                        <div>
                          <h4 className="font-bold text-[#222123] text-base">Express Air Courier (1-2 Business Days)</h4>
                          <p className="text-xs font-paragraph text-gray-600 mt-0.5">Priority dispatch with thermal temperature control.</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#2F5D34] text-sm">₹99</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary Sidebar */}
              <div className="w-full lg:w-2/5 sticky top-28 bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-6 sm:p-8 shadow-2xl">
                <h3 className="text-2xl font-bold uppercase text-[#2F5D34] mb-6 pb-4 border-b border-[#2F5D34]/15">
                  Order Summary
                </h3>

                {/* Item List Preview */}
                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                  {populatedItems.map(({ productId, quantity, product }) => (
                    <div key={productId} className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative size-14 rounded-xl overflow-hidden bg-gray-100 flex-none border border-gray-200">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          <span className="absolute top-0 right-0 bg-[#2F5D34] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                            {quantity}x
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#222123] text-xs line-clamp-1">{product.name}</h4>
                          <span className="text-[11px] text-gray-500">₹{product.price} each</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#2F5D34] text-sm">₹{(product.price * quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Entry */}
                <form onSubmit={handleApplyPromo} className="mb-6 pt-4 border-t border-gray-100 flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="PROMO CODE (AYURVEDA10)"
                    className="flex-1 p-3 rounded-xl border border-gray-200 text-xs font-bold uppercase outline-none focus:border-[#2F5D34]"
                  />
                  <button type="submit" className="px-4 py-3 rounded-xl bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#224426] transition-all">
                    Apply
                  </button>
                </form>

                {/* Price Breakdown */}
                <div className="flex flex-col gap-3 text-sm font-paragraph text-gray-700 pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-[#222123]">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span className="font-bold text-[#2F5D34]">{shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST Tax (5%)</span>
                    <span className="font-bold text-[#222123]">₹{tax.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Promo Discount ({couponCode})</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline text-xl font-bold text-[#2F5D34]">
                    <span>Grand Total</span>
                    <span className="text-3xl text-[#2F5D34]">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Continue to Payment CTA */}
                <button
                  onClick={handleProceedToPayment}
                  className="mt-8 w-full py-4.5 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:shadow-[0_15px_35px_rgba(47,93,52,0.4)] hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>🔒 Proceed to Payment</span>
                </button>
              </div>
            </div>
          )}
        </section>

        <FooterSection />
      </main>
    </ProtectedRoute>
  );
}
