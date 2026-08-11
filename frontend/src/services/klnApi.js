import { apiRequest } from "./api";

// 1. Products API
export async function fetchProducts(queryParams = {}) {
  const query = new URLSearchParams(queryParams).toString();
  const endpoint = query ? `/products?${query}` : "/products";
  return apiRequest(endpoint);
}

export async function fetchProductDetails(idOrSlug) {
  return apiRequest(`/products/${idOrSlug}`);
}

// 2. Cart API
export async function fetchCart() {
  return apiRequest("/cart");
}

export async function addToCartApi(productId, quantity = 1) {
  return apiRequest("/cart/items", { method: "POST", body: JSON.stringify({ productId, quantity }) });
}

export async function updateCartItemQuantityApi(productId, quantity) {
  return apiRequest("/cart/items", { method: "PUT", body: JSON.stringify({ productId, quantity }) });
}

export async function removeFromCartApi(productId) {
  return apiRequest(`/cart/items/${productId}`, { method: "DELETE" });
}

export async function clearCartApi() {
  return apiRequest("/cart", { method: "DELETE" });
}

// 3. Wishlist API
export async function fetchWishlist() {
  return apiRequest("/wishlist");
}

export async function addToWishlistApi(productId) {
  return apiRequest("/wishlist/items", { method: "POST", body: JSON.stringify({ productId }) });
}

export async function removeFromWishlistApi(productId) {
  return apiRequest(`/wishlist/items/${productId}`, { method: "DELETE" });
}

export async function moveWishlistToCartApi(productId) {
  return apiRequest("/wishlist/move-to-cart", { method: "POST", body: JSON.stringify({ productId }) });
}

// 4. Orders API
export async function placeOrderApi(shippingAddress, paymentMethod = "CREDIT_CARD", buyNowItem = null) {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify({ shippingAddress, paymentMethod, ...(buyNowItem ? { buyNowItem } : {}) }),
  });
}

export async function trackOrderApi(orderNumber) {
  return apiRequest(`/orders/track/${orderNumber}`);
}

// 5. Newsletter API
export async function subscribeNewsletterApi(email) {
  return apiRequest("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email }) });
}

// 6. Contact API
export async function submitContactApi(contactData) {
  return apiRequest("/contact", { method: "POST", body: JSON.stringify(contactData) });
}
