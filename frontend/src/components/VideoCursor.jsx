"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoCursor() {
  const followerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const posRef = useRef({ currentX: -100, currentY: -100, targetX: -100, targetY: -100 });
  const [isSupported, setIsSupported] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only disable cursor on mobile-only devices without a mouse/trackpad pointer
    const isPureTouchDevice =
      window.matchMedia("(pointer: coarse)").matches &&
      !window.matchMedia("(pointer: fine)").matches;

    if (isPureTouchDevice) {
      return;
    }

    setIsSupported(true);

    let rafId;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d", { willReadFrequently: true }) : null;

    const onMouseMove = (e) => {
      posRef.current.targetX = e.clientX + 12;
      posRef.current.targetY = e.clientY + 12;
      if (posRef.current.currentX === -100) {
        posRef.current.currentX = e.clientX + 12;
        posRef.current.currentY = e.clientY + 12;
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

      // Draw video frame to canvas and remove black background dynamically
      if (video && ctx && video.readyState >= 2 && !video.paused) {
        ctx.drawImage(video, 0, 0, 64, 64);
        const frame = ctx.getImageData(0, 0, 64, 64);
        const d = frame.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const brightness = Math.max(r, g, b);
          d[i + 3] = brightness;
        }
        ctx.putImageData(frame, 0, 0);
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(render);

    if (video) {
      video.play().catch(() => {});
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
        pointerEvents: "none",
        zIndex: 999999,
        willChange: "transform",
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
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        width={64}
        height={64}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
