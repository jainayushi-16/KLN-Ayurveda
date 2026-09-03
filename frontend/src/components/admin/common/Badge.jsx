import React from "react";

export default function Badge({ type, text }) {
  const normalized = (type || text || "").toString().toLowerCase();

  let styles = "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border ";
  
  if (["pending"].includes(normalized)) {
    styles += "bg-amber-500/20 text-amber-400 border-amber-500/30";
  } else if (["processing"].includes(normalized)) {
    styles += "bg-blue-500/20 text-blue-400 border-blue-500/30";
  } else if (["shipped"].includes(normalized)) {
    styles += "bg-purple-500/20 text-purple-400 border-purple-500/30";
  } else if (["delivered", "paid", "active"].includes(normalized)) {
    styles += "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  } else if (["cancelled", "failed", "refunded", "inactive"].includes(normalized)) {
    styles += "bg-red-500/20 text-red-400 border-red-500/30";
  } else if (["instock", "in stock", "true"].includes(normalized)) {
    styles += "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  } else if (["lowstock", "low stock"].includes(normalized)) {
    styles += "bg-amber-500/20 text-amber-400 border-amber-500/30";
  } else if (["outstock", "out of stock", "false"].includes(normalized)) {
    styles += "bg-red-500/20 text-red-400 border-red-500/30";
  } else {
    styles += "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }

  return <span className={styles}>{text || type}</span>;
}
