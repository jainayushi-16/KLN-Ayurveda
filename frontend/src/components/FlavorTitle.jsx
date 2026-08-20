"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";
import { useRef } from "react";

export default function FlavorTitle() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (typeof window === "undefined" || !container) return;

      const first = container.querySelector(".first-text-split");
      const scrollBox = container.querySelector(".flavor-text-scroll");
      const second = container.querySelector(".second-text-split");

      if (first && first.querySelector("h1")) {
        gsap.from(first.querySelector("h1"), {
          yPercent: 100,
          duration: 0.8,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: first,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }
      if (scrollBox) {
        gsap.to(scrollBox, {
          duration: 0.8,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          scrollTrigger: {
            trigger: scrollBox,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }
      if (second && second.querySelector("h1")) {
        gsap.from(second.querySelector("h1"), {
          yPercent: 100,
          duration: 0.8,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: second,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="general-title col-center h-full 2xl:gap-32 xl:gap-24 gap-16">
      <div className="overflow-hidden 2xl:py-0 py-3 first-text-split">
        <h1>We craft</h1>
      </div>

      <div
        style={{
          clipPath: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)",
        }}
        className="flavor-text-scroll"
      >
        <div className="bg-mid-brown pb-5 2xl:pt-0 pt-3 2xl:px-5 px-3">
          <h2 className="text-milk">pure</h2>
        </div>
      </div>

      <div className="overflow-hidden 2xl:py-0 py-3 second-text-split">
        <h1>herbal care</h1>
      </div>
    </div>
  );
}
