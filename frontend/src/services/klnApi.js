// Temporary Standalone Mode: Backend API calls commented out
// import { apiRequest } from "./api";
import { PRODUCTS } from "@/data/products";
import { INITIAL_CART } from "@/data/cart";
import { INITIAL_ORDER } from "@/data/orders";

// 1. Products API
export async function fetchProducts(queryParams = {}) {
  // const query = new URLSearchParams(queryParams).toString();
  // const endpoint = query ? `/products?${query}` : "/products";
  // return apiRequest(endpoint);
  return Promise.resolve({ success: true, data: PRODUCTS });
}

export async function fetchProductDetails(idOrSlug) {
  // return apiRequest(`/products/${idOrSlug}`);
  const product = PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || PRODUCTS[0];
  return Promise.resolve({ success: true, data: product });
}

// 2. Cart API
export async function fetchCart() {
  // return apiRequest("/cart");
  return Promise.resolve({ success: true, data: INITIAL_CART });
}

export async function addToCartApi(productId, quantity = 1) {
  // return apiRequest("/cart/items", { method: "POST", body: JSON.stringify({ productId, quantity }) });
  return Promise.resolve({ success: true, message: "Added to cart" });
}

export async function updateCartItemQuantityApi(productId, quantity) {
  // return apiRequest("/cart/items", { method: "PUT", body: JSON.stringify({ productId, quantity }) });
  return Promise.resolve({ success: true, message: "Updated quantity" });
}

export async function removeFromCartApi(productId) {
  // return apiRequest(`/cart/items/${productId}`, { method: "DELETE" });
  return Promise.resolve({ success: true, message: "Removed item" });
}

export async function clearCartApi() {
  // return apiRequest("/cart", { method: "DELETE" });
  return Promise.resolve({ success: true, message: "Cleared cart" });
}

// 3. Wishlist API
export async function fetchWishlist() {
  // return apiRequest("/wishlist");
  return Promise.resolve({ success: true, data: { items: [] } });
}

export async function addToWishlistApi(productId) {
  // return apiRequest("/wishlist/items", { method: "POST", body: JSON.stringify({ productId }) });
  return Promise.resolve({ success: true, message: "Added to wishlist" });
}

export async function removeFromWishlistApi(productId) {
  // return apiRequest(`/wishlist/items/${productId}`, { method: "DELETE" });
  return Promise.resolve({ success: true, message: "Removed from wishlist" });
}

export async function moveWishlistToCartApi(productId) {
  // return apiRequest("/wishlist/move-to-cart", { method: "POST", body: JSON.stringify({ productId }) });
  return Promise.resolve({ success: true, message: "Moved to cart" });
}

// 4. Orders API
export async function placeOrderApi(shippingAddress, paymentMethod = "CREDIT_CARD") {
  // return apiRequest("/orders", { method: "POST", body: JSON.stringify({ shippingAddress, paymentMethod }) });
  return Promise.resolve({ success: true, data: INITIAL_ORDER });
}

export async function trackOrderApi(orderNumber) {
  // return apiRequest(`/orders/track/${orderNumber}`);
  return Promise.resolve({ success: true, data: { status: "DISPATCHED", estimatedDelivery: "3-5 Days" } });
}

// 5. Newsletter API
export async function subscribeNewsletterApi(email) {
  // return apiRequest("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email }) });
  return Promise.resolve({ success: true, message: "Subscribed to newsletter" });
}

// 6. Contact API
export async function submitContactApi(contactData) {
  // return apiRequest("/contact", { method: "POST", body: JSON.stringify(contactData) });
  return Promise.resolve({ success: true, message: "Message sent" });
}
