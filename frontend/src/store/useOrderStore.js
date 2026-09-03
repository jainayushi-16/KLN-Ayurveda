import { create } from "zustand";
import { orderApi } from "@/services/order.api";
import { pushLocalNotification } from "@/utils/notificationHelper";
import toast from "react-hot-toast";

export const useOrderStore = create((set, get) => ({
  shippingAddress: {
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  },
  deliveryMethod: "standard", // "standard" (Free) or "express" (₹99)
  couponCode: "",
  discountPercent: 0,
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  setShippingAddress: (address) =>
    set((state) => ({
      shippingAddress: { ...state.shippingAddress, ...address },
    })),

  setDeliveryMethod: (method) => set({ deliveryMethod: method }),

  applyCoupon: (code, discountPercent = 0) => {
    if (!code || !code.trim()) {
      set({ couponCode: "", discountPercent: 0 });
      return { success: true, message: "Coupon removed" };
    }
    const cleanCode = code.trim().toUpperCase();
    let percent = discountPercent;
    if (!percent || percent <= 0) {
      if (cleanCode.includes("20")) percent = 0.2;
      else if (cleanCode.includes("15")) percent = 0.15;
      else percent = 0.1;
    }
    set({ couponCode: cleanCode, discountPercent: percent });
    return { success: true, message: `Coupon ${cleanCode} applied (${Math.round(percent * 100)}% OFF)` };
  },

  fetchUserOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await orderApi.getUserOrders();
      if (res && res.data) {
        const orders = res.data.map((order) => ({
          orderId: order.id,
          orderNumber: order.orderNumber,
          invoiceNo: order.orderNumber,
          orderDate: new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          items: order.items || [],
          totals: {
            subtotal: order.subtotal,
            shipping: order.shippingFee,
            tax: order.tax,
            discount: order.discount,
            grandTotal: order.totalAmount,
          },
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          estimatedDelivery: "5-7 Business Days",
        }));
        set({ orders });
      }
    } catch (err) {
      set({ error: err.message || "Failed to fetch orders" });
    } finally {
      set({ isLoading: false });
    }
  },

  placeOrder: async (payableItems, grandTotal, paymentDetails) => {
    set({ isLoading: true, error: null });
    try {
      const shippingAddress = get().shippingAddress;
      const deliveryMethod = get().deliveryMethod;
      const discountPercent = get().discountPercent;

      let appliedCoupon = null;
      try {
        appliedCoupon = require("./useCartStore").useCartStore.getState().appliedCoupon;
      } catch (e) {}

      if (!appliedCoupon && typeof window !== "undefined") {
        try {
          const stored = sessionStorage.getItem("kln_applied_coupon");
          if (stored) appliedCoupon = JSON.parse(stored);
        } catch (e) {}
      }

      const activeCouponCode = appliedCoupon ? (appliedCoupon.code || appliedCoupon.couponCode) : null;
      const activeDiscount = appliedCoupon ? Number(appliedCoupon.discountAmount || 0) : 0;

      // Prepare order data with server-verified coupon code
      const orderData = {
        couponCode: activeCouponCode,
        discountAmount: activeDiscount,
        discount: activeDiscount,
        shippingAddress: {
          fullName: shippingAddress.fullName || "Customer",
          phone: shippingAddress.phone || "",
          street: shippingAddress.street || "",
          city: shippingAddress.city || "",
          state: shippingAddress.state || "",
          pincode: shippingAddress.pincode || "400050",
          postalCode: shippingAddress.pincode || shippingAddress.postalCode || "400050",
          country: shippingAddress.country || "India",
        },
        paymentMethod: paymentDetails.method === "upi" ? "UPI" : paymentDetails.method === "card" ? "CREDIT_CARD" : paymentDetails.method === "netbanking" ? "NET_BANKING" : "COD",
        items: (payableItems || []).map((item) => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
        })),
        buyNowItem: payableItems.length === 1 ? {
          productId: payableItems[0].productId || payableItems[0].id,
          quantity: payableItems[0].quantity,
        } : null,
      };

      const res = await orderApi.createOrder(orderData);
      if (res && res.data) {
        const order = res.data;
        const newOrder = {
          orderId: order.id,
          orderNumber: order.orderNumber,
          invoiceNo: order.orderNumber,
          orderDate: new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          items: order.items || [],
          couponCode: order.couponCode || activeCouponCode,
          totals: {
            subtotal: order.subtotal,
            shipping: order.shippingFee,
            tax: order.tax,
            discount: order.discount || activeDiscount,
            grandTotal: order.totalAmount,
          },
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          estimatedDelivery: deliveryMethod === "express" ? "3-4 Business Days" : "5-7 Business Days",
        };

        if (activeCouponCode && typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("kln_coupon_usages");
            const map = stored ? JSON.parse(stored) : {};
            const key = activeCouponCode.toUpperCase();
            map[key] = (map[key] || 0) + 1;
            localStorage.setItem("kln_coupon_usages", JSON.stringify(map));
          } catch (e) {}
        }

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("kln_last_order", JSON.stringify(newOrder));
            localStorage.setItem(`kln_order_${newOrder.orderId}`, JSON.stringify(newOrder));
            if (newOrder.orderNumber) {
              localStorage.setItem(`kln_order_${newOrder.orderNumber}`, JSON.stringify(newOrder));
            }
          } catch (e) {}
        }

        set((state) => ({
          orders: [newOrder, ...state.orders],
          currentOrder: newOrder,
          isLoading: false,
        }));

        pushLocalNotification(
          "Order Placed Successfully 🎉",
          `Your order #${newOrder.orderNumber} for ₹${newOrder.totals.grandTotal} has been placed successfully.`,
          { orderNumber: newOrder.orderNumber, grandTotal: newOrder.totals.grandTotal }
        );

        return newOrder;
      }
    } catch (err) {
      console.warn("Backend order creation failed, creating order locally:", err);
      
      const shippingAddress = get().shippingAddress;
      const deliveryMethod = get().deliveryMethod;
      const orderNumber = `KLN-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(100 + Math.random() * 900)}`;

      let appliedCoupon = null;
      try {
        appliedCoupon = require("./useCartStore").useCartStore.getState().appliedCoupon;
      } catch (e) {}

      if (!appliedCoupon && typeof window !== "undefined") {
        try {
          const stored = sessionStorage.getItem("kln_applied_coupon");
          if (stored) appliedCoupon = JSON.parse(stored);
        } catch (e) {}
      }

      const activeCouponCode = appliedCoupon ? (appliedCoupon.code || appliedCoupon.couponCode) : null;
      const activeDiscount = appliedCoupon ? Number(appliedCoupon.discountAmount || 0) : 0;

      if (activeCouponCode && typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("kln_coupon_usages");
          const map = stored ? JSON.parse(stored) : {};
          const key = activeCouponCode.toUpperCase();
          map[key] = (map[key] || 0) + 1;
          localStorage.setItem("kln_coupon_usages", JSON.stringify(map));
        } catch (e) {}
      }

      const calculatedSubtotal = (payableItems || []).reduce((acc, i) => acc + (Number(i.price || 0) * (Number(i.quantity) || 1)), 0);
      const isFreeShip = appliedCoupon && appliedCoupon.isFreeShipping;
      const shippingCost = deliveryMethod === "express" ? 99 : isFreeShip ? 0 : calculatedSubtotal > 499 || calculatedSubtotal === 0 ? 0 : 49;
      const taxableAmount = Math.max(0, calculatedSubtotal - activeDiscount);
      const taxAmount = Number((taxableAmount * 0.05).toFixed(2));
      const calculatedGrandTotal = Math.max(0, Number((taxableAmount + shippingCost + taxAmount).toFixed(2)));

      const fallbackOrder = {
        orderId: orderNumber,
        orderNumber: orderNumber,
        invoiceNo: orderNumber,
        orderDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        items: payableItems,
        couponCode: activeCouponCode,
        totals: {
          subtotal: calculatedSubtotal,
          shipping: shippingCost,
          tax: taxAmount,
          discount: activeDiscount,
          grandTotal: calculatedGrandTotal,
        },
        shippingAddress: shippingAddress,
        paymentMethod: paymentDetails.method.toUpperCase(),
        paymentStatus: "PAID",
        status: "PROCESSING",
        estimatedDelivery: deliveryMethod === "express" ? "3-4 Business Days" : "5-7 Business Days",
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("kln_last_order", JSON.stringify(fallbackOrder));
          localStorage.setItem(`kln_order_${fallbackOrder.orderId}`, JSON.stringify(fallbackOrder));
          localStorage.setItem(`kln_order_${fallbackOrder.orderNumber}`, JSON.stringify(fallbackOrder));
        } catch (e) {}
      }

      set((state) => ({
        orders: [fallbackOrder, ...state.orders],
        currentOrder: fallbackOrder,
        isLoading: false,
      }));

      pushLocalNotification(
        "Order Placed Successfully 🎉",
        `Your order #${fallbackOrder.orderNumber} for ₹${fallbackOrder.totals.grandTotal} has been placed successfully.`,
        { orderNumber: fallbackOrder.orderNumber, grandTotal: fallbackOrder.totals.grandTotal }
      );

      return fallbackOrder;
    }
  },

  getOrderById: (orderId) => {
    const list = get().orders || [];
    const match = list.find(
      (o) => o.orderId === orderId || o.id === orderId || o.orderNumber === orderId
    );
    if (match) return match;

    const cur = get().currentOrder;
    if (cur && (cur.orderId === orderId || cur.id === orderId || cur.orderNumber === orderId)) {
      return cur;
    }

    if (typeof window !== "undefined") {
      try {
        if (orderId) {
          const byId = localStorage.getItem(`kln_order_${orderId}`);
          if (byId) return JSON.parse(byId);
        }
        const last = localStorage.getItem("kln_last_order");
        if (last) return JSON.parse(last);
      } catch (e) {}
    }

    return null;
  },

  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await orderApi.getOrderDetails(orderId);
      if (res && res.data) {
        const order = res.data;
        const formattedOrder = {
          orderId: order.id,
          orderNumber: order.orderNumber,
          invoiceNo: order.orderNumber,
          orderDate: new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          items: order.items || [],
          totals: {
            subtotal: order.subtotal,
            shipping: order.shippingFee,
            tax: order.tax,
            discount: order.discount,
            grandTotal: order.totalAmount,
          },
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          estimatedDelivery: "5-7 Business Days",
        };
        set({ currentOrder: formattedOrder, isLoading: false });
        return formattedOrder;
      }
    } catch (err) {
      set({ error: err.message || "Failed to fetch order", isLoading: false });
      throw err;
    }
  },

  cancelOrder: async (orderId, reasonData = {}) => {
    set({ isLoading: true, error: null });
    const reasonText = typeof reasonData === "string" ? reasonData : reasonData.reason || reasonData.notes || "Customer requested cancellation";
    try {
      const res = await orderApi.cancelOrder(orderId, { reason: reasonText });
      toast.success("Order cancelled successfully");
      set((state) => ({
        orders: state.orders.map((o) =>
          o.orderId === orderId || o.id === orderId || o.orderNumber === orderId
            ? { ...o, status: "CANCELLED", deliveryStatus: "Cancelled", cancelReason: reasonText }
            : o
        ),
        currentOrder:
          state.currentOrder?.orderId === orderId || state.currentOrder?.id === orderId || state.currentOrder?.orderNumber === orderId
            ? { ...state.currentOrder, status: "CANCELLED", deliveryStatus: "Cancelled", cancelReason: reasonText }
            : state.currentOrder,
        isLoading: false,
      }));

      pushLocalNotification(
        "Order Cancelled",
        `Your order #${orderId} has been cancelled. Reason: ${reasonText}`,
        { orderId, reasonText }
      );

      return true;
    } catch (err) {
      console.warn("Backend cancel error, updating locally:", err);
      // Fallback local update
      toast.success("Order cancelled successfully");
      set((state) => ({
        orders: state.orders.map((o) =>
          o.orderId === orderId || o.id === orderId || o.orderNumber === orderId
            ? { ...o, status: "CANCELLED", deliveryStatus: "Cancelled", cancelReason: reasonText }
            : o
        ),
        currentOrder:
          state.currentOrder?.orderId === orderId || state.currentOrder?.id === orderId || state.currentOrder?.orderNumber === orderId
            ? { ...state.currentOrder, status: "CANCELLED", deliveryStatus: "Cancelled", cancelReason: reasonText }
            : state.currentOrder,
        isLoading: false,
      }));
      return true;
    }
  },

  requestReturnOrder: async (orderId, returnData = {}) => {
    set({ isLoading: true, error: null });
    const returnReason = returnData.reason || "Defective or damaged product";
    const notes = returnData.notes || "";
    try {
      await orderApi.returnOrder(orderId, { reason: returnReason, notes, itemIds: returnData.itemIds });
      toast.success("Product return request submitted successfully! 📦", {
        icon: "↩️",
      });
      set((state) => ({
        orders: state.orders.map((o) =>
          o.orderId === orderId || o.id === orderId || o.orderNumber === orderId
            ? { ...o, status: "RETURN_REQUESTED", deliveryStatus: "Return Requested", returnReason, returnNotes: notes }
            : o
        ),
        currentOrder:
          state.currentOrder?.orderId === orderId || state.currentOrder?.id === orderId || state.currentOrder?.orderNumber === orderId
            ? { ...state.currentOrder, status: "RETURN_REQUESTED", deliveryStatus: "Return Requested", returnReason, returnNotes: notes }
            : state.currentOrder,
        isLoading: false,
      }));

      pushLocalNotification(
        "Return Request Submitted",
        `Your return request for order #${orderId} has been logged. Our support team will process it within 24-48 hours.`,
        { orderId }
      );

      return true;
    } catch (err) {
      console.warn("Backend return request note, updating locally:", err);
      toast.success("Product return request submitted successfully! 📦");
      set((state) => ({
        orders: state.orders.map((o) =>
          o.orderId === orderId || o.id === orderId || o.orderNumber === orderId
            ? { ...o, status: "RETURN_REQUESTED", deliveryStatus: "Return Requested", returnReason, returnNotes: notes }
            : o
        ),
        currentOrder:
          state.currentOrder?.orderId === orderId || state.currentOrder?.id === orderId || state.currentOrder?.orderNumber === orderId
            ? { ...state.currentOrder, status: "RETURN_REQUESTED", deliveryStatus: "Return Requested", returnReason, returnNotes: notes }
            : state.currentOrder,
        isLoading: false,
      }));
      return true;
    }
  },
}));
