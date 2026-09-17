"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoCursor() {
  const followerRef = useRef(null);
  const videoRef = useRef(null);
  const posRef = useRef({ currentX: -100, currentY: -100, targetX: -100, targetY: -100 });
  const [isSupported, setIsSupported] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only disable cursor on mobile-only devices without a fine mouse/trackpad pointer
    const isPureTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches &&
      !window.matchMedia("(pointer: fine)").matches;

    if (isPureTouchDevice) {
      return;
    }

    setIsSupported(true);

    let rafId;

    const onMouseMove = (e) => {
      posRef.current.targetX = e.clientX + 10;
      posRef.current.targetY = e.clientY + 10;
      if (posRef.current.currentX === -100) {
        posRef.current.currentX = e.clientX + 10;
        posRef.current.currentY = e.clientY + 10;
      }
      setIsVisible(true);
    };

    const render = () => {
      const { targetX, targetY } = posRef.current;
      posRef.current.currentX += (targetX - posRef.current.currentX) * 0.22;
      posRef.current.currentY += (targetY - posRef.current.currentY) * 0.22;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${posRef.current.currentX}px, ${posRef.current.currentY}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(render);

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isSupported) return null;

  return (
    <div
      ref={followerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 999999,
        willChange: "transform",
        overflow: "hidden",
        mixBlendMode: "screen",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        src="/cur.mp4"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
          pointerEvents: "none",
          background: "transparent",
        }}
      />
    </div>
  );
}
