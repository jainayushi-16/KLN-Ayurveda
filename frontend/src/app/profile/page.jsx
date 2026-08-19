"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
import NotificationsSection from "@/components/profile/NotificationsSection";
import ChangePasswordSection from "@/components/profile/ChangePasswordSection";
import HelpSupportSection from "@/components/profile/HelpSupportSection";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

import {
  DUMMY_PAYMENT_METHODS,
  DUMMY_NOTIFICATION_SETTINGS,
  DUMMY_HELP_FAQS,
} from "@/data/profile";
import { profileApi } from "@/services/profile.api";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";

const VALID_TABS = [
  "edit-profile",
  "orders",
  "wishlist",
  "addresses",
  "payment",
  "notifications",
  "password",
  "help",
];

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab");

  const { user: authUser, logout } = useAuthStore();
  const { orders: storeOrders } = useOrderStore();
  const { items: cartItems } = useCartStore();
  const { wishlistIds } = useWishlistStore();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    if (urlTab && VALID_TABS.includes(urlTab)) return urlTab;
    return "edit-profile";
  });

  useEffect(() => {
    if (urlTab) {
      if (VALID_TABS.includes(urlTab)) {
        setActiveTab(urlTab);
      } else {
        // Redirect obsolete tabs (overview, track-orders, security, privacy, stats, activity) to edit-profile
        setActiveTab("edit-profile");
        router.replace("/profile?tab=edit-profile", { scroll: false });
      }
    }
  }, [urlTab, router]);

  const handleSelectTab = (tabId) => {
    if (!VALID_TABS.includes(tabId)) {
      tabId = "edit-profile";
    }
    setActiveTab(tabId);
    router.replace(`/profile?tab=${tabId}`, { scroll: false });
  };

  // Local state holding authenticated customer data from backend
  const [user, setUser] = useState(() => {
    if (authUser) {
      return {
        ...authUser,
        fullName: `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || authUser.email || "Customer",
      };
    }
    return {
      id: "",
      firstName: "",
      lastName: "",
      fullName: "Customer",
      email: "",
      phone: "",
    };
  });

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState(DUMMY_PAYMENT_METHODS);
  const [notificationSettings, setNotificationSettings] = useState(DUMMY_NOTIFICATION_SETTINGS);

  // Sync user state whenever authUser changes
  useEffect(() => {
    if (authUser) {
      setUser((prev) => ({
        ...prev,
        ...authUser,
        fullName: `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || authUser.email || prev.fullName,
      }));
    }
  }, [authUser]);

  // Sync orders with storeOrders
  useEffect(() => {
    setOrders(storeOrders || []);
  }, [storeOrders]);

  // Load profile & order data from real backend
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        useOrderStore.getState().fetchUserOrders();
        const [profileRes, addrRes, wishlistRes] = await Promise.all([
          profileApi.getProfile(),
          profileApi.getAddresses(),
          profileApi.getWishlist(),
        ]);

        if (profileRes && profileRes.data) {
          const fetched = profileRes.data;
          setUser((prev) => ({
            ...prev,
            ...fetched,
            fullName: `${fetched.firstName || ''} ${fetched.lastName || ''}`.trim() || fetched.email || prev.fullName,
          }));
        }
        if (addrRes && addrRes.data) {
          setAddresses(addrRes.data);
        }
        if (wishlistRes && wishlistRes.data) {
          setWishlist(wishlistRes.data);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleUpdateUser = async (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    try {
      await profileApi.updateProfile(updatedData);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile.");
    }
  };

  const handleUpdateAvatar = (avatarUrl) => {
    setUser((prev) => ({ ...prev, avatar: avatarUrl }));
  };

  const handleRemoveFromWishlist = async (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    try {
      await profileApi.removeFromWishlist?.(productId);
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.", { icon: "👋" });
    router.push("/");
  };

  const enrichedUser = {
    ...user,
    ordersCount: orders.length,
    wishlistCount: Math.max(wishlist.length, wishlistIds.length),
    cartCount: cartItems.length,
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
      {/* Navigation Header */}
      <ShopNavBar searchQuery="" onSearchChange={() => {}} />

      {/* Botanical Background Textures */}
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
              user={enrichedUser}
              onEditPhotoClick={() => handleSelectTab("edit-profile")}
              onNavigateSection={(tabId) => {
                if (tabId === "cart") {
                  router.push("/cart");
                } else {
                  handleSelectTab(tabId);
                }
              }}
            />

            {/* Mobile Tab Selector */}
            <div className="lg:hidden mb-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white shadow-md flex items-center gap-2">
              <span className="text-xs font-bold text-[#2F5D34] uppercase tracking-wider flex-none px-2">
                Section:
              </span>
              <select
                value={activeTab}
                onChange={(e) => handleSelectTab(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 py-2 px-3 rounded-xl outline-none focus:border-[#2F5D34]"
              >
                <option value="edit-profile">Edit Profile & Photo</option>
                <option value="orders">My Orders ({orders.length})</option>
                <option value="wishlist">Wishlist ({enrichedUser.wishlistCount})</option>
                <option value="addresses">Saved Addresses</option>
                <option value="payment">Payment Methods</option>
                <option value="notifications">Notifications</option>
                <option value="password">Change Password</option>
                <option value="help">Help & Support</option>
              </select>
            </div>

            {/* Layout: Sidebar + Active Section */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Sidebar */}
              <ProfileSidebar
                activeTab={activeTab}
                onSelectTab={handleSelectTab}
                onLogout={handleLogout}
                ordersCount={orders.length}
                wishlistCount={enrichedUser.wishlistCount}
              />

              {/* Main Content Area */}
              <div className="flex-1 w-full space-y-8">
                {/* 1. Edit Profile */}
                {activeTab === "edit-profile" && (
                  <div className="space-y-8">
                    <ProfilePhotoSection user={enrichedUser} onUpdateAvatar={handleUpdateAvatar} />
                    <PersonalInfoSection user={enrichedUser} onUpdateUser={handleUpdateUser} />
                  </div>
                )}

                {/* 2. My Orders */}
                {activeTab === "orders" && (
                  <OrdersSection
                    user={enrichedUser}
                    orders={orders}
                    onSelectTrackOrder={() => handleSelectTab("orders")}
                  />
                )}

                {/* 3. Wishlist */}
                {activeTab === "wishlist" && (
                  <WishlistSection
                    wishlistItems={wishlist}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                  />
                )}

                {/* 4. Saved Addresses */}
                {activeTab === "addresses" && (
                  <AddressBookSection
                    addresses={addresses}
                    onUpdateAddresses={(updated) => setAddresses(updated)}
                  />
                )}

                {/* 5. Payment Methods */}
                {activeTab === "payment" && (
                  <PaymentMethodsSection
                    paymentMethods={paymentMethods}
                    onUpdatePaymentMethods={(updated) => setPaymentMethods(updated)}
                  />
                )}

                {/* 6. Notifications */}
                {activeTab === "notifications" && (
                  <NotificationsSection
                    initialSettings={notificationSettings}
                    onSaveSettings={(updated) => setNotificationSettings(updated)}
                  />
                )}

                {/* 7. Change Password */}
                {activeTab === "password" && <ChangePasswordSection />}

                {/* 8. Help & Support */}
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

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
