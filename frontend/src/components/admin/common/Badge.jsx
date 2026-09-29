import React from "react";

export default function Badge({ type, text }) {
  const normalized = (type || text || "").toString().toLowerCase();

  let styles = "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border ";
  
  if (["pending", "unpaid", "pay on delivery", "on delivery"].some(s => normalized.includes(s))) {
    styles += "bg-amber-100 text-amber-800 border-amber-300";
  } else if (["processing"].includes(normalized)) {
    styles += "bg-blue-100 text-blue-800 border-blue-300";
  } else if (["shipped"].includes(normalized)) {
    styles += "bg-purple-100 text-purple-800 border-purple-300";
  } else if (["delivered", "paid", "active"].some(s => normalized.includes(s))) {
    styles += "bg-emerald-100 text-emerald-800 border-emerald-300";
  } else if (["cancelled", "failed", "refunded", "inactive"].some(s => normalized.includes(s))) {
    styles += "bg-red-100 text-red-800 border-red-300";
  } else if (["instock", "in stock", "true"].includes(normalized)) {
    styles += "bg-emerald-100 text-emerald-800 border-emerald-300";
  } else if (["lowstock", "low stock"].includes(normalized)) {
    styles += "bg-amber-100 text-amber-800 border-amber-300";
  } else if (["outstock", "out of stock", "false"].includes(normalized)) {
    styles += "bg-red-100 text-red-800 border-red-300";
  } else {
    styles += "bg-gray-100 text-gray-700 border-gray-300";
  }

  return <span className={styles}>{text || type}</span>;
}
