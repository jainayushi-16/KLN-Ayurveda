"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoCursor() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const cursorRef = useRef(null);
  const posRef = useRef({ currentX: -100, currentY: -100, targetX: -100, targetY: -100 });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Hide custom cursor on touch / mobile devices
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      return;
    }

    setIsSupported(true);

    let rafId;

    const onMouseMove = (e) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
      if (posRef.current.currentX === -100) {
        posRef.current.currentX = e.clientX;
        posRef.current.currentY = e.clientY;
      }
    };

    const render = () => {
      const { targetX, targetY } = posRef.current;
      // Smooth linear interpolation (lerp) for 60fps tracking without React re-renders
      posRef.current.currentX += (targetX - posRef.current.currentX) * 0.35;
      posRef.current.currentY += (targetY - posRef.current.currentY) * 0.35;

      if (cursorRef.current) {
        // Offset by 24px (half of 48px size) to keep centered directly on mouse pointer
        cursorRef.current.style.transform = `translate3d(${posRef.current.currentX - 24}px, ${posRef.current.currentY - 24}px, 0)`;
      }

      // Chroma key processing: draw video to 48x48 canvas and key out dark/black background
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, 48, 48);
          const imgData = ctx.getImageData(0, 0, 48, 48);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // If pixel is dark background (black box), turn alpha to 0 (100% transparent)
            if (r < 32 && g < 32 && b < 32) {
              data[i + 3] = 0;
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isSupported) return null;

  return (
    <>
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          *, body, a, button, input, select, textarea, [role="button"], .cursor-pointer {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Hidden Video Source for Frame Extraction */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={{
          display: "none",
          position: "fixed",
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <source src="/cursor.webm" type="video/webm" />
        <source src="/cursor.mp4" type="video/mp4" />
      </video>

      {/* Fixed 60FPS Centered Canvas Cursor */}
      <div
        ref={cursorRef}
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
          background: "transparent",
        }}
      >
        <canvas
          ref={canvasRef}
          width={48}
          height={48}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            pointerEvents: "none",
            background: "transparent",
          }}
        />
      </div>
    </>
  );
}
