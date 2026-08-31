"use client";
import { gsap } from "@/libs/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function ClipPathTitle({ title, color, bg, className, borderColor }) {
    const titleRef = useRef(null);

    useGSAP(() => {
        if (!titleRef.current) return;
        gsap.fromTo(titleRef.current,
            {
                opacity: 0.3,
                clipPath: "polygon(30% 0, 70% 0, 70% 100%, 30% 100%)",
            },
            {
                duration: 0.8,
                opacity: 1,
                clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
                ease: "power2.out",
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            }
        );
    }, { scope: titleRef });

    return (<div className="general-title my-2">
      <div 
        ref={titleRef}
        style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            borderColor,
        }} className={`${className} border-[.5vw] text-nowrap shadow-xl transition-all duration-300 hover:scale-105`}>
        <div className="pb-5 md:px-14 px-5 md:pt-0 pt-3" style={{
            backgroundColor: bg,
        }}>
          <h2 style={{ color }}>
            {title}
          </h2>
        </div>
      </div>
    </div>);
}

