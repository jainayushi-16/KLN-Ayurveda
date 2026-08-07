"use client";
import { gsap } from "@/libs/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function ClipPathTitle({ title, color, bg, className, borderColor, aniStart, }) {
    const titleRef = useRef(null);

    useGSAP(() => {
        if (!titleRef.current) return;
        gsap.fromTo(titleRef.current,
            {
                opacity: 0.2,
                clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
            },
            {
                duration: 1,
                opacity: 1,
                clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".benefit-section",
                    start: `${aniStart}% 90%`,
                    end: `${aniStart + 12}% 90%`,
                    scrub: 0.5,
                },
            }
        );
    });

    return (<div className="general-title">
      <div 
        ref={titleRef}
        style={{
            clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
            borderColor,
        }} className={`${className} border-[.5vw] text-nowrap`}>
        <div className="pb-5 md:px-14 px-3 md:pt-0 pt-3" style={{
            backgroundColor: bg,
        }}>
          <h2 style={{ color }}>
            {title}
          </h2>
        </div>
      </div>
    </div>);
}
