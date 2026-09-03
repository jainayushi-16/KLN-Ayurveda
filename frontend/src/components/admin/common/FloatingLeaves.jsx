"use client";

import React from "react";
import Image from "next/image";

export default function FloatingLeaves() {
  const leaves = [
    // Floating & Bouncing Leaves (Left Side)
    { src: "/images/leaf.svg", size: 90, top: "6%", left: "2%", animation: "floatBounce 7s ease-in-out infinite", delay: "0s", opacity: 0.4 },
    { src: "/images/flower.svg", size: 100, top: "36%", left: "3%", animation: "floatBounce 9s ease-in-out infinite reverse", delay: "1s", opacity: 0.45 },
    { src: "/images/branch.svg", size: 115, top: "66%", left: "2%", animation: "floatBounce 10s ease-in-out infinite", delay: "2s", opacity: 0.38 },
    { src: "/images/leaf-2.svg", size: 75, top: "88%", left: "5%", animation: "floatBounce 8s ease-in-out infinite reverse", delay: "0.5s", opacity: 0.4 },

    // Floating & Bouncing Leaves (Right Side)
    { src: "/images/leaf-2.svg", size: 85, top: "8%", right: "2%", animation: "floatBounce 8s ease-in-out infinite reverse", delay: "0.8s", opacity: 0.4 },
    { src: "/images/branch.svg", size: 110, top: "38%", right: "3%", animation: "floatBounce 10s ease-in-out infinite", delay: "1.8s", opacity: 0.35 },
    { src: "/images/flower.svg", size: 105, top: "68%", right: "2%", animation: "floatBounce 9s ease-in-out infinite reverse", delay: "2.5s", opacity: 0.42 },
    { src: "/images/leaf.svg", size: 80, top: "90%", right: "4%", animation: "floatBounce 7s ease-in-out infinite", delay: "1.2s", opacity: 0.38 },

    // Falling Leaves across background
    { src: "/images/leaf.svg", size: 60, left: "20%", animation: "leafFall 14s linear infinite", delay: "0s", opacity: 0.35 },
    { src: "/images/flower.svg", size: 75, left: "35%", animation: "leafFall 18s linear infinite", delay: "3s", opacity: 0.4 },
    { src: "/images/leaf-2.svg", size: 65, left: "50%", animation: "leafFall 15s linear infinite", delay: "1.5s", opacity: 0.35 },
    { src: "/images/leaf.svg", size: 75, left: "68%", animation: "leafFall 19s linear infinite", delay: "5s", opacity: 0.38 },
    { src: "/images/flower.svg", size: 70, left: "82%", animation: "leafFall 16s linear infinite", delay: "2.2s", opacity: 0.4 },
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
            filter: "drop-shadow(0 6px 14px rgba(47, 93, 52, 0.15))",
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
