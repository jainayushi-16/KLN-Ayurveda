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
import toast from "react-hot-toast";

export default function PaymentPage() {
  const router = useRouter();
  const { items: cartItems, totalItems: totalItemsCount, subtotal, clearCart } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { shippingAddress, deliveryMethod, discountPercent, placeOrder } = useOrderStore();

  const [selectedMethod, setSelectedMethod] = useState("upi"); // "upi" | "card" | "netbanking" | "cod"
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = deliveryMethod === "express" ? 99 : subtotal > 499 || subtotal === 0 ? 0 : 49;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const discountAmount = Number((subtotal * discountPercent).toFixed(2));
  const grandTotal = Math.max(0, Number((subtotal + shippingCost + tax - discountAmount).toFixed(2)));

  const handlePayNow = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty.");
      router.push("/cart");
      return;
    }

    if (selectedMethod === "upi" && !upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g. name@upi)");
      return;
    }

    if (selectedMethod === "card" && (cardNumber.length < 15 || !cardExpiry || !cardCvv)) {
      toast.error("Please enter complete card details.");
      return;
    }

    setIsProcessing(true);

    // Simulate Payment Processing Gateway
    setTimeout(async () => {
      const placedOrder = placeOrder({
        cartItems,
        totals: {
          subtotal,
          shipping: shippingCost,
          tax,
          discount: discountAmount,
          grandTotal,
        },
        paymentMethod: selectedMethod.toUpperCase(),
        paymentDetails:
          selectedMethod === "upi"
            ? `UPI ID: ${upiId || "aarav@gpay"}`
            : selectedMethod === "card"
            ? `Card Ending in ${cardNumber.slice(-4) || "4242"}`
            : selectedMethod === "netbanking"
            ? `Net Banking (${selectedBank})`
            : "Cash on Delivery",
      });

      await clearCart();
      setIsProcessing(false);
      toast.success("Payment Approved! Generating order invoice...");
      router.push(`/order-success?orderId=${placedOrder.orderId}`);
    }, 2000);
  };

  return (
    <ProtectedRoute pageTitle="Payment Gateway">
      <main className="min-h-screen w-full relative bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
        <ShopNavBar cartCount={totalItemsCount} wishlistCount={wishlistIds.length} />

        {/* Header */}
        <section className="pt-24 pb-8 w-full px-6 md:px-12 max-w-[1800px] mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2F5D34]/10 text-[#2F5D34] text-xs font-bold uppercase tracking-widest mb-3">
              Step 2 of 2 — Payment Confirmation
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold uppercase text-[#2F5D34]">Payment Gateway</h1>
            <p className="text-gray-600 font-paragraph text-sm sm:text-base mt-2">
              Select your preferred payment method to finalize your order.
            </p>
          </div>
        </section>

        {/* Payment Grid */}
        <section className="pb-28 w-full px-6 md:px-12 max-w-[1800px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left Column: Payment Methods Accordion */}
            <div className="w-full lg:w-3/5 flex flex-col gap-6">
              {/* UPI Option */}
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
                      <h4 className="font-bold text-[#222123] text-lg">UPI / Google Pay / PhonePe / PayTM</h4>
                      <p className="text-xs font-paragraph text-gray-500">Fast, instant payment using any UPI application.</p>
                    </div>
                  </div>
                  <span className="text-2xl">📱</span>
                </div>

                {selectedMethod === "upi" && (
                  <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-4 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                    <label className="block text-xs font-bold uppercase text-gray-600">Enter VPA / UPI ID</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@upi or aarav@okicici"
                        className="flex-1 p-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2F5D34]"
                      />
                      <button
                        onClick={handlePayNow}
                        disabled={isProcessing}
                        className="px-6 py-3.5 rounded-xl bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#224426] transition-all disabled:opacity-50"
                      >
                        Verify & Pay
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Credit / Debit Card Option */}
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
                      <h4 className="font-bold text-[#222123] text-lg">Credit Card / Debit Card</h4>
                      <p className="text-xs font-paragraph text-gray-500">Visa, MasterCard, RuPay, and American Express accepted.</p>
                    </div>
                  </div>
                  <span className="text-2xl">💳</span>
                </div>

                {selectedMethod === "card" && (
                  <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Aarav Patel"
                        className="w-full p-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2F5D34]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8921"
                        className="w-full p-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2F5D34]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
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
                      <option value="SBI">State Bank of India</option>
                      <option value="Axis">Axis Bank</option>
                      <option value="Kotak">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Cash on Delivery (COD) Option */}
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

            {/* Right Column: Final Summary & CTA */}
            <div className="w-full lg:w-2/5 sticky top-28 bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-6 sm:p-8 shadow-2xl">
              <h3 className="text-2xl font-bold uppercase text-[#2F5D34] mb-6 pb-4 border-b border-[#2F5D34]/15">
                Payable Amount
              </h3>

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
                  <span className="font-bold text-[#222123]">₹{subtotal.toFixed(2)}</span>
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
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline text-xl font-bold text-[#2F5D34]">
                  <span>Total Amount</span>
                  <span className="text-3xl text-[#2F5D34]">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Final Submit Button */}
              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className="mt-8 w-full py-4.5 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:shadow-[0_15px_35px_rgba(47,93,52,0.4)] hover:scale-102 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isProcessing ? "Processing Payment..." : `Pay ₹${grandTotal.toFixed(2)} Now`}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Processing Modal Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-scaleUp">
              <div className="size-16 border-4 border-[#2F5D34] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#222123]">Processing Payment</h3>
              <p className="text-xs text-gray-500 font-paragraph mt-2">Connecting securely with bank gateway. Please do not close or refresh this window.</p>
            </div>
          </div>
        )}

        <FooterSection />
      </main>
    </ProtectedRoute>
  );
}
