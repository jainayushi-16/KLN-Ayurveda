"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoCursor() {
  const followerRef = useRef(null);
  const canvasRef = useRef(null);
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

    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d", { willReadFrequently: true }) : null;

    const render = () => {
      const { targetX, targetY } = posRef.current;
      posRef.current.currentX += (targetX - posRef.current.currentX) * 0.22;
      posRef.current.currentY += (targetY - posRef.current.currentY) * 0.22;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${posRef.current.currentX}px, ${posRef.current.currentY}px, 0)`;
      }

      // Draw video to canvas and key out dark/black pixels
      const video = videoRef.current;
      if (ctx && video && video.readyState >= 2 && !video.paused && !video.ended) {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(video, 0, 0, width, height);

        try {
          const frame = ctx.getImageData(0, 0, width, height);
          const data = frame.data;
          const len = data.length;

          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const maxVal = Math.max(r, g, b);

            if (maxVal < 28) {
              data[i + 3] = 0; // Make pure black background transparent
            } else if (maxVal < 45) {
              // Smooth edge feathering
              data[i + 3] = Math.round(((maxVal - 28) / 17) * 255);
            }
          }
          ctx.putImageData(frame, 0, 0);
        } catch (e) {
          // Fallback if canvas read fails
        }
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
        width: "68px",
        height: "68px",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 999999,
        willChange: "transform",
        overflow: "hidden",
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
        width={136}
        height={136}
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
