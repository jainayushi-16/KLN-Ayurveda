/**
 * Browser Web Notification & Audio Chime Utility
 * Powers desktop/browser push notifications for customer & admin order alerts
 */
import toast from "react-hot-toast";

export const isBrowserNotificationSupported = () => {
  return typeof window !== "undefined" && "Notification" in window;
};

export const getBrowserNotificationPermission = () => {
  if (!isBrowserNotificationSupported()) return "unsupported";
  return Notification.permission; // "default" | "granted" | "denied"
};

/**
 * Request notification permission from browser (must be called via user gesture or flow)
 */
export const requestBrowserNotificationPermission = async () => {
  if (!isBrowserNotificationSupported()) {
    toast.error("Browser notifications are not supported in this browser.");
    return "unsupported";
  }

  try {
    const permission = await Notification.requestPermission();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("kln_notification_permission_changed", { detail: permission })
      );
    }

    if (permission === "granted") {
      toast.success("Browser notifications enabled successfully! 🔔", {
        icon: "🔔",
        style: {
          borderRadius: "16px",
          background: "#2F5D34",
          color: "#fff",
        },
      });
      // Send welcoming confirmation notification
      sendBrowserNotification("KLN Ayurveda Notifications Active", {
        body: "You will now receive real-time updates for orders and special offers directly in your browser.",
        tag: "kln-welcome-notification",
      });
    } else if (permission === "denied") {
      toast.error(
        "Notifications blocked. Please enable them in your browser site permissions to receive order alerts."
      );
    }

    return permission;
  } catch (err) {
    console.warn("Failed to request notification permission:", err);
    return Notification.permission;
  }
};

/**
 * Clean, pleasant two-tone audio chime (synthesized via Web Audio API)
 * Requires no external audio files, works instantaneously on any browser
 */
export const playNotificationChime = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Note 1 (D5 = 587.33Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Note 2 (A5 = 880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  } catch (e) {
    // Audio context may be restricted before user interaction
  }
};

/**
 * Dispatch native browser notification and play chime
 */
export const sendBrowserNotification = (title, options = {}) => {
  if (typeof window === "undefined") return null;

  const {
    body = "",
    icon = "/images/kln-logo.jpg",
    badge = "/images/kln-logo.jpg",
    url = null,
    tag = `kln-notif-${Date.now()}`,
    silent = false,
  } = options;

  // 1. Play auditory chime
  if (!silent) {
    playNotificationChime();
  }

  // 2. If browser Notification API is granted, trigger OS desktop notification
  if (isBrowserNotificationSupported() && Notification.permission === "granted") {
    try {
      const notif = new Notification(title, {
        body,
        icon,
        badge,
        tag,
        renotify: true,
      });

      notif.onclick = (e) => {
        e.preventDefault();
        try {
          window.focus();
        } catch (_) {}
        if (url) {
          window.location.href = url;
        }
        notif.close();
      };

      return notif;
    } catch (e) {
      console.warn("Failed to construct Notification object:", e);
    }
  }

  return null;
};

/**
 * Helper to dispatch customer or admin order notifications
 */
export const notifyOrderToBrowser = (orderData, { isAdmin = false } = {}) => {
  if (!orderData) return;

  const orderNumber = orderData.orderNumber || orderData.orderId || orderData.id || "Store Order";
  const amount =
    orderData.totals?.grandTotal ??
    orderData.totalAmount ??
    orderData.grandTotal ??
    orderData.subtotal ??
    "";
  const formattedAmount = amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "";

  if (isAdmin) {
    const title = `🛍️ New Order Received: #${orderNumber}`;
    const body = `Customer placed an order${formattedAmount ? ` of ${formattedAmount}` : ""}. Click to view in Admin Portal.`;
    return sendBrowserNotification(title, {
      body,
      tag: `admin-order-${orderNumber}`,
      url: "/admin/orders",
    });
  }

  const title = `Order Placed Successfully! 🎉`;
  const body = `Your order #${orderNumber}${formattedAmount ? ` for ${formattedAmount}` : ""} is confirmed. Thank you for choosing KLN Ayurveda!`;
  const orderId = orderData.orderId || orderData.id || orderNumber;

  return sendBrowserNotification(title, {
    body,
    tag: `customer-order-${orderNumber}`,
    url: `/order-success?orderId=${orderId}`,
  });
};
