"use client";
import { flavorlists } from "@/constants";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";
import Image from "next/image";
import { useRef } from "react";
import { useBreakpoint } from "@/hooks/userBreakpoint";
export default function FlavorSlider() {
    const sliderRef = useRef(null);
    const { isMd, isLg, isXl } = useBreakpoint();
    useGSAP(() => {
        if (!sliderRef.current) return;
        if (!isMd && !isLg && !isXl) return;

        const scrollAmount = sliderRef.current.scrollWidth - window.innerWidth;
        const isLgEnd = isLg || isXl
            ? `+=${Math.max(scrollAmount + 800, 1000)}px`
            : `+=${Math.max(scrollAmount, 600)}px`;
        const isItLg = isLg || isXl
            ? `-=${Math.max(scrollAmount + 800, 1000)}px`
            : `-=${Math.max(scrollAmount, 600)}px`;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".flavor-section",
                start: "top top",
                end: isLgEnd,
                scrub: 1,
                pin: true,
            },
        });

        tl.to(".flavors", {
            x: isItLg,
            ease: "none",
        });

        if (isXl) {
            const titleTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".flavor-section",
                    start: "top top",
                    end: "bottom 80%",
                    scrub: true,
                },
            });
            titleTl
                .to(".first-text-split", {
                    xPercent: -20,
                    ease: "power1.inOut",
                })
                .to(".flavor-text-scroll", {
                    xPercent: -15,
                    ease: "power1.inOut",
                }, "<")
                .to(".second-text-split", {
                    xPercent: -8,
                    ease: "power1.inOut",
                }, "<");
        }
    }, { scope: sliderRef, dependencies: [isMd, isLg, isXl] });
    return (<div ref={sliderRef} className="slider-wrapper">
      {/* Herbal background elements */}
      <Image src="/images/branch.svg" alt="" width={300} height={300} className="absolute top-0 left-0 opacity-40 pointer-events-none z-0"/>
      <Image src="/images/leaf.svg" alt="" width={200} height={200} className="absolute bottom-10 right-0 opacity-40 pointer-events-none z-0 floating-leaf"/>
      <Image src="/images/leaf-2.svg" alt="" width={220} height={220} className="absolute top-20 right-10 opacity-30 pointer-events-none z-0 floating-leaf"/>
      <Image src="/images/flower.svg" alt="" width={180} height={180} className="absolute bottom-0 left-0 opacity-30 pointer-events-none z-0"/>
      <div className="flavors relative z-10 md:translate-x-[255vw] lg:translate-x-0 mt-30">
        {flavorlists.map(flavor => (<div key={flavor.name} className={`relative z-30 lg:w-[50vw] w-96 lg:h-[80vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${flavor.rotation}`}>
            {/* <Image
              src={flavor.images.background}
              alt={`${flavor.name}`}
              height={900}
              width={900}
              className="absolute bottom-0 md:h-100 lg:h-auto"
            /> */}
            {/* <Image
              src={flavor.images.product}
              alt={`${flavor.name} Product`}
              height={800}
              width={800}
              className="drinks w-65 md:w-95 lg:w-110 "
            /> */}
            {/* <Image
              src={flavor.images.ingredient}
              alt={`${flavor.name} Ingredient`}
              height={400}
              width={400}
              className="elements"
            /> */}
            <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover rounded-[2rem] shadow-xl">
              <source src={flavor.video} type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </div>))}
      </div>
    </div>);
}
