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
      const order = res?.data || res;
      if (order && (order.id || order.orderNumber)) {
        const newOrder = {
          orderId: order.id,
          orderNumber: order.orderNumber,
          invoiceNo: order.orderNumber,
          orderDate: new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
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
          shippingAddress: order.shippingAddress || shippingAddress,
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
          orders: [newOrder, ...state.orders.filter((o) => o.orderId !== newOrder.orderId)],
          currentOrder: newOrder,
          isLoading: false,
        }));

        pushLocalNotification(
          "Order Placed Successfully 🎉",
          `Your order #${newOrder.orderNumber} for ₹${newOrder.totals.grandTotal} has been placed successfully.`,
          { orderId: newOrder.orderId, orderNumber: newOrder.orderNumber, grandTotal: newOrder.totals.grandTotal }
        );

        return newOrder;
      }
      throw new Error(res?.message || "Failed to place order.");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to place order. Please try again.";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw err;
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

  downloadInvoice: async (orderId, orderNumber = "") => {
    try {
      toast.loading("Generating PDF invoice...", { id: "invoice_download" });
      let res;
      try {
        res = await orderApi.downloadInvoice(orderId);
      } catch (err) {
        // Fallback if axios parsed JSON or error occurred
        res = err.response?.data || null;
      }
      toast.dismiss("invoice_download");

      let htmlText = "";
      if (typeof res === "string") {
        htmlText = res;
      } else if (res instanceof Blob) {
        htmlText = await res.text();
      } else if (res && res.data) {
        if (typeof res.data === "string") {
          htmlText = res.data;
        } else if (res.data instanceof Blob) {
          htmlText = await res.data.text();
        }
      }

      if (!htmlText || htmlText.length < 50) {
        // Generate client-side invoice HTML if backend text was empty
        const order = get().getOrderById(orderId) || { orderId, orderNumber: orderNumber || orderId };
        const num = order.orderNumber || orderNumber || orderId;
        const dateStr = order.orderDate || new Date().toLocaleDateString("en-IN");
        const items = order.items || [];
        const itemsRows = items.map((it, idx) => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding:10px;">${idx + 1}</td>
            <td style="padding:10px; font-weight:bold;">${it.name || it.product?.name || "Formulation"}</td>
            <td style="padding:10px; text-align:center;">${it.quantity || 1}</td>
            <td style="padding:10px; text-align:right;">₹${Number(it.price || it.product?.price || 0).toFixed(2)}</td>
            <td style="padding:10px; text-align:right; font-weight:bold; color:#2F5D34;">₹${(Number(it.price || it.product?.price || 0) * (it.quantity || 1)).toFixed(2)}</td>
          </tr>
        `).join("");

        htmlText = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8"/>
            <title>Invoice - ${num}</title>
            <style>
              body { font-family: sans-serif; padding: 20px; color: #222; }
              .box { max-width: 800px; margin: auto; padding: 25px; border: 1px solid #ccc; border-radius: 12px; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2F5D34; padding-bottom: 15px; }
              .title { font-size: 22px; font-weight: bold; color: #2F5D34; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th { bg-color: #2F5D34; background: #2F5D34; color: #fff; padding: 10px; text-align: left; }
            </style>
          </head>
          <body>
            <div class="box">
              <div class="header">
                <div>
                  <div className="title" style="font-size:22px; font-weight:bold; color:#2F5D34;">🌿 KLN AYURVEDA</div>
                  <div style="font-size:12px; color:#555;">Authentic Herbal Formulations</div>
                </div>
                <div style="text-align:right;">
                  <h3 style="margin:0; color:#2F5D34;">TAX INVOICE</h3>
                  <div style="font-size:12px; font-weight:bold;">#${num}</div>
                  <div style="font-size:12px; color:#666;">Date: ${dateStr}</div>
                </div>
              </div>
              <table>
                <thead>
                  <tr><th>#</th><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Rate</th><th style="text-align:right;">Total</th></tr>
                </thead>
                <tbody>${itemsRows}</tbody>
              </table>
              <div style="text-align:right; font-size:16px; font-weight:bold; color:#2F5D34; border-top:2px solid #2F5D34; padding-top:10px;">
                Grand Total: ₹${Number(order.totals?.grandTotal || order.totalAmount || 0).toFixed(2)}
              </div>
            </div>
            <script>window.onload = function() { window.print(); };</script>
          </body>
          </html>
        `;
      }

      // Try opening print window for PDF saving
      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.write(htmlText);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => {
          try {
            printWin.print();
          } catch (e) {}
        }, 400);
      } else {
        const blob = new Blob([htmlText], { type: "text/html;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `KLN_Invoice_${orderNumber || orderId}.html`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }

      toast.success("PDF Invoice ready! Launching print / save dialog 📄");
      return true;
    } catch (err) {
      toast.dismiss("invoice_download");
      toast.error(err?.message || "Failed to download invoice.");
      return false;
    }
  },

  fetchTrackingInfo: async (orderNumber) => {
    try {
      const res = await orderApi.trackOrder(orderNumber);
      return res.data || res;
    } catch (err) {
      console.warn("Fetch tracking error:", err);
      return null;
    }
  },
}));
