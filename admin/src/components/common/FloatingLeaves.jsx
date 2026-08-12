"use client";

import React from "react";
import Image from "next/image";

export default function FloatingLeaves() {
  const leaves = [
    { src: "/images/leaf.svg", size: 90, top: "8%", left: "5%", animation: "floatBounce 7s ease-in-out infinite", delay: "0s", opacity: 0.22 },
    { src: "/images/leaf-2.svg", size: 70, top: "25%", right: "6%", animation: "floatBounce 9s ease-in-out infinite reverse", delay: "1s", opacity: 0.25 },
    { src: "/images/flower.svg", size: 100, top: "50%", left: "3%", animation: "floatBounce 8s ease-in-out infinite", delay: "2s", opacity: 0.20 },
    { src: "/images/branch.svg", size: 120, top: "70%", right: "4%", animation: "floatBounce 10s ease-in-out infinite", delay: "0.5s", opacity: 0.18 },
    { src: "/images/leaf.svg", size: 65, top: "85%", left: "12%", animation: "floatBounce 6s ease-in-out infinite reverse", delay: "1.5s", opacity: 0.22 },
    // Dropping & Falling Leaves
    { src: "/images/leaf-2.svg", size: 55, left: "20%", animation: "leafFall 14s linear infinite", delay: "0s", opacity: 0.20 },
    { src: "/images/leaf.svg", size: 75, left: "45%", animation: "leafFall 18s linear infinite", delay: "4s", opacity: 0.22 },
    { src: "/images/flower.svg", size: 85, left: "70%", animation: "leafFall 16s linear infinite", delay: "2s", opacity: 0.18 },
    { src: "/images/leaf-2.svg", size: 60, left: "85%", animation: "leafFall 20s linear infinite", delay: "6s", opacity: 0.24 },
  ];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {leaves.map((leaf, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            top: leaf.top || "-10%",
            left: leaf.left,
            right: leaf.right,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            opacity: leaf.opacity,
            animation: leaf.animation,
            animationDelay: leaf.delay,
            pointerEvents: "none",
            userSelect: "none",
            filter: "drop-shadow(0 8px 16px rgba(47, 93, 52, 0.15))",
          }}
        >
          <Image
            src={leaf.src}
            alt=""
            width={leaf.size}
            height={leaf.size}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  );
}
