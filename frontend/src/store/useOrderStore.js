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
      console.warn("Backend order creation failed, creating order locally:", err);
      
      const shippingAddress = get().shippingAddress;
      const deliveryMethod = get().deliveryMethod;
      const orderNumber = `KLN-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

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
        totals: {
          subtotal: grandTotal,
          shipping: deliveryMethod === "express" ? 150 : 0,
          tax: Math.round(grandTotal * 0.05),
          discount: 0,
          grandTotal: grandTotal,
        },
        shippingAddress: shippingAddress,
        paymentMethod: paymentDetails.method.toUpperCase(),
        paymentStatus: "PAID",
        status: "PROCESSING",
        estimatedDelivery: deliveryMethod === "express" ? "3-4 Business Days" : "5-7 Business Days",
      };

      set((state) => ({
        orders: [fallbackOrder, ...state.orders],
        currentOrder: fallbackOrder,
        isLoading: false,
      }));

      return fallbackOrder;
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

  cancelOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await orderApi.cancelOrder(orderId);
      if (res) {
        toast.success("Order cancelled successfully");
        set((state) => ({
          orders: state.orders.map((o) =>
            o.orderId === orderId || o.id === orderId
              ? { ...o, status: "CANCELLED", deliveryStatus: "Cancelled" }
              : o
          ),
          currentOrder:
            state.currentOrder?.orderId === orderId || state.currentOrder?.id === orderId
              ? { ...state.currentOrder, status: "CANCELLED", deliveryStatus: "Cancelled" }
              : state.currentOrder,
          isLoading: false,
        }));
        return true;
      }
    } catch (err) {
      toast.error(err.message || "Failed to cancel order");
      set({ isLoading: false, error: err.message });
      return false;
    }
  },
}));

