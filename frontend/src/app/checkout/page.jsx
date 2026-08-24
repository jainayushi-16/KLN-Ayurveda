"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useBuyNowStore } from "@/store/useBuyNowStore";
import { PRODUCTS } from "@/data/products";
import offerApi from "@/services/offer.api";
import toast from "react-hot-toast";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNowParam = searchParams.get("buyNow") === "true";

  const { user: authUser } = useAuthStore();
  const { items: cartItems, totalItems: totalItemsCount, subtotal: cartSubtotal, updateQuantity: updateCartQuantity, removeItem: removeCartItem } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { shippingAddress, setShippingAddress, deliveryMethod, setDeliveryMethod, couponCode, discountPercent, applyCoupon } = useOrderStore();
  const { buyNowItem, updateBuyNowQuantity, clearBuyNow, loadFromStorage } = useBuyNowStore();

  const [activeBuyNowItem, setActiveBuyNowItem] = useState(buyNowItem);
  const [isHydrated, setIsHydrated] = useState(false);
  const [promoInput, setPromoInput] = useState(couponCode);
  const [appliedCouponDetails, setAppliedCouponDetails] = useState(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const isBuyNowMode = isBuyNowParam || Boolean(activeBuyNowItem);
  const checkoutItems = isBuyNowMode ? (activeBuyNowItem ? [activeBuyNowItem] : []) : cartItems;
  const effectiveSubtotal = isBuyNowMode ? (activeBuyNowItem ? activeBuyNowItem.subtotal : 0) : cartSubtotal;
  const effectiveTotalCount = isBuyNowMode ? (activeBuyNowItem ? activeBuyNowItem.quantity : 0) : totalItemsCount;

  // Auto-prefill shipping details from logged-in user profile
  useEffect(() => {
    if (authUser) {
      const userFullName = `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || authUser.fullName || "";
      setShippingAddress({
        fullName: shippingAddress.fullName || userFullName,
        phone: shippingAddress.phone || authUser.phone || "",
        email: shippingAddress.email || authUser.email || "",
      });
    }
  }, [authUser]);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setActiveBuyNowItem(stored);
    }
    setIsHydrated(true);
  }, [loadFromStorage]);

  useEffect(() => {
    if (buyNowItem) {
      setActiveBuyNowItem(buyNowItem);
    }
  }, [buyNowItem]);

  // Handle invalid/missing product data gracefully by redirecting to /shop
  useEffect(() => {
    if (isHydrated && isBuyNowParam && (!activeBuyNowItem || !activeBuyNowItem.productId)) {
      toast.error("No selected product found for Buy Now. Redirecting to shop.");
      router.push("/shop");
    }
  }, [isHydrated, isBuyNowParam, activeBuyNowItem, router]);

  // Auto-validate promo code from Cart or Store when Checkout loads
  useEffect(() => {
    async function autoValidate() {
      const codeToValidate = couponCode || promoInput;
      if (codeToValidate && checkoutItems.length > 0) {
        try {
          const res = await offerApi.validateCoupon(codeToValidate.trim().toUpperCase(), checkoutItems);
          const data = res.data || res;
          if (data && (data.valid || data.discountAmount !== undefined)) {
            setAppliedCouponDetails(data);
            applyCoupon(data.code || codeToValidate.toUpperCase(), data.discountPercent || 0);
            useCartStore.setState({ appliedCoupon: data, couponDiscount: data.discountAmount || 0 });
            if (typeof window !== "undefined") {
              try {
                sessionStorage.setItem("kln_applied_coupon", JSON.stringify(data));
              } catch (e) {}
            }
          }
        } catch (err) {
          console.warn("Auto promo validation note:", err);
        }
      }
    }
    if (isHydrated) {
      autoValidate();
    }
  }, [isHydrated, couponCode, checkoutItems.length]);

  const isFreeShip = appliedCouponDetails && appliedCouponDetails.isFreeShipping;
  const shippingCost = deliveryMethod === "express" ? 99 : isFreeShip ? 0 : effectiveSubtotal > 499 || effectiveSubtotal === 0 ? 0 : 49;
  const discountAmount = appliedCouponDetails
    ? Number(appliedCouponDetails.discountAmount || 0)
    : Number((effectiveSubtotal * discountPercent).toFixed(2));
  const taxableAmount = Math.max(0, effectiveSubtotal - discountAmount);
  const tax = Number((taxableAmount * 0.05).toFixed(2));
  const grandTotal = Math.max(0, Number((taxableAmount + shippingCost + tax).toFixed(2)));

  const getSafeImageUrl = (img) => {
    if (!img) return "/images/products/hairoil/oilf.jpeg";
    if (typeof img === "string") return img;
    if (typeof img === "object" && img.url) return img.url;
    return "/images/products/hairoil/oilf.jpeg";
  };

  const populatedItems = (checkoutItems || []).filter(Boolean).map((item) => {
    const matched = PRODUCTS.find((p) => p.id === item.productId);
    const rawImage = matched?.images?.[0] || item.image || item.imageUrl || (Array.isArray(item.images) ? item.images[0] : item.images) || "/images/products/hairoil/oilf.jpeg";
    const imageSrc = getSafeImageUrl(rawImage);

    return {
      ...item,
      product: {
        name: matched?.name || item.name || "Ayurvedic Formulation",
        price: Number(matched?.price || item.price || 0),
        images: [imageSrc],
      },
      imageSrc,
    };
  });

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (isBuyNowMode) {
      if (newQuantity < 1) {
        clearBuyNow();
        router.push("/shop");
      } else {
        const updated = updateBuyNowQuantity(newQuantity);
        if (updated) setActiveBuyNowItem(updated);
      }
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    if (isBuyNowMode) {
      clearBuyNow();
      router.push("/shop");
    } else {
      removeCartItem(productId);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!shippingAddress.fullName.trim()) errors.fullName = "Full name is required";
    if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 10) errors.phone = "Valid 10-digit phone number is required";
    if (!shippingAddress.street.trim()) errors.street = "Street address is required";
    if (!shippingAddress.city.trim()) errors.city = "City is required";
    if (!shippingAddress.state.trim()) errors.state = "State is required";
    if (!shippingAddress.pincode.trim() || shippingAddress.pincode.length < 6) errors.pincode = "Valid 6-digit PIN code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    try {
      setIsValidatingPromo(true);
      const res = await offerApi.validateCoupon(promoInput.trim().toUpperCase(), checkoutItems);
      const data = res.data || res;
      if (data && (data.valid || data.discountAmount !== undefined)) {
        setAppliedCouponDetails(data);
        applyCoupon(data.code || promoInput.toUpperCase(), data.discountPercent || 0);
        useCartStore.setState({ appliedCoupon: data, couponDiscount: data.discountAmount || 0 });
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("kln_applied_coupon", JSON.stringify(data));
          } catch (e) {}
        }
        toast.success(res.message || `Coupon '${data.code || promoInput}' applied successfully! 🌿`);
      } else {
        toast.error(res.message || "Invalid or expired promo code");
      }
    } catch (err) {
      console.error("Promo validation error:", err);
      toast.error(err.message || "Invalid or expired promo code");
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedCouponDetails(null);
    setPromoInput("");
    applyCoupon("", 0);
    useCartStore.setState({ appliedCoupon: null, couponDiscount: 0 });
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("kln_applied_coupon");
      } catch (e) {}
    }
    toast.success("Coupon code removed.");
  };

  const handleProceedToPayment = async () => {
    if (checkoutItems.length === 0) {
      toast.error("Your checkout is empty!");
      return;
    }
    if (!validateForm()) {
      toast.error("Please fill in all required shipping address fields.");
      return;
    }

    // Save shipping address to order store
    useOrderStore.getState().setShippingAddress({
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      street: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: shippingAddress.pincode,
      country: shippingAddress.country,
    });

    if (isBuyNowMode) {
      router.push("/payment?buyNow=true");
    } else {
      router.push("/payment");
    }
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
      {/* Navbar */}
      <ShopNavBar cartCount={totalItemsCount} wishlistCount={wishlistIds.length} />

      {/* Header Progress Tracker */}
      <section className="pt-12 pb-8 w-full px-6 md:px-12 lg:px-16 relative z-10">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#2F5D34]/15 pb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-white px-4 py-1.5 rounded-full border border-[#5B7C3A]/20 shadow-sm">
              Step 2 of 3 {isBuyNowMode && "• Instant Checkout"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold uppercase text-[#2F5D34] mt-2 tracking-tight">
              Shipping Address
            </h1>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
            <Link href={isBuyNowMode ? "/shop" : "/cart"} className="text-gray-400 hover:text-[#2F5D34] flex items-center gap-1.5">
              <span>{isBuyNowMode ? "1. Shop" : "1. Cart"}</span>
            </Link>
            <span className="text-gray-300">→</span>
            <span className="px-4 py-2 rounded-full bg-[#2F5D34] text-white shadow-md">
              2. Shipping
            </span>
            <span className="text-gray-300">→</span>
            <span className="text-gray-400">3. Payment</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="pb-28 w-full px-6 md:px-12 lg:px-16 relative z-10">
        <div className="max-w-[1800px] mx-auto">
          {checkoutItems.length === 0 ? (
            <div className="text-center py-24 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-[#2F5D34]/30 max-w-xl mx-auto shadow-sm">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-[#222123] mb-3">No Product Selected for Checkout</h2>
              <p className="text-gray-600 text-sm mb-6">Please select a formulation to proceed to checkout.</p>
              <Link href="/shop">
                <button className="px-8 py-3.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#224426] transition-all">
                  Return to Shop
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              {/* Left Column: Form & Options */}
              <div className="w-full lg:w-3/5 flex flex-col gap-8">
                {/* Address Form Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 border border-white shadow-xl">
                  <h3 className="text-2xl font-bold uppercase text-[#2F5D34] mb-6 pb-3 border-b border-[#2F5D34]/15">
                    Shipping Details
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
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Street Address *</label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({ street: e.target.value })}
                        placeholder="Flat 402, Lotus Residency, MG Road"
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

                  <div className="flex flex-col sm:flex-row gap-4">
                    <label
                      className={`flex-1 p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        deliveryMethod === "standard" ? "border-[#2F5D34] bg-[#E8F2E3]/30 shadow-md" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === "standard"}
                          onChange={() => setDeliveryMethod("standard")}
                          className="accent-[#2F5D34] size-4"
                        />
                        <div>
                          <span className="block font-bold text-[#222123] text-sm">Standard Shipping</span>
                          <span className="text-xs text-gray-500">3 - 5 Business Days</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#2F5D34] text-sm">
                        {effectiveSubtotal > 499 ? "FREE" : "₹49"}
                      </span>
                    </label>

                    <label
                      className={`flex-1 p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        deliveryMethod === "express" ? "border-[#2F5D34] bg-[#E8F2E3]/30 shadow-md" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === "express"}
                          onChange={() => setDeliveryMethod("express")}
                          className="accent-[#2F5D34] size-4"
                        />
                        <div>
                          <span className="block font-bold text-[#222123] text-sm">Express Priority</span>
                          <span className="text-xs text-gray-500">1 - 2 Business Days</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#2F5D34] text-sm">₹99</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary Sidebar */}
              <div className="w-full lg:w-2/5 sticky top-28 bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-6 sm:p-8 shadow-2xl">
                <h3 className="text-2xl font-bold uppercase text-[#2F5D34] mb-4 pb-3 border-b border-[#2F5D34]/15">
                  Order Summary {isBuyNowMode && "(Buy Now)"}
                </h3>

                {/* Item List Preview with Controls */}
                <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1 mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    {isBuyNowMode ? "Selected Product:" : "Items in Order:"}
                  </span>
                  {populatedItems.map(({ productId, quantity, product, variant }) => (
                    <div key={productId} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                      <div className="flex items-center gap-2 max-w-[55%]">
                        <div className="relative size-12 rounded-xl overflow-hidden bg-white flex-none border border-gray-200">
                          <Image src={product?.images?.[0] || "/images/products/hairoil/oilf.jpeg"} alt={product?.name || "Product"} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#222123] text-xs line-clamp-1">{product.name}</h4>
                          {variant && <span className="text-[10px] text-gray-500 block">Variant: {variant}</span>}
                          <span className="text-[#2F5D34] font-bold">₹{(product.price * quantity).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* In-Summary Quantity Controls & Remove */}
                      <div className="flex items-center gap-1.5 flex-none">
                        <div className="flex items-center border border-[#2F5D34]/20 rounded-full px-1.5 py-0.5 bg-white">
                          <button
                            onClick={() => handleUpdateQuantity(productId, Math.max(0, quantity - 1))}
                            className="size-5 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-700 hover:bg-[#2F5D34] hover:text-white transition-colors"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold text-xs text-[#222123]">{quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(productId, quantity + 1)}
                            className="size-5 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-700 hover:bg-[#2F5D34] hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(productId)}
                          className="text-xs text-red-500 hover:text-red-700 p-1"
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Entry */}
                <div className="mb-6 pt-4 border-t border-gray-100">
                  {appliedCouponDetails ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#E8F2E3] border border-[#2F5D34]/30 text-xs">
                      <div>
                        <span className="font-extrabold text-[#2F5D34] block">
                          ✓ Coupon '{appliedCouponDetails.code}' Applied
                        </span>
                        <span className="text-[11px] text-[#2F5D34]/80">
                          {appliedCouponDetails.isFreeShipping ? 'Free Express Shipping Enabled' : `Saved ₹${discountAmount.toFixed(2)} OFF`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-xs font-bold text-red-600 hover:underline px-2 py-1 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="PROMO CODE (e.g. KLN10, KLN20)"
                        className="flex-1 p-3 rounded-xl border border-gray-200 text-xs font-bold uppercase outline-none focus:border-[#2F5D34]"
                      />
                      <button
                        type="submit"
                        disabled={isValidatingPromo}
                        className="px-4 py-3 rounded-xl bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#224426] transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isValidatingPromo ? "..." : "Apply"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="flex flex-col gap-3 text-sm font-paragraph text-gray-700 pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span>Total Quantity</span>
                    <span className="font-bold text-[#222123]">{effectiveTotalCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#222123]">₹{effectiveSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping ({deliveryMethod === "express" ? "Express" : "Standard"})</span>
                    <span className="font-bold text-[#2F5D34]">
                      {shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Tax (5%)</span>
                    <span className="font-bold text-[#222123]">₹{tax.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Discount ({couponCode})</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline text-xl font-bold text-[#2F5D34]">
                    <span>Grand Total</span>
                    <span className="text-3xl text-[#2F5D34]">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-3">
                  <button
                    onClick={handleProceedToPayment}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:shadow-[0_15px_35px_rgba(47,93,52,0.4)] hover:scale-102 active:scale-95 transition-all duration-300"
                  >
                    Proceed to Payment →
                  </button>
                  <Link href={isBuyNowMode ? "/shop" : "/cart"}>
                    <button className="w-full py-3.5 rounded-full border-2 border-gray-300 text-gray-600 hover:border-[#2F5D34] hover:text-[#2F5D34] font-bold text-xs uppercase tracking-wider transition-all text-center block">
                      {isBuyNowMode ? "← Return to Shop" : "← Modify Cart Items"}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute pageTitle="Checkout">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F4EC]">
          <div className="text-center">
            <span className="text-4xl animate-bounce">🌿</span>
            <p className="mt-2 text-sm font-bold text-[#2F5D34]">Loading Checkout...</p>
          </div>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </ProtectedRoute>
  );
}
