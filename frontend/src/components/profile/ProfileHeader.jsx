"use client";

import Image from "next/image";
import { Camera, ShieldCheck, Award, Heart, ShoppingBag, ShoppingCart } from "lucide-react";

export default function ProfileHeader({ user, onEditPhotoClick, onNavigateSection }) {
  return (
    <div className="w-full bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#2F5D34]/10 via-[#C9A66B]/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 relative z-10">
        {/* Left User Profile Avatar & Basic Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar with Edit Icon */}
          <div className="relative group flex-none">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#2F5D34] via-[#C9A66B] to-[#5B7C3A] shadow-lg relative overflow-hidden">
              <Image
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                alt={user?.fullName || "User Profile"}
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <button
              onClick={onEditPhotoClick}
              title="Edit Profile Photo"
              className="absolute bottom-1 right-1 p-2.5 rounded-full bg-[#2F5D34] text-white shadow-md hover:bg-[#224426] hover:scale-110 active:scale-95 transition-all border-2 border-white cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Name & Details */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#222123]">
                {user?.fullName || user?.firstName || "Customer Account"}
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2F5D34]/10 border border-[#2F5D34]/20 text-[#2F5D34] text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Customer
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
                  Customer ID: <strong className="text-[#2F5D34] font-semibold">{user.id.slice(0, 13)}</strong>
                </span>
              )}
              {user?.createdAt && (
                <span className="bg-gray-100/80 px-2.5 py-1 rounded-md">
                  Member since: <strong className="text-gray-700">{new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</strong>
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
            <span className="text-lg font-bold text-[#222123]">
              {user?.loyaltyPoints?.toLocaleString() || "1,450"}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Points
            </span>
          </div>

          {/* Orders */}
          <button
            onClick={() => onNavigateSection && onNavigateSection("orders")}
            className="flex flex-col items-center justify-center bg-white hover:bg-emerald-50/50 p-3.5 px-5 rounded-2xl border border-gray-200 shadow-sm transition-all text-center min-w-[110px] cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-[#2F5D34] mb-1" />
            <span className="text-lg font-bold text-[#222123]">
              {stats?.totalOrders ?? user?.ordersCount ?? 0}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Orders
            </span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => onNavigateSection && onNavigateSection("wishlist")}
            className="flex flex-col items-center justify-center bg-white hover:bg-rose-50/50 p-3.5 px-5 rounded-2xl border border-gray-200 shadow-sm transition-all text-center min-w-[110px] cursor-pointer"
          >
            <Heart className="w-5 h-5 text-rose-500 mb-1" />
            <span className="text-lg font-bold text-[#222123]">
              {stats?.wishlistCount ?? user?.wishlistCount ?? 0}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Wishlist
            </span>
          </button>

          {/* Cart */}
          <button
            onClick={() => onNavigateSection && onNavigateSection("cart")}
            className="flex flex-col items-center justify-center bg-white hover:bg-amber-50/50 p-3.5 px-5 rounded-2xl border border-gray-200 shadow-sm transition-all text-center min-w-[110px] cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-amber-600 mb-1" />
            <span className="text-lg font-bold text-[#222123]">
              {stats?.cartCount ?? user?.cartCount ?? 0}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Cart Items
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
