"use client";

import { useEffect, useRef, useState } from "react";
import axiosClient from "@/services/axiosClient";
import {
  isBrowserNotificationSupported,
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  notifyOrderToBrowser,
} from "@/utils/browserNotification";
import toast from "react-hot-toast";
import Link from "next/link";
import { Bell, ShoppingBag, ExternalLink } from "lucide-react";

export default function AdminOrderNotificationListener() {
  const [permission, setPermission] = useState("default");
  const lastKnownOrderIdRef = useRef(null);
  const isFirstRunRef = useRef(true);

  useEffect(() => {
    setPermission(getBrowserNotificationPermission());

    const handlePermChange = (e) => {
      setPermission(e.detail || getBrowserNotificationPermission());
    };
    window.addEventListener("kln_notification_permission_changed", handlePermChange);
    return () => {
      window.removeEventListener("kln_notification_permission_changed", handlePermChange);
    };
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    // Check for latest orders every 15 seconds
    const checkNewOrders = async () => {
      try {
        const res = await axiosClient.get("/admin/orders?page=1&limit=5");
        if (!isSubscribed) return;

        const orders = res?.data || res?.orders || [];
        if (!Array.isArray(orders) || orders.length === 0) return;

        const latestOrder = orders[0];
        const latestId = latestOrder.id || latestOrder.orderId || latestOrder.orderNumber;

        // On first run, save current latest ID to avoid alerting on existing past orders
        if (isFirstRunRef.current) {
          isFirstRunRef.current = false;
          lastKnownOrderIdRef.current = latestId;
          try {
            if (typeof window !== "undefined") {
              const saved = localStorage.getItem("kln_admin_last_order_id");
              if (!saved) {
                localStorage.setItem("kln_admin_last_order_id", latestId);
              } else {
                lastKnownOrderIdRef.current = saved;
              }
            }
          } catch (e) {}
          return;
        }

        // If a new order has arrived since last check
        if (latestId && lastKnownOrderIdRef.current && latestId !== lastKnownOrderIdRef.current) {
          lastKnownOrderIdRef.current = latestId;
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem("kln_admin_last_order_id", latestId);
            }
          } catch (e) {}

          // 1. Send native browser notification & chime
          notifyOrderToBrowser(latestOrder, { isAdmin: true });

          // 2. Show rich interactive toast in admin panel
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-[#1b351e] border-2 border-[#c9a66b] text-white shadow-2xl rounded-2xl pointer-events-auto flex p-4 ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="p-2.5 rounded-xl bg-[#c9a66b] text-[#1b351e]">
                        <ShoppingBag className="h-5 w-5 animate-bounce" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-xs font-black uppercase tracking-wider text-[#c9a66b]">
                        New Store Order Received!
                      </p>
                      <p className="mt-1 text-sm font-bold text-white">
                        Order #{latestOrder.orderNumber || latestOrder.id}
                      </p>
                      <p className="text-xs text-emerald-100 font-paragraph">
                        Amount: ₹{Number(latestOrder.totalAmount || 0).toLocaleString("en-IN")} • Status: {latestOrder.status || "PENDING"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-white/20 pl-3 ml-3 items-center">
                  <Link
                    href="/admin/orders"
                    onClick={() => toast.dismiss(t.id)}
                    className="px-3 py-2 rounded-xl bg-[#c9a66b] text-[#1b351e] text-xs font-black uppercase tracking-wider hover:bg-[#b89355] transition-all flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            ),
            { duration: 8000 }
          );
        }
      } catch (err) {
        // Silent error in background polling
      }
    };

    checkNewOrders();
    const timer = setInterval(checkNewOrders, 15000);

    return () => {
      isSubscribed = false;
      clearInterval(timer);
    };
  }, []);

  return null;
}
