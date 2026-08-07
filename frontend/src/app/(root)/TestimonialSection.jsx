"use client";
import { cards } from "@/constants";
import { gsap } from "@/libs/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function TestimonialSection() {
    const vdRef = useRef([]);
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".testimonials-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });
        tl.to(".testimonials-section .first-title", {
            xPercent: 70,
        })
            .to(".testimonials-section .second-title", {
            xPercent: 25,
        }, "<")
            .to(".testimonials-section .third-title", {
            xPercent: -50,
        }, "<");

        const pinTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".testimonials-section",
                start: "top top",
                end: "+=100%",
                scrub: 1,
                pin: true,
            },
        });
        pinTl.from(".vd-card", {
            yPercent: 150,
            stagger: 0.2,
            ease: "power1.inOut",
        });
    }, { scope: containerRef });

    const handlePlay = (index) => {
        const video = vdRef.current[index];
        if (video) {
            video.play().catch(() => {});
        }
    };
    const handlePause = (index) => {
        const video = vdRef.current[index];
        if (video) {
            video.pause();
        }
    };
    return (<section ref={containerRef} className="testimonials-section ">
      <div className="absolute size-full flex flex-col items-center pt-[5vw]">
        <h1 className="text-black first-title"> Our </h1>
        <h1 className="text-light-brown second-title"> Customers </h1>
        <h1 className="text-black third-title"> Love </h1>
      </div>

      <div className="pin-box h-full top-1">
        {cards.map((card, index) => (<div key={index} className={`vd-card ${card.translation} ${card.rotation}`} onMouseEnter={() => handlePlay(index)} onMouseLeave={() => handlePause(index)}>
            <video ref={el => {
                if (el)
                    vdRef.current[index] = el;
            }} src={card.src} playsInline muted loop className="size-full object-cover"/>
          </div>))}
      </div>
    </section>);
}
