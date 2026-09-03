import React from "react";

export default function StatCard({ label, value, icon: Icon, color = "#d4af37" }) {
  return (
    <div className="stat-card">
      <div className="stat-info flex-1">
        <div className="stat-label text-xs uppercase font-semibold text-[#a3b8ad] tracking-wider mb-1">{label}</div>
        <div className="stat-value text-2xl font-extrabold text-[#f5f8f6]">{value}</div>
      </div>
      {Icon && (
        <div className="stat-icon-wrapper p-3 rounded-xl flex items-center justify-center flex-none" style={{ backgroundColor: `${color}20`, color }}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
