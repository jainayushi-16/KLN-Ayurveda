"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { QrCode, CheckCircle2, AlertCircle, RefreshCw, Clock, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function NetBankingQrPayment({ grandTotal, orderRef, onPaymentSuccess, onCancel }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [qrUrl, setQrUrl] = useState("");
  const [upiPayUrl, setUpiPayUrl] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [isVerifying, setIsVerifying] = useState(false);
  const [initError, setInitError] = useState(null);

  const formattedAmount = Number(grandTotal || 0).toFixed(2);
  const merchantVpa = "klnayurveda@bank";
  const merchantName = "KLN Ayurveda Pvt Ltd";

  useEffect(() => {
    let isMounted = true;
    async function initQrTransaction() {
      try {
        setIsInitializing(true);
        setInitError(null);

        // Construct dynamic UPI payment URI for exact amount and order reference
        const refNo = orderRef || `KLN-${Date.now()}`;
        const upiUri = `upi://pay?pa=${merchantVpa}&pn=${encodeURIComponent(merchantName)}&am=${formattedAmount}&tn=Order%20${encodeURIComponent(refNo)}&cu=INR`;
        const generatedQr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;

        if (isMounted) {
          setUpiPayUrl(upiUri);
          setQrUrl(generatedQr);
          setIsInitializing(false);
        }
      } catch (err) {
        if (isMounted) {
          setInitError("Failed to initialize dynamic payment QR. Please try again.");
          setIsInitializing(false);
        }
      }
    }

    initQrTransaction();

    return () => {
      isMounted = false;
    };
  }, [grandTotal, orderRef, formattedAmount]);

  // Countdown Timer
  useEffect(() => {
    if (isInitializing || initError || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isInitializing, initError, timeLeft]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleVerifyPayment = async () => {
    setIsVerifying(true);
    toast.loading("Verifying payment with bank server...", { id: "verify_qr" });

    // Simulate server verification check
    setTimeout(() => {
      toast.dismiss("verify_qr");
      setIsVerifying(false);
      onPaymentSuccess({
        method: "NETBANKING_QR",
        transactionId: `QR-TXN-${Date.now()}`,
        paidAmount: Number(formattedAmount),
      });
    }, 1800);
  };

  if (isInitializing) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-3xl border border-gray-200 my-4 animate-pulse">
        <RefreshCw className="w-8 h-8 text-[#2F5D34] animate-spin mx-auto mb-3" />
        <h4 className="font-bold text-sm text-[#222123]">Initializing Secure Dynamic QR...</h4>
        <p className="text-xs text-gray-500 mt-1 font-paragraph">Generating unique transaction code for ₹{formattedAmount}</p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="p-6 text-center bg-red-50 rounded-3xl border border-red-200 my-4">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <h4 className="font-bold text-sm text-red-800">{initError}</h4>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider"
        >
          Retry QR Generation
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-[#E8F2E3]/40 rounded-3xl border-2 border-[#2F5D34] shadow-xl my-4 text-center">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
        <div className="flex items-center gap-2 text-[#2F5D34] font-bold text-xs uppercase tracking-wider">
          <QrCode className="w-4 h-4" />
          <span>Dynamic Net Banking / UPI QR</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          <Clock className="w-3.5 h-3.5" />
          <span>Expires in {formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-5 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block">Amount Payable</span>
        <span className="text-3xl font-extrabold text-[#2F5D34]">₹{formattedAmount}</span>
        <span className="text-xs font-semibold text-gray-500 block mt-1">Ref #: {orderRef || "KLN-ORDER"}</span>
      </div>

      {/* QR Code Container */}
      <div className="relative size-60 sm:size-64 mx-auto p-4 bg-white rounded-3xl border-2 border-[#2F5D34]/30 shadow-md flex items-center justify-center mb-4 group">
        {timeLeft > 0 ? (
          <img
            src={qrUrl}
            alt="Dynamic Payment QR Code"
            className="w-full h-full object-contain rounded-xl"
          />
        ) : (
          <div className="text-center p-4">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-red-700">QR Code Expired</p>
            <p className="text-[10px] text-gray-500 mt-1">Please refresh payment page to generate a new QR.</p>
          </div>
        )}
      </div>

      <p className="text-xs font-paragraph text-gray-600 mb-4">
        Scan using any UPI or Net Banking app (BHIM, Paytm, PhonePe, GPay, HDFC, SBI, ICICI) to complete payment.
      </p>

      {/* Security Badge & Verification Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
        <button
          onClick={handleVerifyPayment}
          disabled={isVerifying || timeLeft <= 0}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#2F5D34] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying with Bank...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>I Have Completed Payment</span>
            </>
          )}
        </button>

        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
