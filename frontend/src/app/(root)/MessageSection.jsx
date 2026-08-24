"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";
import Image from "next/image";
import { useRef } from "react";

export default function MessageSection() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (typeof window === "undefined" || !container) return;

      const firstMsg = container.querySelector(".first-message");
      const secondMsg = container.querySelector(".second-message");
      const scrollMsg = container.querySelector(".msg-text-scroll");
      const descPara = container.querySelector("p");

      if (firstMsg) {
        gsap.to(firstMsg, {
          color: "#faeade",
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top 70%",
            end: "top 30%",
            scrub: true,
          },
        });
      }

      if (secondMsg) {
        gsap.to(secondMsg, {
          color: "#faeade",
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: secondMsg,
            start: "top 80%",
            end: "bottom center",
            scrub: true,
          },
        });
      }

      if (scrollMsg) {
        gsap.to(scrollMsg, {
          duration: 0.8,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "circ.inOut",
          scrollTrigger: {
            trigger: scrollMsg,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (descPara) {
        gsap.from(descPara, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descPara,
            start: "top 85%",
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="message-content">
      <Image
        src="/images/branch.svg"
        alt=""
        height={500}
        width={500}
        className="absolute top-10 right-10 opacity-20 floating-leaf pointer-events-none"
      />
      <Image
        src="/images/leaf-2.svg"
        alt=""
        height={300}
        width={300}
        className="absolute bottom-10 left-10 opacity-20 floating-leaf pointer-events-none"
      />
      <div className="container mx-auto flex-center py-28 relative">
        <div className="w-full h-full">
          <div className="msg-wrapper">
            <h1 className="first-message">Rooted in Ayurveda,</h1>

            <div
              style={{
                clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
              }}
              className="msg-text-scroll"
            >
              <div className="bg-light-brown md:pb-5 pb-3 px-5">
                <h2 className="text-red-brown">Nurtured</h2>
              </div>
            </div>

            <h1 className="second-message">
              by nature for healthy hair and scalp
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
    </section>
  );
}
