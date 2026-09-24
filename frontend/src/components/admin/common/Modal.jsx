"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = "600px" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div
        className="w-full bg-[#FFFFFF] border border-[#2F5D34]/20 rounded-2xl p-6 shadow-2xl text-[#1B351E] flex flex-col max-h-[90vh] overflow-y-auto"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2F5D34]/15">
          <h3 className="text-xl font-bold text-[#2F5D34]">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#E7F0E4] text-gray-500 hover:text-[#2F5D34] transition-all cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1">{children}</div>
        {footer && <div className="pt-4 mt-4 border-t border-[#2F5D34]/15 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
