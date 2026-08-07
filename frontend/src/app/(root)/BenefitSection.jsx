"use client";
import ClipPathTitle from "@/components/ClipPathTitle";
import { useBreakpoint } from "@/hooks/userBreakpoint";
import Image from "next/image";
export default function BenefitSection() {
    const { isMobile } = useBreakpoint();
    const pul = isMobile ? 2 : 7;
    return (<section className="benefit-section relative min-h-dvh w-full overflow-hidden flex flex-col justify-center items-center py-20 group">
      {/* Full-screen cover image */}
      <div className="absolute inset-0 size-full overflow-hidden z-0">
        <Image src="/images/products/hairoil/oilbenefit.jpeg" alt="KLN Hair Oil Benefits" fill priority sizes="100vw" className="object-cover object-center scale-100 group-hover:scale-108 group-hover:brightness-110 transition-all duration-1000 ease-out"/>
        {/* Creative herbal overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2F5D34]/90 via-[#2F5D34]/75 to-[#2F5D34]/95 backdrop-blur-[1px] group-hover:opacity-80 transition-opacity duration-700"/>
        {/* Creative radial hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)] pointer-events-none"/>
      </div>

      {/* Foreground Content */}
      <div className="container mx-auto relative z-10 px-5">
        <div className="col-center">
          <p className="text-milk/90 font-paragraph text-center text-lg md:text-xl tracking-wide max-w-xl">
            Discover the Benefits: <br />
            Explore the Key Advantages of Choosing KLN Ayurveda
          </p>
          <div className="mt-16 col-center">
            <ClipPathTitle title={"Hair Growth"} color={"#faeade"} bg={"#2F5D34"} className={"first-title"} borderColor={"#222123"} aniStart={10 + pul}/>
            <ClipPathTitle title={"Reduces Hair Fall"} color={"#222123"} bg={"#E7F0E4"} className={"second-title"} borderColor={"#222123"} aniStart={17 + pul}/>
            <ClipPathTitle title={"Nourishes Scalp"} color={"#faeade"} bg={"#5B7C3A"} className={"third-title"} borderColor={"#222123"} aniStart={24 + pul}/>
            <ClipPathTitle title={"Glowing Skin"} color={"#2E2D2F"} bg={"#C9A66B"} className={"fourth-title"} borderColor={"#222123"} aniStart={31 + pul}/>
          </div>
          <div className="mt-12">
            <p className="text-milk/80 font-paragraph text-center text-base md:text-lg tracking-wider animate-pulse">
              And much more ...
            </p>
          </div>
        </div>
      </div>
    </section>);
}
