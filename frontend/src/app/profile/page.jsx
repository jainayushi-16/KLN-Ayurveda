"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import PersonalInfoSection from "@/components/profile/PersonalInfoSection";
import ProfilePhotoSection from "@/components/profile/ProfilePhotoSection";
import AddressBookSection from "@/components/profile/AddressBookSection";
import OrdersSection from "@/components/profile/OrdersSection";
import WishlistSection from "@/components/profile/WishlistSection";
import PaymentMethodsSection from "@/components/profile/PaymentMethodsSection";
import SecuritySection from "@/components/profile/SecuritySection";
import NotificationsSection from "@/components/profile/NotificationsSection";
import PrivacySection from "@/components/profile/PrivacySection";
import HelpSupportSection from "@/components/profile/HelpSupportSection";
import AccountStatsSection from "@/components/profile/AccountStatsSection";
import RecentActivitySection from "@/components/profile/RecentActivitySection";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

import {
  DUMMY_PROFILE_USER,
  DUMMY_ADDRESSES,
  DUMMY_ORDERS_LIST,
  DUMMY_WISHLIST,
  DUMMY_PAYMENT_METHODS,
  DUMMY_SECURITY_DEVICES,
  DUMMY_NOTIFICATION_SETTINGS,
  DUMMY_HELP_FAQS,
  DUMMY_ACCOUNT_STATS,
  DUMMY_RECENT_ACTIVITIES,
} from "@/data/profile";
import { profileApi } from "@/services/profile.api";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Local State holding data (Pure local state, no active backend connection)
  const [user, setUser] = useState(DUMMY_PROFILE_USER);
  const [addresses, setAddresses] = useState(DUMMY_ADDRESSES);
  const [orders, setOrders] = useState(DUMMY_ORDERS_LIST);
  const [wishlist, setWishlist] = useState(DUMMY_WISHLIST);
  const [paymentMethods, setPaymentMethods] = useState(DUMMY_PAYMENT_METHODS);
  const [securityDevices, setSecurityDevices] = useState(DUMMY_SECURITY_DEVICES);
  const [notificationSettings, setNotificationSettings] = useState(DUMMY_NOTIFICATION_SETTINGS);
  const [accountStats, setAccountStats] = useState(DUMMY_ACCOUNT_STATS);
  const [recentActivities, setRecentActivities] = useState(DUMMY_RECENT_ACTIVITIES);

  // Simulated initial data load (Comments backend API integration call)
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        // Backend API Integration Point (Commented out for standalone dummy mode)
        /*
        const [profileRes, addrRes, ordersRes, wishlistRes] = await Promise.all([
          profileApi.getProfile(),
          profileApi.getAddresses(),
          profileApi.getOrders(),
          profileApi.getWishlist(),
        ]);
        if (profileRes.success) setUser(profileRes.data);
        if (addrRes.success) setAddresses(addrRes.data);
        if (ordersRes.success) setOrders(ordersRes.data);
        if (wishlistRes.success) setWishlist(wishlistRes.data);
        */

        await new Promise((resolve) => setTimeout(resolve, 350));
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
  };

  const handleUpdateAvatar = (avatarUrl) => {
    setUser((prev) => ({ ...prev, avatar: avatarUrl }));
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    setUser((prev) => ({ ...prev, wishlistCount: Math.max(0, prev.wishlistCount - 1) }));
  };

  const handleRevokeDevice = (deviceId) => {
    setSecurityDevices((prev) => prev.filter((d) => d.id !== deviceId));
    toast.success("Device session revoked successfully.", { icon: "🔒" });
  };

  const handleLogoutAllDevices = () => {
    setSecurityDevices((prev) => prev.filter((d) => d.isCurrent));
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.", { icon: "👋" });
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
      {/* Navigation Header */}
      <ShopNavBar searchQuery="" onSearchChange={() => {}} />

      {/* Botanical Organic Background Textures */}
      <Image
        src="/images/branch.svg"
        alt=""
        width={450}
        height={450}
        className="absolute top-24 right-5 opacity-15 pointer-events-none floating-leaf z-0"
      />
      <Image
        src="/images/leaf.svg"
        alt=""
        width={350}
        height={350}
        className="absolute bottom-40 left-5 opacity-15 pointer-events-none floating-leaf z-0"
      />

      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 py-8 sm:py-12 relative z-10">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* Header Profile Banner */}
            <ProfileHeader
              user={user}
              onEditPhotoClick={() => setActiveTab("edit-profile")}
              onNavigateSection={(tabId) => setActiveTab(tabId)}
            />

            {/* Mobile Tab Selector */}
            <div className="lg:hidden mb-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white shadow-md overflow-x-auto flex items-center gap-2">
              <span className="text-xs font-bold text-[#2F5D34] uppercase tracking-wider flex-none px-2">
                Section:
              </span>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 py-2 px-3 rounded-xl outline-none focus:border-[#2F5D34]"
              >
                <option value="overview">My Profile (Overview)</option>
                <option value="edit-profile">Edit Profile & Photo</option>
                <option value="orders">My Orders (12)</option>
                <option value="track-orders">Track Orders</option>
                <option value="wishlist">Wishlist (8)</option>
                <option value="addresses">Saved Addresses</option>
                <option value="payment">Payment Methods</option>
                <option value="notifications">Notifications</option>
                <option value="security">Security & 2FA</option>
                <option value="password">Change Password</option>
                <option value="privacy">Privacy Settings</option>
                <option value="stats">Account Statistics</option>
                <option value="activity">Recent Activity</option>
                <option value="help">Help & Support</option>
              </select>
            </div>

            {/* Layout: Sidebar + Active Section */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Sidebar */}
              <ProfileSidebar
                activeTab={activeTab}
                onSelectTab={(tabId) => setActiveTab(tabId)}
                onLogout={handleLogout}
              />

              {/* Main Content Area */}
              <div className="flex-1 w-full space-y-8">
                {/* 1. Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <PersonalInfoSection user={user} onUpdateUser={handleUpdateUser} />
                    <AccountStatsSection stats={accountStats} />
                    <RecentActivitySection
                      activities={recentActivities}
                      onNavigateSection={(tabId) => setActiveTab(tabId)}
                    />
                  </div>
                )}

                {/* 2. Edit Profile */}
                {activeTab === "edit-profile" && (
                  <div className="space-y-8">
                    <ProfilePhotoSection user={user} onUpdateAvatar={handleUpdateAvatar} />
                    <PersonalInfoSection user={user} onUpdateUser={handleUpdateUser} />
                  </div>
                )}

                {/* 3. My Orders */}
                {activeTab === "orders" && (
                  <OrdersSection
                    orders={orders}
                    onSelectTrackOrder={() => setActiveTab("track-orders")}
                  />
                )}

                {/* 4. Track Orders */}
                {activeTab === "track-orders" && (
                  <OrdersSection
                    orders={orders}
                    onSelectTrackOrder={() => setActiveTab("track-orders")}
                  />
                )}

                {/* 5. Wishlist */}
                {activeTab === "wishlist" && (
                  <WishlistSection
                    wishlistItems={wishlist}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                  />
                )}

                {/* 6. Saved Addresses */}
                {activeTab === "addresses" && (
                  <AddressBookSection
                    addresses={addresses}
                    onUpdateAddresses={(updated) => setAddresses(updated)}
                  />
                )}

                {/* 7. Payment Methods */}
                {activeTab === "payment" && (
                  <PaymentMethodsSection
                    paymentMethods={paymentMethods}
                    onUpdatePaymentMethods={(updated) => setPaymentMethods(updated)}
                  />
                )}

                {/* 8. Notifications */}
                {activeTab === "notifications" && (
                  <NotificationsSection
                    initialSettings={notificationSettings}
                    onSaveSettings={(updated) => setNotificationSettings(updated)}
                  />
                )}

                {/* 9. Security */}
                {activeTab === "security" && (
                  <SecuritySection
                    devices={securityDevices}
                    onRevokeDevice={handleRevokeDevice}
                    onLogoutAllDevices={handleLogoutAllDevices}
                  />
                )}

                {/* 10. Change Password */}
                {activeTab === "password" && (
                  <SecuritySection
                    devices={securityDevices}
                    onRevokeDevice={handleRevokeDevice}
                    onLogoutAllDevices={handleLogoutAllDevices}
                  />
                )}

                {/* 11. Privacy Settings */}
                {activeTab === "privacy" && <PrivacySection />}

                {/* 12. Account Statistics */}
                {activeTab === "stats" && <AccountStatsSection stats={accountStats} />}

                {/* 13. Recent Activity */}
                {activeTab === "activity" && (
                  <RecentActivitySection
                    activities={recentActivities}
                    onNavigateSection={(tabId) => setActiveTab(tabId)}
                  />
                )}

                {/* 14. Help & Support */}
                {activeTab === "help" && <HelpSupportSection faqs={DUMMY_HELP_FAQS} />}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
