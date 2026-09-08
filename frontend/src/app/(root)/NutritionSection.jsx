"use client";
import { nutrientLists } from "@/constants";
import { useBreakpoint } from "@/hooks/userBreakpoint";
import { gsap } from "@/libs/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function NutritionSection() {
    const { t, isHindi } = useLanguage();
    const { isMobile } = useBreakpoint();
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.from(".nutrition-card-item", {
            y: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".nutrition-cards-container",
                start: "top 80%",
            },
        });

        gsap.from(".nutrition-title", {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".nutrition-title",
                start: "top 85%",
            },
        });

        gsap.fromTo(
            ".nutrition-text-scroll",
            { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
            {
                duration: 0.8,
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                ease: "circ.out",
                scrollTrigger: {
                    trigger: ".nutrition-text-scroll",
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        gsap.from(".nutrition-desc-text", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".nutrition-desc-text",
                start: "top 85%",
            },
        });

        gsap.from(".nutrition-box", {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".nutrition-box",
                start: "top 90%",
            },
        });
    }, { scope: containerRef });

    const cardsData = [
        {
            src: "/images/products/hairmask/maskbb.jpeg",
            alt: "Hair Mask",
            tag: "Herbal Hair Mask",
            desc: t("home.maskCard", {}, "Deep Conditioning"),
        },
        {
            src: "/images/products/hairoil/oilf.jpeg",
            alt: "Hair Oil",
            tag: "Ayurvedic Hair Oil",
            desc: t("home.oilCard", {}, "Root Strength"),
        },
        {
            src: "/images/products/hairtonic/tonicf.jpeg",
            alt: "Hair Tonic",
            tag: "Revitalizing Tonic",
            desc: t("home.tonicCard", {}, "Scalp Vitality"),
        },
    ];

    return (
        <section ref={containerRef} className="nutrition-section py-16 md:py-24 relative overflow-hidden">
            {/* Top Product Cards Grid */}
            <div className="w-full px-4 md:px-8 nutrition-cards-container">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
                    {cardsData.map((card, idx) => (
                        <div key={idx} className="nutrition-card-item w-full md:flex-1 h-[60vh] md:h-[75vh] lg:h-[80vh] relative rounded-3xl overflow-hidden shadow-xl group border border-white/30 hover:border-[#5B7C3A]/80 hover:shadow-[0_25px_50px_rgba(47,93,52,0.35)] transition-all duration-700 cursor-pointer">
                            <Image src={card.src} alt={card.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 group-hover:rotate-1 transition-all duration-700 ease-out"/>

                            {/* Dark Gradient Overlay for Depth & Contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500"/>

                            {/* Shimmer Light Beam Effect */}
                            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none"/>

                            {/* Creative Glassmorphic Floating Badge */}
                            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10 transform group-hover:-translate-y-1 transition-transform duration-500">
                                <div className="bg-black/40 backdrop-blur-md border border-white/25 px-5 py-3 rounded-2xl text-milk shadow-lg">
                                    <span className="block text-xs uppercase tracking-widest text-[#C9A66B] font-bold">
                                        {card.tag}
                                    </span>
                                    <span className="block text-base md:text-lg font-bold mt-0.5">
                                        {card.desc}
                                    </span>
                                </div>
                                <div className="size-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-[#2F5D34] group-hover:scale-110 transition-all duration-500">
                                    ↗
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Middle Section Header & Description */}
            <div className="flex md:flex-row flex-col justify-between items-center md:px-10 px-5 mt-16 md:mt-20 gap-8">
                <div className="relative inline-block z-10">
                    <div className="general-title relative flex flex-col justify-center items-start gap-4">
                        <div className="overflow-hidden pr-8 py-1">
                            <h1 className="nutrition-title text-[#2F5D34] font-bold tracking-normal pr-4">{t("home.nutritionTitle", {}, "Pure Herbs")}</h1>
                        </div>
                        <div style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }} className="nutrition-text-scroll rotate-[-3deg] border-[.5vw] border-[#E7F0E4]">
                            <div className="bg-[#5B7C3A] py-2 px-6">
                                <h2 className="text-[#E7F0E4] text-2xl md:text-4xl uppercase font-bold tracking-wider">{t("home.nutritionBadge", {}, "Nature's Best")}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center md:max-w-md">
                    <p className="nutrition-desc-text text-lg md:text-right text-balance font-paragraph text-[#2F5D34] font-medium leading-relaxed">
                        {t("home.nutritionDesc", {}, "Authentic Ayurvedic herbs like Bhringraj, Amla, and Brahmi are carefully blended for healthy hair and balanced scalp.")}
                    </p>
                </div>
            </div>

            {/* Bottom Nutrient Stats Bar */}
            <div className="nutrition-box w-full mt-12 md:mt-16 md:px-6 px-3 z-10">
                <div className="list-wrapper bg-[#E7F0E4] rounded-3xl md:rounded-full border-[.4vw] border-[#d8e4d2] mx-auto max-w-[1800px] py-6 px-3 flex flex-wrap md:flex-nowrap justify-around items-center gap-3 md:gap-1 shadow-lg overflow-x-auto">
                    {nutrientLists.map((nutrient, index) => {
                        const displayLabel = isHindi && nutrient.labelHi ? nutrient.labelHi : nutrient.label;
                        const displayAmount = isHindi && nutrient.amountHi ? nutrient.amountHi : nutrient.amount;

                        return (
                            <div key={index} className="relative flex-1 min-w-[100px] sm:min-w-[120px] text-center px-1 py-1">
                                <div>
                                    <p className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-wider font-paragraph text-[#2F5D34]">
                                        {displayLabel}
                                    </p>
                                    <p className="font-paragraph text-[11px] sm:text-xs my-0.5 text-[#2F5D34]/70 font-semibold">
                                        {isHindi ? "के लिए" : "for"}
                                    </p>
                                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#2F5D34]">
                                        {displayAmount}
                                    </p>
                                </div>

                                {index !== nutrientLists.length - 1 && (
                                    <div className="hidden md:block spacer-border absolute right-0 top-1/2 transform -translate-y-1/2 h-14 w-px bg-[#C9A66B]/50"/>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
