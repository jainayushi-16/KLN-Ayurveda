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
import { useBuyNowStore } from "@/store/useBuyNowStore";
import { PRODUCTS } from "@/data/products";
import toast from "react-hot-toast";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNowParam = searchParams.get("buyNow") === "true";

  const { items: cartItems, totalItems: totalItemsCount, subtotal: cartSubtotal, updateQuantity: updateCartQuantity, removeItem: removeCartItem, clearCart } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { shippingAddress, deliveryMethod, discountPercent, placeOrder } = useOrderStore();
  const { buyNowItem, updateBuyNowQuantity, clearBuyNow, loadFromStorage } = useBuyNowStore();

  const [activeBuyNowItem, setActiveBuyNowItem] = useState(buyNowItem);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("upi"); // "upi" | "card" | "netbanking" | "cod"
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [isProcessing, setIsProcessing] = useState(false);

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

  const isBuyNowMode = isBuyNowParam || Boolean(activeBuyNowItem);

  useEffect(() => {
    if (isHydrated && isBuyNowParam && (!activeBuyNowItem || !activeBuyNowItem.productId)) {
      toast.error("No selected product found. Redirecting to shop.");
      router.push("/shop");
    }
  }, [isHydrated, isBuyNowParam, activeBuyNowItem, router]);

  const payableItems = isBuyNowMode ? (activeBuyNowItem ? [activeBuyNowItem] : []) : cartItems;
  const effectiveSubtotal = isBuyNowMode ? (activeBuyNowItem ? activeBuyNowItem.subtotal : 0) : cartSubtotal;

  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const isFreeShip = appliedCoupon && appliedCoupon.isFreeShipping;
  const shippingCost = deliveryMethod === "express" ? 99 : isFreeShip ? 0 : effectiveSubtotal > 499 || effectiveSubtotal === 0 ? 0 : 49;
  const discountAmount = appliedCoupon
    ? Number(appliedCoupon.discountAmount || 0)
    : Number((effectiveSubtotal * discountPercent).toFixed(2));
  const taxableAmount = Math.max(0, effectiveSubtotal - discountAmount);
  const tax = Number((taxableAmount * 0.05).toFixed(2));
  const grandTotal = Math.max(0, Number((taxableAmount + shippingCost + tax).toFixed(2)));

  const populatedItems = payableItems.map((item) => {
    const matched = PRODUCTS.find((p) => p.id === item.productId);
    return {
      ...item,
      product: matched || {
        name: item.name,
        price: item.price,
        images: [item.image || "/images/products/hairoil/oilf.jpeg"],
      },
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

  const handlePayNow = async () => {
    if (payableItems.length === 0) {
      toast.error("Your payment checkout is empty!");
      return;
    }

    if (selectedMethod === "upi" && !upiId.trim()) {
      toast.error("Please enter a valid UPI ID (e.g. user@upi)");
      return;
    }

    if (selectedMethod === "card" && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim())) {
      toast.error("Please enter complete credit/debit card details.");
      return;
    }

    setIsProcessing(true);
    toast.loading("Processing secure payment...", { id: "payment_toast" });

    try {
      const paymentDetails = {
        method: selectedMethod,
        transactionId: "TXN" + Date.now(),
        paidAmount: grandTotal,
      };

      const order = await placeOrder(payableItems, grandTotal, paymentDetails);
      toast.dismiss("payment_toast");
      toast.success("Payment Successful! Order Confirmed. 🎉");

      if (isBuyNowMode) {
        clearBuyNow();
      } else {
        clearCart();
      }

      setIsProcessing(false);
      router.push(`/order-success?orderId=${order.orderId || order.id}`);
    } catch (err) {
      toast.dismiss("payment_toast");
      toast.error("Payment failed. Please try again.");
      setIsProcessing(false);
      console.error("Payment error:", err);
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
              Step 3 of 3 {isBuyNowMode && "• Instant Checkout"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold uppercase text-[#2F5D34] mt-2 tracking-tight">
              Secure Payment
            </h1>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
            <Link href={isBuyNowMode ? "/shop" : "/cart"} className="text-gray-400 hover:text-[#2F5D34]">
              {isBuyNowMode ? "1. Shop" : "1. Cart"}
            </Link>
            <span className="text-gray-300">→</span>
            <Link href={isBuyNowMode ? "/checkout?buyNow=true" : "/checkout"} className="text-gray-400 hover:text-[#2F5D34]">
              2. Shipping
            </Link>
            <span className="text-gray-300">→</span>
            <span className="px-4 py-2 rounded-full bg-[#2F5D34] text-white shadow-md">
              3. Payment
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="pb-28 w-full px-6 md:px-12 lg:px-16 relative z-10">
        <div className="max-w-[1800px] mx-auto">
          {payableItems.length === 0 ? (
            <div className="text-center py-24 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-[#2F5D34]/30 max-w-xl mx-auto shadow-sm">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-[#222123] mb-3">No Items to Process Payment</h2>
              <p className="text-gray-600 text-sm mb-6">No active product selection found for payment.</p>
              <Link href="/shop">
                <button className="px-8 py-3.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#224426] transition-all">
                  Return to Shop
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              {/* Left Column: Payment Methods */}
              <div className="w-full lg:w-3/5 flex flex-col gap-6">
                {/* UPI Method */}
                <div
                  className={`bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border-2 transition-all cursor-pointer ${
                    selectedMethod === "upi" ? "border-[#2F5D34] shadow-xl" : "border-white/80 shadow-md"
                  }`}
                  onClick={() => setSelectedMethod("upi")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input type="radio" checked={selectedMethod === "upi"} onChange={() => setSelectedMethod("upi")} className="size-5 accent-[#2F5D34]" />
                      <div>
                        <h4 className="font-bold text-[#222123] text-lg">UPI Instant Payment</h4>
                        <p className="text-xs font-paragraph text-gray-500">GPay, PhonePe, Paytm, BHIM UPI</p>
                      </div>
                    </div>
                    <span className="text-2xl">⚡</span>
                  </div>

                  {selectedMethod === "upi" && (
                    <div className="mt-6 pt-6 border-t border-gray-100 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Enter Virtual Payment Address (VPA)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@apl / username@okhdfcbank"
                        className="w-full p-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2F5D34]"
                      />
                    </div>
                  )}
                </div>

                {/* Credit / Debit Card Method */}
                <div
                  className={`bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border-2 transition-all cursor-pointer ${
                    selectedMethod === "card" ? "border-[#2F5D34] shadow-xl" : "border-white/80 shadow-md"
                  }`}
                  onClick={() => setSelectedMethod("card")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input type="radio" checked={selectedMethod === "card"} onChange={() => setSelectedMethod("card")} className="size-5 accent-[#2F5D34]" />
                      <div>
                        <h4 className="font-bold text-[#222123] text-lg">Credit / Debit Card</h4>
                        <p className="text-xs font-paragraph text-gray-500">Visa, Mastercard, RuPay, Maestro</p>
                      </div>
                    </div>
                    <span className="text-2xl">💳</span>
                  </div>

                  {selectedMethod === "card" && (
                    <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Name on card"
                          className="w-full p-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2F5D34]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 •••• •••• 8901"
                          className="w-full p-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2F5D34]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2F5D34]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">CVV Code</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full p-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2F5D34]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Net Banking Option */}
                <div
                  className={`bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border-2 transition-all cursor-pointer ${
                    selectedMethod === "netbanking" ? "border-[#2F5D34] shadow-xl" : "border-white/80 shadow-md"
                  }`}
                  onClick={() => setSelectedMethod("netbanking")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input type="radio" checked={selectedMethod === "netbanking"} onChange={() => setSelectedMethod("netbanking")} className="size-5 accent-[#2F5D34]" />
                      <div>
                        <h4 className="font-bold text-[#222123] text-lg">Net Banking</h4>
                        <p className="text-xs font-paragraph text-gray-500">Direct login via major Indian banks.</p>
                      </div>
                    </div>
                    <span className="text-2xl">🏦</span>
                  </div>

                  {selectedMethod === "netbanking" && (
                    <div className="mt-6 pt-6 border-t border-gray-100 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Select Your Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-gray-200 text-sm font-bold text-[#222123] outline-none focus:border-[#2F5D34]"
                      >
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="SBI">State Bank of India (SBI)</option>
                        <option value="AXIS">Axis Bank</option>
                        <option value="KOTAK">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div
                  className={`bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border-2 transition-all cursor-pointer ${
                    selectedMethod === "cod" ? "border-[#2F5D34] shadow-xl" : "border-white/80 shadow-md"
                  }`}
                  onClick={() => setSelectedMethod("cod")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input type="radio" checked={selectedMethod === "cod"} onChange={() => setSelectedMethod("cod")} className="size-5 accent-[#2F5D34]" />
                      <div>
                        <h4 className="font-bold text-[#222123] text-lg">Cash on Delivery (COD)</h4>
                        <p className="text-xs font-paragraph text-gray-500">Pay cash directly to courier agent upon door delivery.</p>
                      </div>
                    </div>
                    <span className="text-2xl">💵</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Final Summary */}
              <div className="w-full lg:w-2/5 sticky top-28 bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-6 sm:p-8 shadow-2xl">
                <h3 className="text-2xl font-bold uppercase text-[#2F5D34] mb-4 pb-3 border-b border-[#2F5D34]/15">
                  Payable Amount {isBuyNowMode && "(Buy Now)"}
                </h3>

                {/* Items Summary List with Controls */}
                <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1 mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Items in Order:</span>
                  {populatedItems.map(({ productId, quantity, product, variant }) => (
                    <div key={productId} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                      <div className="flex items-center gap-2 max-w-[55%]">
                        <div className="relative size-10 rounded-lg overflow-hidden bg-white flex-none border border-gray-200">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
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

                {/* Deliver To Summary */}
                <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs font-paragraph text-gray-700">
                  <span className="block font-bold text-[#2F5D34] uppercase tracking-wider mb-1">Delivering To:</span>
                  <p className="font-bold text-[#222123] text-sm">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                  <p className="mt-1">Phone: {shippingAddress.phone}</p>
                </div>

                {/* Totals */}
                <div className="flex flex-col gap-3 text-sm font-paragraph text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#222123]">₹{effectiveSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold text-[#2F5D34]">{shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Tax (5%)</span>
                    <span className="font-bold text-[#222123]">₹{tax.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Discount {appliedCoupon ? `(${appliedCoupon.code})` : ''}</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline text-xl font-bold text-[#2F5D34]">
                    <span>Total Amount</span>
                    <span className="text-3xl text-[#2F5D34]">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Final Submit Button */}
                <div className="mt-8 flex flex-col gap-3">
                  <button
                    onClick={handlePayNow}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:shadow-[0_15px_35px_rgba(47,93,52,0.4)] hover:scale-102 active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>🔒 {isProcessing ? "Processing..." : `Pay ₹${grandTotal.toFixed(2)} & Complete Order`}</span>
                  </button>

                  <Link href={isBuyNowMode ? "/shop" : "/cart"}>
                    <button className="w-full py-3 rounded-full border border-gray-300 text-gray-600 hover:text-[#2F5D34] font-bold text-xs uppercase tracking-wider transition-all text-center block">
                      {isBuyNowMode ? "← Return to Shop" : "← Back to Shop"}
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

export default function PaymentPage() {
  return (
    <ProtectedRoute pageTitle="Payment">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F4EC]">
          <div className="text-center">
            <span className="text-4xl animate-bounce">🌿</span>
            <p className="mt-2 text-sm font-bold text-[#2F5D34]">Loading Payment Gateway...</p>
          </div>
        </div>
      }>
        <PaymentContent />
      </Suspense>
    </ProtectedRoute>
  );
}
