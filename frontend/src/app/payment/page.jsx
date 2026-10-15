"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useBuyNowStore } from "@/store/useBuyNowStore";
import { useLanguage } from "@/i18n/LanguageContext";
import { validateCardNumber, validateExpiry, validateCvv, formatCardNumber, formatExpiry } from "@/utils/cardValidator";
import { validateUpiId } from "@/utils/upiValidator";
import NetBankingQrPayment from "@/components/payment/NetBankingQrPayment";
import { useWalletStore } from "@/store/useWalletStore";
import { Wallet, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

function PaymentContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const isBuyNowParam = searchParams.get("buyNow") === "true";

  const { items: cartItems, totalItems: totalItemsCount, subtotal: cartSubtotal, updateQuantity: updateCartQuantity, removeItem: removeCartItem, clearCart } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { shippingAddress, deliveryMethod, discountPercent, placeOrder, initiateRazorpayOrder, verifyRazorpayPayment } = useOrderStore();
  const { buyNowItem, updateBuyNowQuantity, clearBuyNow, loadFromStorage } = useBuyNowStore();
  const { balance: walletBalance, fetchWalletBalance } = useWalletStore();

  const [activeBuyNowItem, setActiveBuyNowItem] = useState(buyNowItem);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("razorpay"); // "razorpay" | "upi" | "card" | "netbanking" | "netbanking_qr" | "cod"
  const [useWallet, setUseWallet] = useState(false);

  useEffect(() => {
    fetchWalletBalance();
  }, [fetchWalletBalance]);

  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [paymentErrors, setPaymentErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const hasLoadedBuyNowRef = useRef(false);

  useEffect(() => {
    if (hasLoadedBuyNowRef.current) return;
    hasLoadedBuyNowRef.current = true;
    const stored = loadFromStorage();
    if (stored) {
      setActiveBuyNowItem(stored);
    }
    useOrderStore.getState().loadShippingAddressFromStorage?.();
    setIsHydrated(true);
  }, []);

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

  const storeAppliedCoupon = useCartStore((state) => state.appliedCoupon);
  const [appliedCoupon, setAppliedCoupon] = useState(storeAppliedCoupon);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("kln_applied_coupon");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.discountAmount !== undefined || parsed.code)) {
            setAppliedCoupon(parsed);
            return;
          }
        }
      } catch (e) {}
    }
    setAppliedCoupon(storeAppliedCoupon);
  }, [storeAppliedCoupon]);

  const isFreeShip = appliedCoupon && appliedCoupon.isFreeShipping;
  const shippingCost = deliveryMethod === "express" ? 99 : isFreeShip ? 0 : effectiveSubtotal > 450 || effectiveSubtotal === 0 ? 0 : 49;
  const discountAmount = appliedCoupon
    ? Number(appliedCoupon.discountAmount || 0)
    : Number((effectiveSubtotal * discountPercent).toFixed(2));
  const taxableAmount = Math.max(0, effectiveSubtotal - discountAmount);
  const tax = Number((taxableAmount * 0.05).toFixed(2));
  const grandTotal = Math.max(0, Number((taxableAmount + shippingCost + tax).toFixed(2)));

  // KLN Wallet Balance Calculations
  const availableWallet = Math.max(0, Number(walletBalance || 0));
  const walletDeduction = useWallet ? Math.min(availableWallet, grandTotal) : 0;
  const remainingPayable = Math.max(0, Number((grandTotal - walletDeduction).toFixed(2)));
  const isFullWalletPayment = useWallet && walletDeduction >= grandTotal;

  const populatedItems = payableItems.map((item) => {
    const prod = item.product || item;
    return {
      ...item,
      product: {
        id: prod.id || item.productId,
        name: prod.name || item.name || "Ayurvedic Formulation",
        price: prod.price || item.price || 0,
        images: prod.images?.map((img) => (typeof img === "object" ? img.url : img)) || [item.image || "/images/products/hairoil/oilf.jpeg"],
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

  const handleRazorpayCheckout = async (targetMethod = null) => {
    if (payableItems.length === 0) {
      toast.error("Your payment checkout is empty!");
      return;
    }

    if (!agreedToTerms) {
      toast.error("You must agree to the Terms & Conditions and Return Policy to place an order.", {
        icon: "📜",
      });
      return;
    }

    // 100% Full Wallet Checkout flow (No external gateway required)
    if (isFullWalletPayment || targetMethod === "WALLET") {
      setIsProcessing(true);
      toast.loading("Processing order with KLN Wallet...", { id: "wallet_toast" });
      try {
        const order = await placeOrder(payableItems, grandTotal, { method: "WALLET" }, true);
        toast.dismiss("wallet_toast");
        toast.success("Order Placed Successfully via KLN Wallet! 🎉");
        if (isBuyNowMode) clearBuyNow();
        else clearCart();
        fetchWalletBalance();
        setIsProcessing(false);
        router.push(`/order-success?orderId=${order.orderId || order.id}`);
        return;
      } catch (err) {
        toast.dismiss("wallet_toast");
        setIsProcessing(false);
        return;
      }
    }

    const effectiveMethod = targetMethod || selectedMethod;

    if (effectiveMethod === "upi" && upiId && upiId.trim()) {
      const upiRes = validateUpiId(upiId);
      if (!upiRes.isValid) {
        toast.error(upiRes.error);
        return;
      }
    }

    setIsProcessing(true);
    toast.loading("Initializing secure Razorpay payment...", { id: "razorpay_toast" });

    try {
      const razorpayData = await initiateRazorpayOrder(payableItems, grandTotal, useWallet);
      toast.dismiss("razorpay_toast");

      if (razorpayData.isFullWalletPayment) {
        toast.success("Order Placed Successfully via KLN Wallet! 🎉");
        if (isBuyNowMode) clearBuyNow();
        else clearCart();
        fetchWalletBalance();
        setIsProcessing(false);
        router.push(`/order-success?orderId=${razorpayData.orderId || razorpayData.order?.id}`);
        return;
      }

      const keyId = razorpayData?.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_key_id";

      if (typeof window !== "undefined" && window.Razorpay && keyId && !keyId.includes("placeholder")) {
        const options = {
          key: keyId,
          amount: razorpayData.amount,
          currency: razorpayData.currency || "INR",
          name: "KLN Ayurveda",
          description: `Order #${razorpayData.orderNumber}`,
          order_id: razorpayData.razorpayOrderId,
          prefill: {
            name: shippingAddress?.fullName || "",
            email: shippingAddress?.email || "",
            contact: shippingAddress?.phone || "",
            ...(effectiveMethod === "upi" && upiId ? { vpa: upiId } : {}),
          },
          theme: {
            color: "#2F5D34",
          },
          handler: async function (response) {
            toast.loading("Verifying payment signature...", { id: "razorpay_verify" });
            try {
              const verifiedOrder = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: razorpayData.orderId,
              });
              toast.dismiss("razorpay_verify");
              toast.success("Payment Successful! Order Confirmed 🎉");

              if (isBuyNowMode) clearBuyNow();
              else clearCart();
              fetchWalletBalance();

              setIsProcessing(false);
              router.push(`/order-success?orderId=${verifiedOrder.orderId || verifiedOrder.id || razorpayData.orderId}`);
            } catch (err) {
              toast.dismiss("razorpay_verify");
              setIsProcessing(false);
              toast.error(err?.message || "Payment verification failed.");
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              toast.error("Payment popup closed.");
            },
          },
        };

        if (effectiveMethod === "upi") {
          options.config = { display: { sequence: ["block.upi", "block.card", "block.netbanking"] } };
        } else if (effectiveMethod === "card") {
          options.config = { display: { sequence: ["block.card", "block.upi", "block.netbanking"] } };
        } else if (effectiveMethod === "netbanking" || effectiveMethod === "netbanking_qr") {
          options.config = { display: { sequence: ["block.netbanking", "block.upi", "block.card"] } };
        }

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          setIsProcessing(false);
          toast.error(response.error?.description || "Razorpay payment failed.");
        });
        rzp.open();
      } else {
        // Fallback simulated payment when API keys are placeholder or script is loading in dev mode
        toast.success(`Development Mode: Processing ${effectiveMethod.toUpperCase()} via Razorpay... 💳`);
        const verifiedOrder = await verifyRazorpayPayment({
          razorpay_order_id: razorpayData.razorpayOrderId,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: "mock_signature",
          orderId: razorpayData.orderId,
        });

        if (isBuyNowMode) clearBuyNow();
        else clearCart();
        fetchWalletBalance();

        setIsProcessing(false);
        router.push(`/order-success?orderId=${verifiedOrder.orderId || verifiedOrder.id || razorpayData.orderId}`);
      }
    } catch (err) {
      toast.dismiss("razorpay_toast");
      setIsProcessing(false);
      const message = err?.response?.data?.message || err?.message || "Failed to initialize Razorpay checkout. Please try again.";
      console.error("Razorpay initiation error:", message, err);
      toast.error(message);
    }
  };

  const handlePayNow = async (customDetails = null) => {
    if (isFullWalletPayment) {
      return handleRazorpayCheckout("WALLET");
    }

    if (selectedMethod !== "cod" && !customDetails) {
      return handleRazorpayCheckout(selectedMethod);
    }

    if (payableItems.length === 0) {
      toast.error("Your payment checkout is empty!");
      return;
    }

    if (!agreedToTerms && !customDetails) {
      toast.error("You must agree to the Terms & Conditions and Return Policy to place an order.", {
        icon: "📜",
      });
      return;
    }

    setIsProcessing(true);
    toast.loading("Processing order...", { id: "payment_toast" });

    try {
      const paymentDetails = customDetails || {
        method: useWallet ? "WALLET_COD" : "COD",
        transactionId: "COD" + Date.now(),
        paidAmount: remainingPayable,
      };

      const order = await placeOrder(payableItems, grandTotal, paymentDetails, useWallet);
      toast.dismiss("payment_toast");
      toast.success(
        useWallet
          ? `Order Placed! ₹${walletDeduction.toFixed(2)} debited from KLN Wallet, pay ₹${remainingPayable.toFixed(2)} on Delivery.`
          : "Order Placed Successfully! 🎉 (Pay Cash on Delivery)"
      );

      if (isBuyNowMode) {
        clearBuyNow();
      } else {
        clearCart();
      }
      fetchWalletBalance();

      setIsProcessing(false);
      router.push(`/order-success?orderId=${order.orderId || order.id}`);
    } catch (err) {
      toast.dismiss("payment_toast");
      toast.error(err?.message || "Failed to place order. Please try again.");
      setIsProcessing(false);
      console.error("Order error:", err);
    }
  };



  return (
    <main className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#3D1A4F]">
      {/* Navbar */}
      <ShopNavBar cartCount={totalItemsCount} wishlistCount={wishlistIds.length} />

      {/* Header Progress Tracker */}
      <section className="py-8 sm:py-10 w-full px-6 md:px-12 lg:px-16 relative z-10">
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

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Main Content Layout */}
      <section className="pb-28 w-full px-6 md:px-12 lg:px-16 relative z-10">
        <div className="max-w-[1800px] mx-auto">
          {payableItems.length === 0 ? (
            <div className="text-center py-24 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-[#2F5D34]/30 max-w-xl mx-auto shadow-sm">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-[#4B0082] mb-3">No Items to Process Payment</h2>
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
                {/* 0. KLN Wallet Balance Option */}
                <div
                  className={`bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-7 border-2 transition-all relative overflow-hidden ${
                    useWallet
                      ? "border-[#2F5D34] shadow-xl bg-gradient-to-r from-emerald-50/70 via-white to-white"
                      : "border-emerald-200/70 shadow-md bg-white/90"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 size-11 rounded-2xl bg-gradient-to-br from-[#2F5D34] to-[#1a381d] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#2F5D34]/25">
                        <Wallet className="w-5 h-5 text-[#C9A66B]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[#2A1810] text-lg font-serif">KLN Wallet</h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2F5D34]/10 text-[#2F5D34] px-2.5 py-0.5 rounded-full border border-[#2F5D34]/20">
                            Pay Balance
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Available Balance: <strong className="text-[#2F5D34] text-sm font-serif">₹{availableWallet.toFixed(2)}</strong>
                        </p>
                      </div>
                    </div>

                    {availableWallet > 0 ? (
                      <label className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl cursor-pointer transition-all shrink-0 border ${
                        useWallet
                          ? "bg-[#2F5D34] text-white border-[#2F5D34] shadow-md shadow-[#2F5D34]/25"
                          : "bg-emerald-50 hover:bg-emerald-100/80 text-[#2F5D34] border-emerald-200"
                      }`}>
                        <input
                          type="checkbox"
                          checked={useWallet}
                          onChange={(e) => setUseWallet(e.target.checked)}
                          className="size-4.5 rounded text-[#2F5D34] accent-[#2F5D34] cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm font-bold">
                          {useWallet ? "Wallet Applied ✓" : "Use Wallet Balance"}
                        </span>
                      </label>
                    ) : (
                      <div className="text-xs text-stone-400 bg-stone-100 px-3.5 py-2 rounded-xl font-medium shrink-0">
                        Zero Balance
                      </div>
                    )}
                  </div>

                  {useWallet && availableWallet > 0 && (
                    <div className="mt-5 pt-4 border-t border-emerald-100 text-xs space-y-2 animate-fadeIn">
                      <div className="flex justify-between items-center text-stone-700">
                        <span>Order Total:</span>
                        <span className="font-semibold">₹{grandTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[#2F5D34] font-semibold">
                        <span>Wallet Balance Applied:</span>
                        <span>-₹{walletDeduction.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-700">
                        <span>Remaining Wallet Balance:</span>
                        <span className="font-semibold">₹{(availableWallet - walletDeduction).toFixed(2)}</span>
                      </div>

                      {isFullWalletPayment ? (
                        <div className="mt-3 p-3.5 rounded-2xl bg-[#2F5D34]/10 border border-[#2F5D34]/25 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-[#2F5D34] font-bold text-xs sm:text-sm">
                            <Sparkles className="w-4 h-4 text-[#C9A66B]" />
                            <span>100% Covered! No external payment required.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRazorpayCheckout("WALLET")}
                            disabled={isProcessing}
                            className="px-5 py-2.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#224426] transition-all shadow-md cursor-pointer disabled:opacity-50"
                          >
                            {isProcessing ? "Confirming..." : "Confirm via Wallet →"}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 text-stone-600 bg-amber-50/70 border border-amber-200/70 p-2.5 rounded-xl">
                          Remaining to pay: <strong className="text-amber-900 font-bold">₹{remainingPayable.toFixed(2)}</strong>. Choose Razorpay or COD below for the remaining amount.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 1. Razorpay Secure Online Payment Option */}
                <div
                  className={`bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border-2 transition-all cursor-pointer relative overflow-hidden ${
                    selectedMethod === "razorpay" ? "border-[#2F5D34] shadow-xl bg-gradient-to-r from-emerald-50/40 via-white to-white" : "border-white/80 shadow-md"
                  }`}
                  onClick={() => setSelectedMethod("razorpay")}
                >
                  <div className="absolute top-3 right-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-[#2F5D34] text-white px-3 py-1 rounded-full shadow-sm">
                      Recommended ★
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-4">
                      <input type="radio" checked={selectedMethod === "razorpay"} onChange={() => setSelectedMethod("razorpay")} className="size-5 accent-[#2F5D34]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[#4B0082] text-lg">Razorpay Secure Online Payment</h4>
                        </div>
                        <p className="text-xs font-paragraph text-gray-600 mt-0.5">UPI, Credit/Debit Cards, NetBanking, GooglePay, PhonePe, Paytm, Wallets, QR</p>
                      </div>
                    </div>
                    <span className="text-2xl hidden sm:inline">💳</span>
                  </div>

                  {selectedMethod === "razorpay" && (
                    <div className="mt-6 pt-6 border-t border-emerald-100 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                      <div className="p-4 rounded-2xl bg-[#2F5D34]/5 border border-[#2F5D34]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-gray-700">
                          <p className="font-bold text-[#2F5D34] text-sm">🔒 256-bit Encrypted Secure Gateway</p>
                          <p className="mt-1">Redirects safely to Razorpay's PCI-DSS compliant checkout popup. Instant payment confirmation.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRazorpayCheckout("razorpay")}
                          disabled={isProcessing}
                          className="px-6 py-3 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#224426] transition-all flex-none shadow-md"
                        >
                          {isProcessing ? "Connecting..." : "Pay via Razorpay →"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Cash on Delivery (COD) Option */}
                <div
                  className={`bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border-2 transition-all cursor-pointer ${
                    selectedMethod === "cod" ? "border-[#2F5D34] shadow-xl bg-gradient-to-r from-emerald-50/20 via-white to-white" : "border-white/80 shadow-md"
                  }`}
                  onClick={() => setSelectedMethod("cod")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input type="radio" checked={selectedMethod === "cod"} onChange={() => setSelectedMethod("cod")} className="size-5 accent-[#2F5D34]" />
                      <div>
                        <h4 className="font-bold text-[#4B0082] text-lg">Cash on Delivery (COD)</h4>
                        <p className="text-xs font-paragraph text-gray-500">Pay cash directly to courier agent upon door delivery.</p>
                      </div>
                    </div>
                    <span className="text-2xl">💵</span>
                  </div>

                  {selectedMethod === "cod" && (
                    <div className="mt-6 pt-6 border-t border-gray-100 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-amber-900">
                          <p className="font-bold text-amber-800 text-sm">📦 Pay Upon Receipt</p>
                          <p className="mt-1">You will pay ₹{grandTotal.toFixed(2)} in cash when your shipment arrives at your doorstep.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePayNow()}
                          disabled={isProcessing}
                          className="px-6 py-3 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#224426] transition-all flex-none shadow-md"
                        >
                          {isProcessing ? "Processing..." : "Confirm COD Order →"}
                        </button>
                      </div>
                    </div>
                  )}
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
                          <h4 className="font-bold text-[#4B0082] text-xs line-clamp-1">{product.name}</h4>
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
                          <span className="w-5 text-center font-bold text-xs text-[#3D1A4F]">{quantity}</span>
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
                  <p className="font-bold text-[#3D1A4F] text-sm">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                  <p className="mt-1">Phone: {shippingAddress.phone}</p>
                </div>

                {/* Totals */}
                <div className="flex flex-col gap-3 text-sm font-paragraph text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#3D1A4F]">₹{effectiveSubtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Discount {appliedCoupon ? `(${appliedCoupon.code})` : ''}</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-gray-600 text-xs">
                      <span>Taxable Amount (After Discount)</span>
                      <span className="font-bold text-gray-800">₹{taxableAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold text-[#2F5D34]">{shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Tax (5%)</span>
                    <span className="font-bold text-[#3D1A4F]">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline text-xl font-bold text-[#2F5D34]">
                    <span>Total Amount</span>
                    <span className="text-3xl text-[#2F5D34]">₹{grandTotal.toFixed(2)}</span>
                  </div>

                  {useWallet && walletDeduction > 0 && (
                    <div className="mt-2 pt-2 border-t border-dashed border-emerald-200 space-y-1.5 animate-fadeIn">
                      <div className="flex justify-between items-center text-xs text-[#2F5D34] font-bold">
                        <span className="flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-[#C9A66B]" />
                          <span>KLN Wallet Applied</span>
                        </span>
                        <span>-₹{walletDeduction.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-1.5 border-t border-stone-200">
                        <span className="text-sm font-bold text-stone-800">Net Payable</span>
                        <span className="text-2xl font-black text-[#2F5D34] font-serif">
                          ₹{remainingPayable.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="paymentTermsCheck"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 size-4 rounded text-[#2F5D34] accent-[#2F5D34] focus:ring-[#2F5D34] cursor-pointer"
                  />
                  <label htmlFor="paymentTermsCheck" className="text-xs text-gray-600 font-paragraph cursor-pointer leading-relaxed">
                    {t("checkout.agreeTerms", {}, "I have read and agree to the Terms & Conditions and Return Policy")}
                    . <span className="text-red-500 font-bold">*</span>
                  </label>
                </div>

                {/* Final Submit Button */}
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={handlePayNow}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:shadow-[0_15px_35px_rgba(47,93,52,0.4)] hover:scale-102 active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {isProcessing
                        ? t("checkout.processing", {}, "Processing...")
                        : isFullWalletPayment
                        ? "🌿 Pay ₹0.00 (100% via KLN Wallet)"
                        : useWallet
                        ? `🔒 Pay Remaining ₹${remainingPayable.toFixed(2)}`
                        : `${t("checkout.payAndConfirm", {}, "Pay & Confirm Order")} (₹${grandTotal.toFixed(2)})`}
                    </span>
                  </button>

                  <Link href={isBuyNowMode ? "/shop" : "/cart"}>
                    <button className="w-full py-3 rounded-full border border-gray-300 text-gray-600 hover:text-[#2F5D34] font-bold text-xs uppercase tracking-wider transition-all text-center block">
                      {isBuyNowMode ? t("checkout.returnToShop", {}, "← Return to Shop") : t("checkout.modifyCart", {}, "← Back to Cart")}
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
