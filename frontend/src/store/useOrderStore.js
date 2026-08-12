import { create } from "zustand";
import { orderApi } from "@/services/order.api";
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

  applyCoupon: (code) => {
    if (code.toUpperCase() === "AYURVEDA10") {
      set({ couponCode: "AYURVEDA10", discountPercent: 0.1 });
      return { success: true, message: "Coupon AYURVEDA10 applied (10% OFF)" };
    }
    return { success: false, message: "Invalid promo code. Try AYURVEDA10" };
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

      // Prepare order data
      const orderData = {
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          country: shippingAddress.country || "India",
        },
        paymentMethod: paymentDetails.method === "upi" ? "UPI" : paymentDetails.method === "card" ? "CREDIT_CARD" : paymentDetails.method === "netbanking" ? "NET_BANKING" : "COD",
        buyNowItem: payableItems.length === 1 ? {
          productId: payableItems[0].productId,
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
          estimatedDelivery: deliveryMethod === "express" ? "3-4 Business Days" : "5-7 Business Days",
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          currentOrder: newOrder,
          isLoading: false,
        }));

        return newOrder;
      }
    } catch (err) {
      set({ error: err.message || "Failed to place order", isLoading: false });
      toast.error("Failed to place order. Please try again.");
      throw err;
    }
  },

  getOrderById: (orderId) => {
    return get().orders.find((o) => o.orderId === orderId) || get().currentOrder;
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
}));
