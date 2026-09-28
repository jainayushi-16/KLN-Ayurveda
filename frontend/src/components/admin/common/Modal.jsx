"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = "600px" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
      style={{ margin: 0, top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="w-full bg-[#FFFFFF] border border-[#2F5D34]/20 rounded-2xl p-5 sm:p-6 shadow-2xl text-[#1B351E] flex flex-col max-h-[85vh] my-auto overflow-y-auto relative"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#2F5D34]/15 flex-none sticky top-0 bg-white z-10">
          <h3 className="text-lg sm:text-xl font-bold text-[#2F5D34]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E7F0E4] text-gray-500 hover:text-[#2F5D34] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">{children}</div>
        {footer && <div className="pt-4 mt-4 border-t border-[#2F5D34]/15 flex justify-end gap-2 flex-none">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
