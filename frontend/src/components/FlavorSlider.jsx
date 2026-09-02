"use client";

import { flavorlists } from "@/constants";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export default function FlavorSlider() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [failedVideos, setFailedVideos] = useState({});

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current || !trackRef.current) return;

      const mediaQuery = window.matchMedia("(min-width: 768px)");
      if (!mediaQuery || !mediaQuery.matches) return;

      const section = document.querySelector(".flavor-section");
      if (!section) return;

      const track = trackRef.current;
      const calculateDistance = () => track.scrollWidth - track.parentElement.clientWidth + 80;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${calculateDistance() + 300}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(track, {
        x: () => -calculateDistance(),
        ease: "none",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="slider-wrapper relative w-full h-full overflow-hidden flex items-center py-6">
      {/* Herbal background elements */}
      <Image
        src="/images/branch.svg"
        alt=""
        width={300}
        height={300}
        className="absolute top-0 left-0 opacity-30 pointer-events-none z-0"
      />
      <Image
        src="/images/leaf.svg"
        alt=""
        width={200}
        height={200}
        className="absolute bottom-5 right-5 opacity-30 pointer-events-none z-0 floating-leaf"
      />
      <Image
        src="/images/flower.svg"
        alt=""
        width={180}
        height={180}
        className="absolute bottom-0 left-0 opacity-25 pointer-events-none z-0"
      />

      {/* Horizontal track container */}
      <div className="w-full overflow-x-auto md:overflow-hidden px-4 md:px-6 custom-scrollbar">
        <div ref={trackRef} className="flavors flex flex-row items-center gap-6 md:gap-10 flex-nowrap py-4">
          {flavorlists.map((flavor, index) => {
            const hasVideoError = failedVideos[flavor.name];

            return (
              <Link
                key={flavor.name}
                href={`/product/${flavor.productId || "kln-hair-oil-01"}`}
                className={`relative z-30 flex-none w-[82vw] sm:w-[320px] md:w-[420px] lg:w-[460px] h-[50vh] sm:h-[55vh] md:h-[62vh] ${flavor.rotation} transition-all duration-500 hover:scale-105 hover:z-40 cursor-pointer block`}
              >
                <div className="w-full h-full relative overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white bg-[#122815] group">
                  {/* High Quality Product Poster Image Fallback */}
                  {flavor.poster && (
                    <Image
                      src={flavor.poster}
                      alt={flavor.name}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                    />
                  )}

                  {/* Video Player overlay */}
                  {!hasVideoError && flavor.video && (
                    <video
                      src={flavor.video}
                      poster={flavor.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      onError={() => setFailedVideos((prev) => ({ ...prev, [flavor.name]: true }))}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-10"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none z-20" />
                  <div className="absolute bottom-6 left-6 right-6 z-30 text-white flex justify-between items-end">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-[#2F5D34] text-[#E7F0E4] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 shadow-md">
                        0{index + 1} — Authentic Formulation
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F6F3EC]">
                        {flavor.name}
                      </h3>
                    </div>
                    <div className="size-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-[#2F5D34] group-hover:scale-110 transition-all">
                      ↗
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
