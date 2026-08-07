"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";
import Image from "next/image";
import { useRef } from "react";

export default function MessageSection() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.to(".first-message", {
            color: "#faeade",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".message-content",
                start: "top 70%",
                end: "top 30%",
                scrub: true,
            },
        });

        gsap.to(".second-message", {
            color: "#faeade",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".second-message",
                start: "top 80%",
                end: "bottom center",
                scrub: true,
            },
        });

        gsap.to(".msg-text-scroll", {
            duration: 0.8,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "circ.inOut",
            scrollTrigger: {
                trigger: ".msg-text-scroll",
                start: "top 75%",
                toggleActions: "play none none reverse",
            },
        });

        gsap.from(".message-content p", {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".message-content p",
                start: "top 85%",
            },
        });
    }, { scope: containerRef });
    return (<section ref={containerRef} className="message-content">
      <Image src={"/images/branch.svg"} alt="" height={500} width={500} className="absolute top-10 right-10 opacity-20 floating-leaf"/>
      <Image src={"/images/leaf-2.svg"} alt="" height={300} width={300} className="absolute bottom-10 left-10 opacity-20 floating-leaf"/>
      <div className="container mx-auto flex-center py-28 relative">
        <div className="w-full h-full">
          <div className="msg-wrapper">
            <h1 className="first-message">Rooted in Ayurveda,</h1>

            <div style={{
            clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
        }} className="msg-text-scroll">
              <div className="bg-light-brown md:pb-5 pb-3 px-5">
                <h2 className="text-red-brown">Nurtured</h2>
              </div>
            </div>

            <h1 className="second-message">
              by nature for healthy hair and glowing skin
            </h1>
          </div>
          <div className="flex-center md:mt-20 mt-10">
            <div className="max-w-md px-10 flex-center overflow-hidden">
              <p>
                Every drop is crafted with authentic herbs, chemical-free
                formulations, and the timeless wisdom of Ayurveda for your
                natural beauty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
