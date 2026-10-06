"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, ShieldCheck, Award, Heart, ShoppingBag, ShoppingCart, RefreshCw } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import toast from "react-hot-toast";
import { profileApi } from "@/services/profile.api";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfileHeader({ user, stats = {}, onEditPhotoClick, onNavigateSection, onUpdateAvatar }) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const { updateUser } = useAuthStore();

  const compressImage = (file, maxWidth = 300, maxHeight = 300, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      img.src = url;

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        canvas.width = maxWidth;
        canvas.height = maxHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxWidth, maxHeight);

        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
    });
  };

  const handleCameraClick = (e) => {
    if (e) {
      e.stopPropagation();
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG, PNG, WEBP).");
      if (e.target) e.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const compressedBase64 = await compressImage(file);
      updateUser({ avatar: compressedBase64 });

      if (onUpdateAvatar) {
        onUpdateAvatar(compressedBase64);
      }

      try {
        await profileApi.updateProfile({ avatar: compressedBase64 });
      } catch (err) {
        console.error("Backend photo sync note:", err);
      }

      toast.success("Profile photo updated and saved! 📸", {
        icon: "📸",
        style: {
          borderRadius: "16px",
          background: "#2F5D34",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    } catch (err) {
      console.error("Image upload compression error:", err);
      toast.error("Failed to process profile image.");
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const getEffectiveAvatar = (avatarProp) => {
    if (avatarProp && avatarProp.trim() !== "") return avatarProp;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kln_avatar");
      if (saved && saved.trim() !== "") return saved;
    }
    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#2F5D34]/10 via-[#C9A66B]/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 relative z-10">
        {/* Left User Profile Avatar & Basic Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Hidden File Input for Avatar Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Avatar with Edit Icon */}
          <div className="relative group flex-none">
            <div
              onClick={handleCameraClick}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#2F5D34] via-[#C9A66B] to-[#5B7C3A] shadow-lg relative overflow-hidden cursor-pointer"
            >
              <Image
                src={getEffectiveAvatar(user?.avatar)}
                alt={user?.fullName || "User Profile"}
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                <Camera className="w-7 h-7 text-white drop-shadow-md" />
              </div>
            </div>
            <button
              onClick={handleCameraClick}
              disabled={isUploading}
              title="Edit Profile Photo"
              className="absolute bottom-1 right-1 p-2.5 rounded-full bg-[#2F5D34] text-white shadow-md hover:bg-[#224426] hover:scale-110 active:scale-95 transition-all border-2 border-white cursor-pointer disabled:opacity-50"
            >
              {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
          </div>

          {/* User Name & Details */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#4B0082]">
                {user?.fullName || user?.firstName || "Customer Account"}
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2F5D34]/10 border border-[#2F5D34]/20 text-[#2F5D34] text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t("profilePage.verifiedCustomer", {}, "Verified Customer")}
              </span>
            </div>

            <p className="text-sm text-gray-600 font-paragraph mt-1.5 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              {user?.email && <span>✉️ {user.email}</span>}
              {user?.email && user?.phone && <span className="hidden sm:inline text-gray-300">•</span>}
              {user?.phone && <span>📞 {user.phone}</span>}
            </p>

            <div className="mt-3 flex items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 font-paragraph flex-wrap">
              {user?.id && (
                <span className="bg-gray-100/80 px-2.5 py-1 rounded-md">
                  {t("profilePage.customerId", {}, "Customer ID:")} <strong className="text-[#2F5D34] font-semibold">{user.id.slice(0, 13)}</strong>
                </span>
              )}
              {user?.createdAt && (
                <span className="bg-gray-100/80 px-2.5 py-1 rounded-md">
                  {t("profilePage.memberSince", {}, "Member since:")} <strong className="text-gray-700">{new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Stats Quick Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-row gap-3 w-full lg:w-auto">
          {/* Loyalty Points */}
          <div className="flex flex-col items-center justify-center bg-[#E7F0E4]/60 hover:bg-[#E7F0E4] p-3.5 px-5 rounded-2xl border border-[#2F5D34]/15 shadow-sm transition-all text-center min-w-[110px]">
            <Award className="w-5 h-5 text-[#C9A66B] mb-1" />
            <span className="text-lg font-bold text-[#4B0082]">
              {user?.loyaltyPoints?.toLocaleString() || "1,450"}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {t("profilePage.points", {}, "Points")}
            </span>
          </div>

          {/* Orders */}
          <button
            onClick={() => onNavigateSection && onNavigateSection("orders")}
            className="flex flex-col items-center justify-center bg-white hover:bg-emerald-50/50 p-3.5 px-5 rounded-2xl border border-gray-200 shadow-sm transition-all text-center min-w-[110px] cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-[#2F5D34] mb-1" />
            <span className="text-lg font-bold text-[#4B0082]">
              {stats?.totalOrders ?? user?.ordersCount ?? 0}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {t("profilePage.orders", {}, "Orders")}
            </span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => onNavigateSection && onNavigateSection("wishlist")}
            className="flex flex-col items-center justify-center bg-white hover:bg-rose-50/50 p-3.5 px-5 rounded-2xl border border-gray-200 shadow-sm transition-all text-center min-w-[110px] cursor-pointer"
          >
            <Heart className="w-5 h-5 text-rose-500 mb-1" />
            <span className="text-lg font-bold text-[#4B0082]">
              {stats?.wishlistCount ?? user?.wishlistCount ?? 0}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {t("profilePage.wishlist", {}, "Wishlist")}
            </span>
          </button>

          {/* Cart */}
          <button
            onClick={() => onNavigateSection && onNavigateSection("cart")}
            className="flex flex-col items-center justify-center bg-white hover:bg-amber-50/50 p-3.5 px-5 rounded-2xl border border-gray-200 shadow-sm transition-all text-center min-w-[110px] cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-amber-600 mb-1" />
            <span className="text-lg font-bold text-[#4B0082]">
              {stats?.cartCount ?? user?.cartCount ?? 0}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {t("profilePage.cartItems", {}, "Cart Items")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
