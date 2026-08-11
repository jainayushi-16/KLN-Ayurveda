import { create } from "zustand";

export const useOrderStore = create((set, get) => ({
  shippingAddress: {
    fullName: "Aarav Patel",
    email: "aarav.patel@example.com",
    phone: "+91 98765 43210",
    street: "74 Green Park Avenue, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    country: "India",
  },
  deliveryMethod: "standard", // "standard" (Free) or "express" (₹99)
  couponCode: "",
  discountPercent: 0,
  orders: [],
  currentOrder: null,

  setShippingAddress: (address) =>
    set((state) => ({
      shippingAddress: { ...state.shippingAddress, ...address },
    })),

  setDeliveryMethod: (method) => set({ deliveryMethod: method }),

  applyCoupon: (code) => {
    if (code.toUpperCase() === "AYURVEDA10") {
      set({ couponCode: "AYURVEDA10", discountPercent: 0.1 });
      return { success: true, message: "Coupon AYURVEDA10 applied (10% OFF)" };
    }
    return { success: false, message: "Invalid promo code. Try AYURVEDA10" };
  },

  placeOrder: (cartItemsOrObj, grandTotalArg, paymentDetailsArg) => {
    let cartItems = [];
    let totals = 0;
    let paymentMethod = "UPI";
    let paymentDetails = {};

    if (Array.isArray(cartItemsOrObj)) {
      cartItems = cartItemsOrObj;
      totals = grandTotalArg;
      paymentDetails = paymentDetailsArg || {};
      paymentMethod = paymentDetails.method || "Online";
    } else if (cartItemsOrObj && typeof cartItemsOrObj === "object") {
      cartItems = cartItemsOrObj.cartItems || [];
      totals = cartItemsOrObj.totals || 0;
      paymentMethod = cartItemsOrObj.paymentMethod || cartItemsOrObj.paymentDetails?.method || "Online";
      paymentDetails = cartItemsOrObj.paymentDetails || {};
    }

    const orderId = "KLN-" + Math.floor(100000 + Math.random() * 900000);
    const invoiceNo = "INV-2026-" + Math.floor(1000 + Math.random() * 9000);
    const orderDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const newOrder = {
      orderId,
      invoiceNo,
      orderDate,
      items: cartItems,
      totals,
      shippingAddress: get().shippingAddress,
      deliveryMethod: get().deliveryMethod,
      paymentMethod,
      paymentDetails,
      paymentStatus: paymentMethod === "COD" ? "Pending (Cash on Delivery)" : "PAID",
      estimatedDelivery: get().deliveryMethod === "express" ? "3-4 Business Days" : "5-7 Business Days",
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      currentOrder: newOrder,
    }));

    return newOrder;
  },

  getOrderById: (orderId) => {
    return get().orders.find((o) => o.orderId === orderId) || get().currentOrder;
  },
}));
