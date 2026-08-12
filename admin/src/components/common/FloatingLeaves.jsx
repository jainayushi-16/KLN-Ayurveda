"use client";

import React from "react";
import Image from "next/image";

export default function FloatingLeaves() {
  const leaves = [
    // Floating & Bouncing Leaves (Left Column)
    { src: "/images/leaf.svg", size: 100, top: "5%", left: "2%", animation: "floatBounce 6s ease-in-out infinite", delay: "0s", opacity: 0.35 },
    { src: "/images/flower.svg", size: 110, top: "35%", left: "4%", animation: "floatBounce 8s ease-in-out infinite reverse", delay: "1s", opacity: 0.38 },
    { src: "/images/branch.svg", size: 130, top: "65%", left: "3%", animation: "floatBounce 9s ease-in-out infinite", delay: "2s", opacity: 0.32 },
    { src: "/images/leaf-2.svg", size: 80, top: "88%", left: "6%", animation: "floatBounce 7s ease-in-out infinite reverse", delay: "0.5s", opacity: 0.36 },

    // Floating & Bouncing Leaves (Right Column)
    { src: "/images/leaf-2.svg", size: 90, top: "8%", right: "3%", animation: "floatBounce 7.5s ease-in-out infinite reverse", delay: "0.8s", opacity: 0.36 },
    { src: "/images/branch.svg", size: 125, top: "38%", right: "4%", animation: "floatBounce 9.5s ease-in-out infinite", delay: "1.8s", opacity: 0.30 },
    { src: "/images/flower.svg", size: 115, top: "68%", right: "3%", animation: "floatBounce 8.5s ease-in-out infinite reverse", delay: "2.5s", opacity: 0.38 },
    { src: "/images/leaf.svg", size: 85, top: "90%", right: "5%", animation: "floatBounce 6.5s ease-in-out infinite", delay: "1.2s", opacity: 0.34 },

    // Dropping & Falling Leaves Across Screen Columns
    { src: "/images/leaf.svg", size: 65, left: "18%", animation: "leafFall 12s linear infinite", delay: "0s", opacity: 0.32 },
    { src: "/images/flower.svg", size: 80, left: "32%", animation: "leafFall 15s linear infinite", delay: "3s", opacity: 0.35 },
    { src: "/images/leaf-2.svg", size: 70, left: "48%", animation: "leafFall 13s linear infinite", delay: "1.5s", opacity: 0.30 },
    { src: "/images/leaf.svg", size: 85, left: "64%", animation: "leafFall 17s linear infinite", delay: "5s", opacity: 0.34 },
    { src: "/images/flower.svg", size: 75, left: "78%", animation: "leafFall 14s linear infinite", delay: "2.2s", opacity: 0.36 },
    { src: "/images/leaf-2.svg", size: 60, left: "92%", animation: "leafFall 16s linear infinite", delay: "4.2s", opacity: 0.32 },
  ];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        overflow: "hidden",
      }}
    >
      {leaves.map((leaf, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            top: leaf.top || "-12%",
            left: leaf.left,
            right: leaf.right,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            opacity: leaf.opacity,
            animation: leaf.animation,
            animationDelay: leaf.delay,
            pointerEvents: "none",
            userSelect: "none",
            filter: "drop-shadow(0 6px 14px rgba(47, 93, 52, 0.2))",
          }}
        >
          <Image
            src={leaf.src}
            alt=""
            width={leaf.size}
            height={leaf.size}
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>
      ))}
    </div>
  );
}
