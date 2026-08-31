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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      if (first && first.querySelector("h1")) {
        tl.from(first.querySelector("h1"), {
          yPercent: 100,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      if (scrollBox) {
        tl.fromTo(
          scrollBox,
          { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
          {
            duration: 0.6,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "power2.out",
          },
          "-=0.4"
        );
      }

      if (second && second.querySelector("h1")) {
        tl.from(
          second.querySelector("h1"),
          {
            yPercent: 100,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="general-title flex flex-col justify-center items-center gap-4 sm:gap-6 lg:gap-8 select-none text-center">
      <div className="overflow-hidden py-1 first-text-split">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#2F5D34] uppercase tracking-tight">
          We Craft
        </h1>
      </div>

      <div
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        className="flavor-text-scroll rotate-[-3deg] border-4 border-[#E7F0E4] shadow-lg"
      >
        <div className="bg-[#5B7C3A] py-2 px-6 sm:px-8">
          <h2 className="text-[#F6F3EC] text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase font-black tracking-wider">
            Pure
          </h2>
        </div>
      </div>

      <div className="overflow-hidden py-1 second-text-split">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#2F5D34] uppercase tracking-tight">
          Herbal Care
        </h1>
      </div>
    </div>
  );
}
