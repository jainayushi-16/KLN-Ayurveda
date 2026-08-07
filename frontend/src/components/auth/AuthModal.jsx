"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
export default function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, modalMessage, login, register, } = useAuthStore();
    const [activeTab, setActiveTab] = useState("login");
    const [email, setEmail] = useState("customer@klnayurveda.com");
    const [password, setPassword] = useState("Customer@12345");
    const [firstName, setFirstName] = useState("Ananya");
    const [lastName, setLastName] = useState("Sharma");
    const [isSubmitting, setIsSubmitting] = useState(false);
    if (!isAuthModalOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (activeTab === "login") {
            await login({ email, password });
        }
        else {
            await register({ email, password, firstName, lastName });
        }
        setIsSubmitting(false);
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={closeAuthModal} className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"/>

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#F6F3EC] rounded-[2.5rem] p-8 shadow-2xl z-10 border border-white/80 my-auto animate-scaleUp">
        {/* Close Button */}
        <button onClick={closeAuthModal} aria-label="Close authentication modal" className="absolute top-5 right-5 size-10 rounded-full bg-white/80 flex items-center justify-center font-bold text-gray-600 shadow hover:bg-white transition-all">
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#E7F0E4] border border-[#2F5D34]/20 text-[#2F5D34] text-xs font-bold uppercase tracking-widest mb-3">
            KLN Ayurveda Account
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#222123]">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </h3>
          <p className="text-xs sm:text-sm font-paragraph text-gray-600 mt-2">
            {modalMessage}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/80 p-1.5 rounded-full border border-gray-200 mb-6">
          <button onClick={() => setActiveTab("login")} className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "login"
            ? "bg-[#2F5D34] text-white shadow-md"
            : "text-gray-600 hover:text-black"}`}>
            Sign In
          </button>
          <button onClick={() => setActiveTab("register")} className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "register"
            ? "bg-[#2F5D34] text-white shadow-md"
            : "text-gray-600 hover:text-black"}`}>
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {activeTab === "register" && (<div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  First Name
                </label>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ananya" className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"/>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Last Name
                </label>
                <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Sharma" className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"/>
              </div>
            </div>)}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Email Address
            </label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="customer@klnayurveda.com" className="w-full py-3 px-4 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-medium outline-none focus:border-[#2F5D34]"/>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Password
            </label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full py-3 px-4 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-medium outline-none focus:border-[#2F5D34]"/>
          </div>

          <button type="submit" disabled={isSubmitting} className="mt-4 w-full py-4 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-102 active:scale-95 transition-all disabled:opacity-50">
            {isSubmitting
            ? "Authenticating..."
            : activeTab === "login"
                ? "Sign In & Continue"
                : "Create Account & Continue"}
          </button>
        </form>

        <p className="text-[11px] text-center text-gray-400 mt-6 font-paragraph">
          🔒 100% Encrypted & Safe Authentication
        </p>
      </div>
    </div>);
}
