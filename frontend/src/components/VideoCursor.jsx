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
      posRef.current.targetX = e.clientX + 12;
      posRef.current.targetY = e.clientY + 12;
      if (posRef.current.currentX === -100) {
        posRef.current.currentX = e.clientX + 12;
        posRef.current.currentY = e.clientY + 12;
      }
      setIsVisible(true);

      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
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

      // Process video frame: key out dark background pixels, make colorful pixels 100% SOLID & RICH
      const video = videoRef.current;
      if (ctx && canvas && video) {
        if (video.paused || video.ended) {
          video.play().catch(() => {});
        }

        if (video.readyState >= 1) {
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

              if (maxVal < 25) {
                // Key out black/dark background completely (no background box or ring)
                data[i + 3] = 0;
              } else {
                // Keep video content 100% SOLID and fully OPAQUE (Alpha = 255)
                data[i + 3] = 255;
                // Boost color vibrancy so graphics look rich & solid on any page background
                data[i] = Math.min(255, Math.round(r * 1.35));
                data[i + 1] = Math.min(255, Math.round(g * 1.35));
                data[i + 2] = Math.min(255, Math.round(b * 1.35));
              }
            }
            ctx.putImageData(frame, 0, 0);
          } catch (e) {
            // Fallback
          }
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
        transition: "opacity 0.25s ease-out",
      }}
    >
      {/* Video kept in DOM with non-zero dimensions so browser continuously decodes frames */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        src="/cur.mp4"
        onCanPlay={() => {
          if (videoRef.current) videoRef.current.play().catch(() => {});
        }}
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          opacity: 0.01,
          pointerEvents: "none",
          zIndex: -1,
        }}
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
