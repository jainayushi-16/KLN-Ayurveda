"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";
export default function ShopReviews() {
    useGSAP(() => {
        gsap.from(".review-card", {
            y: 40,
            opacity: 0,
            scale: 0.96,
            filter: "blur(8px)",
            stagger: 0.12,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".shop-reviews-container",
                start: "top 80%",
                toggleActions: "play none none none",
                once: true,
            },
        });
    });
    const reviews = [
        {
            name: "Ananya Sharma",
            location: "Mumbai",
            product: "Intensive Hair Growth Oil",
            rating: 5,
            comment: "My hair fall reduced significantly within 3 weeks of using this oil. My scalp feels deeply nourished and healthier than ever!",
            avatar: "🌸",
        },
        {
            name: "Rohan Varma",
            location: "Delhi",
            product: "Scalp Revitalizing Tonic",
            rating: 5,
            comment: "Non-sticky and lightweight! I spray it twice daily after showers and my scalp itchiness completely disappeared.",
            avatar: "🌿",
        },
        {
            name: "Priya Nair",
            location: "Bengaluru",
            product: "Root Fortifying Hair Fall Serum",
            rating: 5,
            comment: "Noticeably reduced hair fall within 2 weeks! My roots feel significantly stronger and hair looks visibly thicker.",
            avatar: "🌱",
        },
    ];
    return (<section className="py-20 bg-white shop-reviews-container border-t border-[#2F5D34]/10">
      <div className="container mx-auto px-5 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-[#E7F0E4] px-4 py-1.5 rounded-full inline-block mb-3">
            Real Results
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#222123]">
            Loved by Thousands
          </h2>
          <p className="text-gray-600 font-paragraph text-base md:text-lg mt-3">
            Read verified customer experiences with KLN Ayurvedic formulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (<div key={idx} className="review-card bg-[#F6F3EC] p-8 rounded-3xl border border-[#2F5D34]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-[#C9A66B] text-lg font-bold">
                    {"★".repeat(rev.rating)}
                  </div>
                  <span className="text-xs font-bold text-[#5B7C3A] bg-white px-2.5 py-1 rounded-full border border-[#5B7C3A]/20">
                    Verified Buyer
                  </span>
                </div>
                <p className="text-sm font-paragraph text-gray-700 leading-relaxed italic mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <div className="size-12 rounded-full bg-[#2F5D34] text-white flex items-center justify-center text-xl shadow">
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#222123]">
                    {rev.name}
                  </h4>
                  <span className="text-xs font-paragraph text-gray-500">
                    {rev.location} • {rev.product}
                  </span>
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
}
