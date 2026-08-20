export const pushLocalNotification = (title, message, metadata = {}) => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("kln_local_notifications");
    const list = saved ? JSON.parse(saved) : [];
    const newNotif = {
      id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      message,
      metadata,
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    const updated = [newNotif, ...list].slice(0, 50);
    localStorage.setItem("kln_local_notifications", JSON.stringify(updated));

    // Dispatch custom browser event for instant UI update
    window.dispatchEvent(new CustomEvent("kln_notification_created", { detail: newNotif }));
    return newNotif;
  } catch (e) {
    console.error("Failed to push local notification:", e);
    return null;
  }
};

export const getLocalNotifications = () => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("kln_local_notifications");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const markLocalNotificationAsRead = (id) => {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem("kln_local_notifications");
    if (!saved) return;
    const list = JSON.parse(saved);
    const updated = list.map((n) =>
      n.id === id ? { ...n, readAt: new Date().toISOString() } : n
    );
    localStorage.setItem("kln_local_notifications", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("kln_notification_updated"));
  } catch (e) {}
};

export const markAllLocalNotificationsAsRead = () => {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem("kln_local_notifications");
    if (!saved) return;
    const list = JSON.parse(saved);
    const updated = list.map((n) => ({ ...n, readAt: new Date().toISOString() }));
    localStorage.setItem("kln_local_notifications", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("kln_notification_updated"));
  } catch (e) {}
};
