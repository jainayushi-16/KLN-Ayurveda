"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoCursor() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const followerRef = useRef(null);
  const posRef = useRef({ currentX: -100, currentY: -100, targetX: -100, targetY: -100 });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Hide follower on touch / mobile devices
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
      // Offset target by +20px X and +20px Y so it floats smoothly beside/behind native cursor
      posRef.current.targetX = e.clientX + 20;
      posRef.current.targetY = e.clientY + 20;
      if (posRef.current.currentX === -100) {
        posRef.current.currentX = e.clientX + 20;
        posRef.current.currentY = e.clientY + 20;
      }
    };

    const render = () => {
      const { targetX, targetY } = posRef.current;
      // Fluid linear interpolation (lerp = 0.18) for trailing spring effect
      posRef.current.currentX += (targetX - posRef.current.currentX) * 0.18;
      posRef.current.currentY += (targetY - posRef.current.currentY) * 0.18;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${posRef.current.currentX}px, ${posRef.current.currentY}px, 0)`;
      }

      // Chroma key processing: draw video to 64x64 canvas and key out dark/black background
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, 64, 64);
          const imgData = ctx.getImageData(0, 0, 64, 64);
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
        <source src="/cur.mp4" type="video/mp4" />
        <source src="/cursor.webm" type="video/webm" />
      </video>

      {/* Floating Video Cursor Follower */}
      <div
        ref={followerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999999,
          willChange: "transform",
          background: "transparent",
        }}
      >
        <canvas
          ref={canvasRef}
          width={64}
          height={64}
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
