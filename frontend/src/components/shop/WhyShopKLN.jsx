"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";
export default function WhyShopKLN() {
    useGSAP(() => {
        gsap.from(".why-kln-card", {
            y: 40,
            opacity: 0,
            scale: 0.96,
            filter: "blur(8px)",
            stagger: 0.12,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".why-kln-container",
                start: "top 80%",
                toggleActions: "play none none none",
                once: true,
            },
        });
    });
    const features = [
        {
            icon: "🌿",
            title: "100% Natural Botanicals",
            desc: "Pure Ayurvedic herbs sourced directly from organic farms in India without harmful chemicals.",
        },
        {
            icon: "📜",
            title: "GMP & Ayush Certified",
            desc: "Formulated using traditional Kshirapaka methods under strict pharmaceutical standards.",
        },
        {
            icon: "🚚",
            title: "Fast Global Shipping",
            desc: "Express eco-friendly dispatch to your doorstep with real-time tracking.",
        },
        {
            icon: "🛡️",
            title: "100% Secure Payments",
            desc: "Encrypted transactions with easy 30-day hassle-free returns.",
        },
    ];
    return (<section className="py-20 bg-[#F6F3EC] why-kln-container">
      <div className="container mx-auto px-5 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-[#E7F0E4] px-4 py-1.5 rounded-full inline-block mb-3">
            The KLN Difference
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#222123]">
            Why Choose KLN Ayurveda
          </h2>
          <p className="text-gray-600 font-paragraph text-base md:text-lg mt-3">
            Pure, uncompromised wellness backed by ancient wisdom and modern quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (<div key={idx} className="why-kln-card bg-white p-8 rounded-3xl border border-[#2F5D34]/10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col items-center text-center group">
              <div className="size-16 rounded-2xl bg-[#E7F0E4] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-[#2F5D34] group-hover:text-white transition-all duration-500">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-[#222123] mb-2">
                {item.title}
              </h3>
              <p className="text-sm font-paragraph text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>))}
        </div>
      </div>
    </section>);
}
