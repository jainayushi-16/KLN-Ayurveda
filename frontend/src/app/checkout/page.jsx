"use client";

import { useState, useEffect, useRef, Suspense } from "react";
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
import { profileApi } from "@/services/profile.api";
import { getStoredAddresses, addStoredAddress } from "@/utils/addressStorage";
import { validateEmail, validatePhone } from "@/utils/validators";
import { useLanguage } from "@/i18n/LanguageContext";
import toast from "react-hot-toast";

function CheckoutContent() {
  const router = useRouter();
  const { t } = useLanguage();
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

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState(getStoredAddresses());
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState(null);
  const [saveToAddressBook, setSaveToAddressBook] = useState(false);
  const [isChangingPreference, setIsChangingPreference] = useState(false);

  const isBuyNowMode = isBuyNowParam || Boolean(activeBuyNowItem);
  const checkoutItems = isBuyNowMode ? (activeBuyNowItem ? [activeBuyNowItem] : []) : cartItems;
  const effectiveSubtotal = isBuyNowMode ? (activeBuyNowItem ? activeBuyNowItem.subtotal : 0) : cartSubtotal;
  const effectiveTotalCount = isBuyNowMode ? (activeBuyNowItem ? activeBuyNowItem.quantity : 0) : totalItemsCount;

  const userKey = authUser?.id || authUser?.email || "";
  const hasLoadedAddressesRef = useRef(false);
  const hasValidatedPromoRef = useRef(false);

  // Auto-prefill & load saved addresses for logged-in user (runs once per user mount)
  useEffect(() => {
    if (hasLoadedAddressesRef.current && userKey) return;
    if (userKey) hasLoadedAddressesRef.current = true;

    async function loadUserDataAndAddresses() {
      const stored = getStoredAddresses();
      let combined = [...stored];

      if (authUser) {
        const userFullName = `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || authUser.fullName || "";
        setShippingAddress({
          fullName: shippingAddress.fullName || userFullName,
          phone: shippingAddress.phone || authUser.phone || "",
          email: shippingAddress.email || authUser.email || "",
          country: shippingAddress.country || "India",
        });

        try {
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
          const res = await Promise.race([profileApi.getAddresses(), timeoutPromise]);
          const list = res?.data || [];
          if (Array.isArray(list) && list.length > 0) {
            combined = list;
          }
        } catch (e) {
          console.warn("Failed to fetch saved addresses note:", e);
        }
      }

      setSavedAddresses(combined);
      const defaultAddr = combined.find((a) => a.isDefault) || combined[0];
      if (defaultAddr && !shippingAddress.street) {
        setSelectedSavedAddressId(defaultAddr.id);
        handleSelectSavedAddress(defaultAddr);
      }
    }

    loadUserDataAndAddresses();
  }, [userKey]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedSavedAddressId(addr.id);
    setShippingAddress({
      fullName: addr.fullName || `${authUser?.firstName || ''} ${authUser?.lastName || ''}`.trim(),
      phone: addr.phone || authUser?.phone || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || addr.postalCode || "",
      country: addr.country || "India",
      addressType: addr.title || addr.type || "Home",
    });
    setIsChangingPreference(false);
  };

  const handleNewAddress = () => {
    setSelectedSavedAddressId(null);
    setShippingAddress({
      fullName: `${authUser?.firstName || ''} ${authUser?.lastName || ''}`.trim() || authUser?.fullName || "",
      phone: authUser?.phone || "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      addressType: "Home",
    });
  };

  const hasLoadedBuyNowRef = useRef(false);

  useEffect(() => {
    if (hasLoadedBuyNowRef.current) return;
    hasLoadedBuyNowRef.current = true;
    const stored = loadFromStorage();
    const current = buyNowItem || stored;
    if (current) {
      setActiveBuyNowItem(current);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (buyNowItem) {
      setActiveBuyNowItem(buyNowItem);
    }
  }, [buyNowItem]);

  // Handle invalid/missing product data gracefully by redirecting to /shop
  useEffect(() => {
    if (isHydrated && isBuyNowParam) {
      const currentItem = activeBuyNowItem || buyNowItem;
      if (!currentItem || !currentItem.productId) {
        toast.error("No selected product found for Buy Now. Redirecting to shop.");
        router.push("/shop");
      }
    }
  }, [isHydrated, isBuyNowParam, activeBuyNowItem, buyNowItem, router]);

  // Auto-validate promo code ONCE when Checkout loads (prevents infinite re-render loops)
  useEffect(() => {
    if (hasValidatedPromoRef.current) return;

    let codeToValidate = couponCode || promoInput;
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("kln_applied_coupon");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.code || parsed.discountAmount !== undefined)) {
            codeToValidate = parsed.code || codeToValidate;
            setAppliedCouponDetails(parsed);
          }
        }
      } catch (e) {}
    }

    if (!codeToValidate) {
      hasValidatedPromoRef.current = true;
      return;
    }

    async function autoValidate() {
      hasValidatedPromoRef.current = true;
      if (codeToValidate && checkoutItems.length > 0) {
        try {
          const res = await offerApi.validateCoupon(codeToValidate.trim().toUpperCase(), checkoutItems);
          const data = res?.data || res;
          if (data && (data.valid || data.discountAmount !== undefined)) {
            setAppliedCouponDetails(data);
            useCartStore.setState({ appliedCoupon: data, couponDiscount: data.discountAmount || 0 });
          }
        } catch (err) {
          console.warn("Auto promo validation note:", err);
        }
      }
    }

    if (isHydrated && checkoutItems.length > 0) {
      autoValidate();
    }
  }, [isHydrated, checkoutItems.length]);

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
    if (!shippingAddress.fullName || !shippingAddress.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    const phoneRes = validatePhone(shippingAddress.phone);
    if (!phoneRes.isValid) {
      errors.phone = phoneRes.error;
    }

    if (shippingAddress.email) {
      const emailRes = validateEmail(shippingAddress.email);
      if (!emailRes.isValid) {
        errors.email = emailRes.error;
      }
    }

    if (!shippingAddress.street || !shippingAddress.street.trim()) {
      errors.street = "Street address is required";
    }
    if (!shippingAddress.city || !shippingAddress.city.trim()) {
      errors.city = "City is required";
    }
    if (!shippingAddress.state || !shippingAddress.state.trim()) {
      errors.state = "State is required";
    }
    if (!shippingAddress.pincode || !shippingAddress.pincode.trim() || shippingAddress.pincode.length < 6) {
      errors.pincode = "Valid 6-digit PIN code is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    hasValidatedPromoRef.current = true;
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

    // Optionally save new address to user address book
    if (saveToAddressBook) {
      try {
        await profileApi.addAddress({
          title: shippingAddress.addressType || "Home",
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.pincode,
          country: shippingAddress.country || "India",
          isDefault: false,
        });
        toast.success("Address saved to your Address Book!", { icon: "🏡" });
      } catch (e) {
        console.warn("Save address note:", e);
      }
    }

    // Save shipping address to order store
    useOrderStore.getState().setShippingAddress({
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      street: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: shippingAddress.pincode,
      country: shippingAddress.country || "India",
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
      <section className="py-8 sm:py-10 w-full px-6 md:px-12 lg:px-16 relative z-10">
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
                {/* Saved Address Preference asked ONCE */}
                {savedAddresses.length > 0 && selectedSavedAddressId && !isChangingPreference ? (
                  <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border-2 border-[#2F5D34] bg-[#E8F2E3]/40 shadow-xl">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2F5D34]/20">
                      <div className="flex items-center gap-2">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                          <span>📍</span> Preferred Address: {shippingAddress.addressType || "Home"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsChangingPreference(true)}
                        className="text-xs font-bold text-[#2F5D34] hover:underline bg-white px-3.5 py-1.5 rounded-full border border-[#2F5D34]/30 shadow-xs cursor-pointer"
                      >
                        Change Preference ✎
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-[#222123]">{shippingAddress.fullName}</h4>
                      <p className="text-xs sm:text-sm text-gray-700 font-paragraph">{shippingAddress.street}</p>
                      <p className="text-xs sm:text-sm text-gray-700 font-paragraph">{shippingAddress.city}, {shippingAddress.state} - <strong className="font-bold">{shippingAddress.pincode}</strong></p>
                      <p className="text-xs text-gray-500 font-paragraph pt-1">
                        Country: <strong>{shippingAddress.country || "India"}</strong> | Phone: <strong>{shippingAddress.phone}</strong>
                      </p>
                    </div>
                  </div>
                ) : savedAddresses.length > 0 ? (
                  <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 pb-3 border-b border-[#2F5D34]/15 gap-2">
                      <div>
                        <h4 className="text-base font-bold uppercase tracking-wider text-[#2F5D34] flex items-center gap-2">
                          <span>📍</span> Delivery Address Preferences
                        </h4>
                        <p className="text-xs text-gray-500 font-paragraph mt-0.5">
                          Select a saved address preference to auto-fill your shipping details.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedSavedAddressId && (
                          <button
                            type="button"
                            onClick={() => setIsChangingPreference(false)}
                            className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleNewAddress}
                          className="text-xs font-bold text-[#2F5D34] bg-[#E8F2E3] px-3.5 py-1.5 rounded-full border border-[#2F5D34]/20 hover:bg-[#2F5D34] hover:text-white transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <span>+</span> Enter New Address
                        </button>
                      </div>
                    </div>

                    {/* 1. Quick Dropdown Selector */}
                    <div className="mb-4">
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                        Select Address Preference
                      </label>
                      <select
                        value={selectedSavedAddressId || "new"}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "new") {
                            handleNewAddress();
                          } else {
                            const found = savedAddresses.find((a) => a.id === val);
                            if (found) handleSelectSavedAddress(found);
                          }
                        }}
                        className="w-full p-3.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#222123] outline-none focus:border-[#2F5D34] shadow-xs cursor-pointer"
                      >
                        {savedAddresses.map((addr) => {
                          const titleText = addr.title || addr.type || "Address";
                          const isHome = titleText.toLowerCase().includes("home");
                          const isWork = titleText.toLowerCase().includes("work") || titleText.toLowerCase().includes("office");
                          const tagIcon = isHome ? "🏡 Home" : isWork ? "🏢 Work" : "📍 Other";
                          return (
                            <option key={addr.id} value={addr.id}>
                              {tagIcon}: {addr.fullName} — {addr.street}, {addr.city} ({addr.pincode || addr.postalCode})
                            </option>
                          );
                        })}
                        <option value="new">➕ + Enter New Address</option>
                      </select>
                    </div>

                    {/* 2. Visual Address Radio Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedSavedAddressId === addr.id;
                        const labelText = addr.title || addr.type || "Saved Address";
                        const isHome = labelText.toLowerCase().includes("home");
                        const isWork = labelText.toLowerCase().includes("work") || labelText.toLowerCase().includes("office");

                        return (
                          <div
                            key={addr.id}
                            onClick={() => handleSelectSavedAddress(addr)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "border-[#2F5D34] bg-[#E8F2E3]/70 shadow-md ring-2 ring-[#2F5D34]/20"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#2F5D34] flex items-center gap-1.5">
                                {isHome ? "🏡 Home" : isWork ? "🏢 Work" : "📍 Other"}
                                {addr.isDefault && " (Default)"}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-bold text-[#2F5D34] bg-white px-2 py-0.5 rounded-full border border-[#2F5D34]/30 shadow-xs">
                                  ✓ Selected
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-bold text-gray-800">{addr.fullName}</p>
                            <p className="text-xs text-gray-600 line-clamp-2 font-paragraph mt-0.5">{addr.street}, {addr.city}, {addr.state} - {addr.pincode || addr.postalCode}</p>
                            <p className="text-[11px] text-gray-500 font-paragraph mt-1">Country: {addr.country || "India"}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

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
                        placeholder="e.g. 9876543210"
                        className={`w-full p-3.5 rounded-xl border text-sm outline-none transition-colors ${
                          formErrors.phone ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-[#2F5D34]"
                        }`}
                      />
                      {formErrors.phone && <span className="text-xs text-red-500 mt-1 block">{formErrors.phone}</span>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={shippingAddress.email || ""}
                        onChange={(e) => setShippingAddress({ email: e.target.value })}
                        placeholder="e.g. aarav@example.com"
                        className={`w-full p-3.5 rounded-xl border text-sm outline-none transition-colors ${
                          formErrors.email ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-[#2F5D34]"
                        }`}
                      />
                      {formErrors.email && <span className="text-xs text-red-500 mt-1 block">{formErrors.email}</span>}
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

                    {/* Country - Editable */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Country *</label>
                      <input
                        type="text"
                        value={shippingAddress.country || "India"}
                        onChange={(e) => setShippingAddress({ country: e.target.value })}
                        placeholder="e.g. India, United States, UAE"
                        className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#2F5D34] text-sm outline-none transition-colors font-medium text-gray-800"
                      />
                    </div>

                    {/* Save to Address Book Checkbox */}
                    <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="saveToBook"
                        checked={saveToAddressBook}
                        onChange={(e) => setSaveToAddressBook(e.target.checked)}
                        className="w-4 h-4 rounded text-[#2F5D34] focus:ring-[#2F5D34]"
                      />
                      <label htmlFor="saveToBook" className="text-xs font-semibold text-gray-700 cursor-pointer">
                        Save this address to my Address Book for future orders
                      </label>
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
