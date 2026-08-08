"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";
import Image from "next/image";
import { useBreakpoint } from "@/hooks/userBreakpoint";
import Link from "next/link";

export default function Hero() {
    const { isMobile, isTablet } = useBreakpoint();
    useGSAP(() => {
        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero-container",
                start: "1% top",
                end: "bottom top",
                scrub: true,
            },
        });
        heroTl.to(".hero-container", {
            rotate: 5,
            scale: 0.92,
            yPercent: 20,
            ease: "power1.inOut",
        });
    });
    return (<section className="bg-main-bg">
      <div className="hero-container">
        <Image src={"/images/leaf.svg"} alt="" height={400} width={400} className="absolute top-10 left-10 opacity-20 floating-leaf"/>
        <Image src={"/images/flower.svg"} alt="" height={300} width={300} className="absolute bottom-20 right-10 opacity-20 floating-leaf"/>
        {isTablet ? (<>
            {isMobile && (<Image src={"/images/products/hairoil/oilf.jpeg"} alt="hero-image" height={1000} width={1000} className="absolute bottom-50 left-1/2 -translate-x-1/2 object-auto scale-200 md:scale-300 w-120"/>)}
            <Image src={"/images/products/hairoil/oilb.jpeg"} alt="hero-image" height={1000} width={1000} className="absolute top-110 md:top-130 left-1/2 -translate-x-1/2 object-auto scale-100 md:scale-150 w-120"/>
          </>) : (<video src={"videos/hero2.mp4"} autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover"/>)}
        {/* <div className="hero-cta opacity-0 absolute bottom-10 left-1/2 -translate-x-1/2 z-20">

          {/* <div className="overflow-hidden">
            <h1 className="hero-title">Ancient Wisdom</h1>
          </div>
          <div
            style={{
              clipPath: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)",
            }}
            className="hero-text-scroll"
          >
            <div className="hero-subtitle">
              <h1>KLN Ayurveda</h1>
            </div>
          </div>
          <h2>
            Nature&apos;s purest care for healthy hair and glowing skin, crafted
            with authentic Ayurvedic herbs.
          </h2> */}
        {/* <div className="hero-button cursor-pointer">
          <p>Explore Collection</p>
        </div>
      </div> */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
        <Link href="/shop">
          <button className="hero-explore-btn px-14 md:px-20 py-5.5 md:py-7 rounded-full bg-[#F6F3EC] text-[#2F5D34] text-2xl md:text-3xl font-black tracking-widest uppercase border-4 border-[#2F5D34] shadow-[0_15px_45px_rgba(0,0,0,0.3)] hover:bg-[#2F5D34] hover:text-[#F6F3EC] hover:shadow-[0_20px_50px_rgba(47,93,52,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
            <strong className="font-black" style={{ fontWeight: 900, WebkitTextStroke: "0.8px currentColor" }}>
              Explore Collection
            </strong>
          </button>
        </Link>
      </div>
    </div>
    </section>);
}
