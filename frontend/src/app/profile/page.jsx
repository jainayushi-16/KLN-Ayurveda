"use client";

import { useState, useEffect, useRef, Suspense } from "react";
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
import ReviewsManagerSection from "@/components/admin/ReviewsManagerSection";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

import {
  DUMMY_PAYMENT_METHODS,
  DUMMY_NOTIFICATION_SETTINGS,
  DUMMY_HELP_FAQS,
} from "@/data/profile";
import { getStoredAddresses, saveStoredAddresses } from "@/utils/addressStorage";
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
  "admin-reviews",
  "notifications",
  "password",
  "help",
];

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab");

  const { user: authUser, isAuthenticated, openAuthModal, logout } = useAuthStore();
  const { orders: storeOrders } = useOrderStore();
  const { items: cartItems } = useCartStore();
  const { wishlistIds, items: storeWishlistItems, fetchWishlist, removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
      openAuthModal("Please sign in to access your profile & account dashboard.");
    }
  }, [isAuthenticated, router, openAuthModal]);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    if (urlTab && VALID_TABS.includes(urlTab)) return urlTab;
    return "edit-profile";
  });

  const isAdmin = Boolean(
    authUser && (authUser.role === "ADMIN" || (authUser.email && typeof authUser.email === "string" && authUser.email.toLowerCase().includes("admin")))
  );

  useEffect(() => {
    if (urlTab) {
      if (urlTab === "admin-reviews" && !isAdmin) {
        setActiveTab("edit-profile");
        router.replace("/profile?tab=edit-profile", { scroll: false });
      } else if (VALID_TABS.includes(urlTab)) {
        setActiveTab(urlTab);
      } else {
        setActiveTab("edit-profile");
        router.replace("/profile?tab=edit-profile", { scroll: false });
      }
    }
  }, [urlTab, isAdmin, router]);

  const handleSelectTab = (tabId) => {
    if (!VALID_TABS.includes(tabId)) {
      tabId = "edit-profile";
    }
    setActiveTab(tabId);
    router.replace(`/profile?tab=${tabId}`, { scroll: false });
  };

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

  const [addresses, setAddresses] = useState(getStoredAddresses());
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState(DUMMY_PAYMENT_METHODS);
  const [notificationSettings, setNotificationSettings] = useState(DUMMY_NOTIFICATION_SETTINGS);

  useEffect(() => {
    if (authUser) {
      setUser((prev) => {
        const fn = prev.firstName || authUser.firstName || "";
        const ln = prev.lastName || authUser.lastName || "";
        const fnm = prev.fullName || `${fn} ${ln}`.trim() || prev.email || authUser.email || "Customer";
        return {
          ...authUser,
          ...prev,
          firstName: fn,
          lastName: ln,
          email: prev.email || authUser.email || "",
          phone: prev.phone || authUser.phone || "",
          fullName: fnm,
        };
      });
    }
  }, [authUser]);

  useEffect(() => {
    setOrders(storeOrders || []);
  }, [storeOrders]);

  const hasLoadedProfileRef = useRef(false);

  useEffect(() => {
    if (hasLoadedProfileRef.current || !isAuthenticated) return;
    hasLoadedProfileRef.current = true;

    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        useOrderStore.getState().fetchUserOrders().catch(() => {});
        useWishlistStore.getState().fetchWishlist().catch(() => {});

        const [profileRes, addrRes, wishlistRes] = await Promise.allSettled([
          profileApi.getProfile(),
          profileApi.getAddresses(),
          profileApi.getWishlist(),
        ]);

        if (profileRes.status === "fulfilled" && profileRes.value?.data) {
          const fetched = profileRes.value.data;
          const savedAvatar = typeof window !== "undefined" ? localStorage.getItem("kln_avatar") : null;
          const persistentAvatar = fetched.avatar || savedAvatar || authUser?.avatar;

          setUser((prev) => {
            const fn = fetched.firstName || prev.firstName || authUser?.firstName || "";
            const ln = fetched.lastName || prev.lastName || authUser?.lastName || "";
            const fnm = `${fn} ${ln}`.trim() || fetched.email || prev.email || "Customer";
            return {
              ...prev,
              ...fetched,
              firstName: fn,
              lastName: ln,
              fullName: fnm,
              avatar: persistentAvatar || prev.avatar,
            };
          });
        }
        if (addrRes.status === "fulfilled" && addrRes.value?.data && Array.isArray(addrRes.value.data) && addrRes.value.data.length > 0) {
          setAddresses(addrRes.value.data);
          saveStoredAddresses(addrRes.value.data);
        } else {
          setAddresses(getStoredAddresses());
        }
        if (wishlistRes.status === "fulfilled" && wishlistRes.value?.data) {
          const items = Array.isArray(wishlistRes.value.data)
            ? wishlistRes.value.data
            : wishlistRes.value.data.items || [];
          setWishlist(items);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [isAuthenticated]);

  const handleUpdateUser = async (updatedData) => {
    const fn = updatedData.firstName || user.firstName || "";
    const ln = updatedData.lastName || user.lastName || "";
    const email = updatedData.email || user.email || "";
    const phone = updatedData.phone || user.phone || "";
    const dob = updatedData.dateOfBirth || user.dateOfBirth || "1998-05-18";
    const gender = updatedData.gender || user.gender || "Male";
    const newFullName = `${fn} ${ln}`.trim() || email || "Customer";

    const mergedUser = {
      ...user,
      firstName: fn,
      lastName: ln,
      email,
      phone,
      dateOfBirth: dob,
      gender,
      fullName: newFullName,
    };

    setUser(mergedUser);
    useAuthStore.getState().updateUser(mergedUser);

    toast.success("Personal information updated successfully! 🌿", {
      icon: "🌿",
      style: {
        borderRadius: "16px",
        background: "#2F5D34",
        color: "#fff",
        fontWeight: "bold",
      },
    });

    try {
      await profileApi.updateProfile({
        firstName: fn,
        lastName: ln,
        phone,
      });
    } catch (err) {
      console.error("Backend profile update note:", err);
    }
  };

  const handleUpdateAvatar = async (avatarUrl) => {
    setUser((prev) => ({ ...prev, avatar: avatarUrl }));
    useAuthStore.getState().updateUser({ avatar: avatarUrl });
    try {
      await profileApi.updateProfile({ avatar: avatarUrl });
    } catch (err) {
      console.error("Avatar API sync note:", err);
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    setWishlist((prev) => prev.filter((item) => (item.productId || item.id) !== productId));
  };

  const activeWishlistCount = Math.max(
    wishlistIds ? wishlistIds.length : 0,
    storeWishlistItems ? storeWishlistItems.length : 0,
    wishlist ? wishlist.length : 0,
    user?.wishlistCount || 0,
    user?.wishlist ? user.wishlist.length : 0
  );

  const activeOrdersCount = Math.max(
    orders ? orders.length : 0,
    storeOrders ? storeOrders.length : 0,
    user?.ordersCount || 0,
    user?.orders ? user.orders.length : 0
  );

  const activeWishlistItems =
    storeWishlistItems && storeWishlistItems.length > 0
      ? storeWishlistItems
      : wishlist;

  const profileStats = {
    totalOrders: activeOrdersCount,
    wishlistCount: activeWishlistCount,
    savedAddressesCount: addresses.length,
    cartCount: (cartItems || []).reduce((acc, item) => acc + (item.quantity || 1), 0),
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
      {/* Navigation Header */}
      <ShopNavBar />

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* Header Profile Section */}
            <ProfileHeader
              user={user}
              stats={profileStats}
              onNavigateSection={(section) => {
                if (section === "cart") router.push("/cart");
                else handleSelectTab(section);
              }}
            />

            {/* Main Content Layout */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sidebar Tabs */}
              <div className="lg:col-span-3">
                <ProfileSidebar
                  activeTab={activeTab}
                  onSelectTab={handleSelectTab}
                  onLogout={logout}
                  ordersCount={activeOrdersCount}
                  wishlistCount={activeWishlistCount}
                />
              </div>

              {/* Dynamic Tab Panes */}
              <div className="lg:col-span-9 space-y-6">
                {/* 1. Edit Profile */}
                {activeTab === "edit-profile" && (
                  <>
                    <ProfilePhotoSection
                      avatarUrl={user.avatar}
                      onUpdateAvatar={handleUpdateAvatar}
                    />
                    <PersonalInfoSection
                      user={user}
                      onUpdateUser={handleUpdateUser}
                      onSave={handleUpdateUser}
                    />
                  </>
                )}

                {/* 2. Orders History */}
                {activeTab === "orders" && (
                  <OrdersSection
                    orders={orders}
                    onSelectTrackOrder={() => handleSelectTab("orders")}
                  />
                )}

                {/* 3. Wishlist */}
                {activeTab === "wishlist" && (
                  <WishlistSection
                    wishlistItems={activeWishlistItems}
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

                {/* 5b. Admin Reviews Manager */}
                {activeTab === "admin-reviews" && <ReviewsManagerSection />}

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
