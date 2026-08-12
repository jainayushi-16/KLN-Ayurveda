"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import ProductCard from "@/components/shop/ProductCard";
import { PRODUCTS } from "@/constants/products";
import { INITIAL_REVIEWS, RATING_BREAKDOWN } from "@/constants/reviews";
import { productApi } from "@/services/product.api";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useBuyNowStore } from "@/store/useBuyNowStore";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  // Fetch product from API
  const { data: productData, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await productApi.getProductDetails(productId);
      return res?.data?.product || null;
    },
    enabled: !!productId,
  });

  // Fetch reviews from API
  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await productApi.getProductDetails(productId);
      return res?.data?.reviews || [];
    },
    enabled: !!productId,
  });

  // Use API data if available, fallback to local data
  const apiProduct = productData;
  const localProduct = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  const product = apiProduct || localProduct;

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id);

  // Handle product not found
  useEffect(() => {
    if (productError || (!productLoading && !product)) {
      toast.error("Product not found. Redirecting to shop.");
      router.push("/shop");
    }
  }, [productError, productLoading, product, router]);

  // Gallery state
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", transformOrigin: "center" });

  // Purchase state
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // "description" | "ingredients" | "usage" | "specs"

  // Reviews state - use API reviews if available, fallback to local
  const [reviewsList, setReviewsList] = useState(
    reviewsData && reviewsData.length > 0 ? reviewsData : INITIAL_REVIEWS.filter((r) => r.productId === product.id || r.productId === "kln-hair-oil-01")
  );

  // Update reviews when API data changes
  useEffect(() => {
    if (reviewsData && reviewsData.length > 0) {
      setReviewsList(reviewsData);
    }
  }, [reviewsData]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");

  const { addToCart } = useCartStore();
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const { setBuyNowProduct } = useBuyNowStore();
  const isWishlisted = wishlistIds.includes(product.id);

  // Desktop Hover Zoom Lens
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", transformOrigin: "center" });
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const handleBuyNow = () => {
    setBuyNowProduct(product, quantity);
    router.push("/checkout?buyNow=true");
  };

  const handleToggleReviewForm = () => {
    if (!useAuthStore.getState().isAuthenticated) {
      toast.error("Please sign in to write a customer review.");
      useAuthStore.getState().openAuthModal("Please sign in to write a customer review.");
      return;
    }
    setShowReviewForm((prev) => !prev);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!useAuthStore.getState().isAuthenticated) {
      toast.error("Please sign in to post a customer review.");
      useAuthStore.getState().openAuthModal("Please sign in to write a customer review.");
      return;
    }

    if (!newTitle.trim() || !newComment.trim()) {
      toast.error("Please fill in both the review title and message.");
      return;
    }

    const reviewPayload = {
      productId: product.id,
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
    };

    const newReviewItem = {
      id: "rev-" + Date.now(),
      productId: product.id,
      userName: authUser?.firstName
        ? `${authUser.firstName} ${authUser.lastName || ''}`.trim()
        : authUser?.fullName || "Verified Customer",
      userAvatar: authUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      rating: newRating,
      date: "Just now",
      verifiedPurchase: true,
      title: newTitle.trim(),
      comment: newComment.trim(),
      images: [],
      helpfulCount: 0,
    };

    // Optimistically update UI immediately for authenticated customer
    setReviewsList((prev) => [newReviewItem, ...prev]);
    setNewTitle("");
    setNewComment("");
    setShowReviewForm(false);
    toast.success("Thank you! Your review has been published. 🎉");

    try {
      await productApi.createReview(reviewPayload);
    } catch (err) {
      console.log("Review saved locally for session.");
    }
  };

  return (
    <main className="min-h-screen w-full relative bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
      <ShopNavBar cartCount={useCartStore((s) => s.totalItems)} wishlistCount={wishlistIds.length} />

      {/* Breadcrumb Navigation */}
      <div className="pt-24 px-6 md:px-12 max-w-[1800px] mx-auto text-xs font-bold uppercase tracking-wider text-gray-500">
        <Link href="/" className="hover:text-[#2F5D34]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-[#2F5D34]">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-[#2F5D34] font-extrabold">{product.name}</span>
      </div>

      {/* Main PDP Grid: Gallery (Left 50%) + Info (Right 50%) */}
      <section className="pt-6 pb-20 px-6 md:px-12 max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left Column: Image Gallery & Thumbnails */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row-reverse gap-4">
            {/* Main Featured Image with Desktop Zoom */}
            <div
              className="relative w-full h-[450px] sm:h-[550px] lg:h-[620px] rounded-[2.5rem] overflow-hidden bg-[#F6F3EC] border border-white/80 shadow-xl cursor-crosshair group"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={product.images[selectedImgIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-300"
                style={{
                  transform: zoomStyle.display === "block" ? "scale(2.2)" : "scale(1)",
                  transformOrigin: zoomStyle.transformOrigin,
                }}
              />

              {/* Badge Overlay */}
              {product.badge && (
                <span className="absolute top-6 left-6 z-10 px-4 py-2 rounded-full bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-widest shadow-md">
                  {product.badge}
                </span>
              )}

              {/* Wishlist Button Overlay */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-6 right-6 z-20 size-12 rounded-full bg-white/80 backdrop-blur-md border border-white/80 flex items-center justify-center text-2xl shadow-lg hover:bg-white transition-all"
              >
                <span className={isWishlisted ? "text-red-500" : "text-gray-400"}>
                  {isWishlisted ? "♥" : "♡"}
                </span>
              </button>
            </div>

            {/* Thumbnails Column / Strip */}
            <div className="flex sm:flex-col gap-3 flex-none overflow-x-auto sm:overflow-y-auto">
              {product.images.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`relative size-20 sm:size-24 rounded-2xl overflow-hidden border-2 transition-all flex-none bg-white ${
                    selectedImgIndex === idx ? "border-[#2F5D34] shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={imgSrc} alt="" fill className="object-cover object-center" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info & Purchase Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                <span className="px-3.5 py-1 rounded-full bg-[#5B7C3A]/15 text-[#5B7C3A]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-[#C9A66B]">
                  <span>★ {product.rating}</span>
                  <a href="#reviews-section" className="text-gray-500 font-medium underline hover:text-[#2F5D34]">
                    ({reviewsList.length + product.reviewsCount} Customer Reviews)
                  </a>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl sm:text-5xl font-bold text-[#222123] mt-3 leading-tight">
                {product.name}
              </h1>

              {/* Price & Discounts */}
              <div className="mt-5 flex items-baseline gap-4">
                <span className="text-4xl font-bold text-[#2F5D34]">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl font-paragraph text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-paragraph mt-1">Inclusive of all taxes. Free Shipping on orders over ₹499.</p>

              {/* Short Description */}
              <p className="mt-6 text-base sm:text-lg font-paragraph text-gray-700 leading-relaxed">
                {product.fullDesc || product.shortDesc}
              </p>

              {/* Stock Availability Badge */}
              <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-700">
                <span className="size-2.5 rounded-full bg-green-500 animate-ping" />
                <span>In Stock — Ships within 24 Hours</span>
              </div>

              {/* Quantity Selector & CTAs */}
              <div className="mt-8 pt-8 border-t border-[#2F5D34]/15 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Quantity Control */}
                <div className="flex items-center justify-between border-2 border-[#2F5D34]/20 rounded-full px-4 py-2 bg-white flex-none">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-3">Qty:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="size-8 rounded-full bg-gray-100 font-bold text-lg text-gray-700 hover:bg-[#2F5D34] hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-base text-[#222123]">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="size-8 rounded-full bg-gray-100 font-bold text-lg text-gray-700 hover:bg-[#2F5D34] hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 rounded-full border-2 border-[#2F5D34] text-[#2F5D34] hover:bg-[#2F5D34] hover:text-white font-bold text-xs uppercase tracking-widest shadow-md hover:scale-102 transition-all flex items-center justify-center gap-2"
                >
                  <span>🛒</span>
                  <span>Add to Cart</span>
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 px-6 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:shadow-[0_15px_35px_rgba(47,93,52,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <span>⚡</span>
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Delivery & Assurance Highlights */}
              <div className="mt-8 grid grid-cols-2 gap-4 text-xs font-paragraph text-gray-700 bg-white/60 p-4 rounded-2xl border border-white">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚚</span>
                  <span>Express 2-4 Day Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🔄</span>
                  <span>10-Day Easy Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🌿</span>
                  <span>100% Ayurvedic Formulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🔒</span>
                  <span>Secure SSL Checkout</span>
                </div>
              </div>

              {/* Details Tabs Header */}
              <div className="mt-10 pt-8 border-t border-[#2F5D34]/15">
                <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-3">
                  {[
                    { id: "description", label: "Overview" },
                    { id: "ingredients", label: "Ingredients" },
                    { id: "usage", label: "How to Use" },
                    { id: "specs", label: "Specifications" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        activeTab === tab.id
                          ? "bg-[#2F5D34] text-white shadow-sm"
                          : "bg-white/70 text-gray-600 hover:bg-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="mt-5 text-sm font-paragraph text-gray-700 leading-relaxed min-h-[120px]">
                  {activeTab === "description" && (
                    <p>{product.fullDesc || product.shortDesc}</p>
                  )}

                  {activeTab === "ingredients" && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-[#5B7C3A] font-bold">✓</span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === "usage" && (
                    <p className="bg-white/80 p-4 rounded-xl border border-gray-100 italic">
                      &quot;{product.usageInstructions}&quot;
                    </p>
                  )}

                  {activeTab === "specs" && product.specs && (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="font-bold text-[#222123]">Net Volume:</span> {product.specs.netVolume}</div>
                      <div><span className="font-bold text-[#222123]">Formulation:</span> {product.specs.form}</div>
                      <div><span className="font-bold text-[#222123]">Shelf Life:</span> {product.specs.shelfLife}</div>
                      <div><span className="font-bold text-[#222123]">Country of Origin:</span> {product.specs.countryOfOrigin}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amazon-Style Customer Reviews Section */}
      <section id="reviews-section" className="py-16 bg-white/70 backdrop-blur-md border-t border-white">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left: Overall Rating & Rating Breakdown Bars */}
            <div className="w-full lg:w-1/3 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold uppercase text-[#2F5D34] mb-4">Customer Reviews</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-extrabold text-[#222123]">{product.rating}</span>
                <div>
                  <div className="text-xl text-[#C9A66B]">★★★★★</div>
                  <span className="text-xs text-gray-500 font-paragraph">{reviewsList.length + product.reviewsCount} global ratings</span>
                </div>
              </div>

              {/* Star Rating Breakdown Bars */}
              <div className="mt-6 flex flex-col gap-2.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const pct = RATING_BREAKDOWN[stars] || (stars === 5 ? 80 : 10);
                  return (
                    <div key={stars} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                      <span className="w-8">{stars} star</span>
                      <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full bg-[#C9A66B] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-10 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Write a Review Trigger */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-sm text-[#222123] mb-2">Review this product</h4>
                <p className="text-xs text-gray-600 font-paragraph mb-4">Share your experience with other Ayurvedic wellness enthusiasts.</p>
                <button
                  onClick={handleToggleReviewForm}
                  className="w-full py-3 rounded-full border-2 border-[#2F5D34] text-[#2F5D34] font-bold text-xs uppercase tracking-wider hover:bg-[#2F5D34] hover:text-white transition-all text-center"
                >
                  {showReviewForm ? "Cancel Review" : "Write a Customer Review"}
                </button>
              </div>
            </div>

            {/* Right: Review List & Write Form */}
            <div className="w-full lg:w-2/3">
              {/* Interactive Write a Review Form */}
              {showReviewForm && (
                <form onSubmit={handleAddReview} className="mb-10 bg-white rounded-3xl p-8 shadow-xl border border-[#2F5D34]/20 animate-fadeIn">
                  <h4 className="text-xl font-bold uppercase text-[#2F5D34] mb-4">Write Your Review</h4>
                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Overall Rating</label>
                    <div className="flex gap-2 text-2xl cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={star <= newRating ? "text-[#C9A66B]" : "text-gray-300"}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Review Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Summarize your experience..."
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2F5D34]"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Review Details</label>
                    <textarea
                      required
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="What did you like or dislike? How did your hair/skin feel after using?"
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2F5D34]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#224426] transition-all"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Customer Review Cards List */}
              <div className="flex flex-col gap-6">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-[#2F5D34] text-white font-bold flex items-center justify-center text-sm uppercase">
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#222123]">{rev.userName}</div>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="text-sm text-[#C9A66B]">
                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                      </div>
                      <h5 className="font-bold text-base text-[#222123]">{rev.title}</h5>
                    </div>

                    <span className="block text-xs text-gray-400 font-paragraph mt-1">Reviewed in India on {rev.date}</span>

                    <p className="mt-3 text-sm font-paragraph text-gray-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Formulations Carousel/Grid */}
      <section className="py-20 px-6 md:px-12 max-w-[1800px] mx-auto">
        <h2 className="text-3xl font-bold uppercase text-[#2F5D34] mb-8 text-center">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts.map((rel) => (
            <ProductCard
              key={rel.id}
              product={rel}
              onAddToCart={(p, q) => addToCart(p.id, q)}
              onBuyNow={(p, q) => {
                setBuyNowProduct(p, q);
                router.push("/checkout?buyNow=true");
              }}
              onToggleWishlist={toggleWishlist}
              isWishlisted={wishlistIds.includes(rel.id)}
            />
          ))}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
