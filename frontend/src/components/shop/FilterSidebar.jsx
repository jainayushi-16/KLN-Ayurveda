"use client";
import { CATEGORIES, PRODUCT_TYPES, BENEFITS } from "@/constants/products";
import { useLanguage } from "@/i18n/LanguageContext";

export default function FilterSidebar({ filters, onChangeFilter, onClearFilters, isMobileOpen, onCloseMobile, }) {
    const { t } = useLanguage();
    const toggleBenefit = (benefit) => {
        const exists = filters.selectedBenefits.includes(benefit);
        const updated = exists
            ? filters.selectedBenefits.filter((b) => b !== benefit)
            : [...filters.selectedBenefits, benefit];
        onChangeFilter({ selectedBenefits: updated });
    };
    const content = (<div className="flex flex-col gap-8 text-[#222123]">
      {/* Header & Clear Filters */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2F5D34]/15">
        <h3 className="text-xl font-bold uppercase tracking-wide text-[#2F5D34]">
          {t("shopPage.filterTitle", {}, "Filters")}
        </h3>
        <button onClick={onClearFilters} className="text-xs font-bold uppercase tracking-wider text-[#5B7C3A] hover:text-[#2F5D34] underline transition-colors">
          {t("shopPage.clearAll", {}, "Clear All")}
        </button>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          {t("shopPage.categories", {}, "Categories")}
        </label>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => {
            const catKeyMap = {
              "All": "shopPage.catAll",
              "Hair Oils": "shopPage.catHairOils",
              "Scalp Care": "shopPage.catScalpCare",
              "Herbal Hair Care": "shopPage.catHerbalHairCare",
            };
            const label = t(catKeyMap[cat] || cat, {}, cat);
            return (
              <button
                key={cat}
                onClick={() => onChangeFilter({ category: cat })}
                className={`text-left py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                  filters.category === cat
                    ? "bg-[#2F5D34] text-white font-bold shadow-md"
                    : "bg-white/60 hover:bg-white text-gray-700 hover:text-[#2F5D34]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          {t("shopPage.productType", {}, "Product Type")}
        </label>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_TYPES.map((typeVal) => {
            const typeKeyMap = {
              "All": "shopPage.catAll",
              "Oil": "shopPage.typeOil",
              "Tonic": "shopPage.typeTonic",
              "Mask": "shopPage.typeMask",
            };
            const label = t(typeKeyMap[typeVal] || typeVal, {}, typeVal);
            return (
              <button
                key={typeVal}
                onClick={() => onChangeFilter({ type: typeVal })}
                className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all border ${
                  filters.type === typeVal
                    ? "bg-[#5B7C3A] text-white border-[#5B7C3A]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#5B7C3A]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          {t("shopPage.keyBenefits", {}, "Key Benefits")}
        </label>
        <div className="flex flex-col gap-2.5">
          {BENEFITS.map((benefit) => {
            const isChecked = filters.selectedBenefits.includes(benefit);
            const benefitKeyMap = {
              "Hair Growth": "shopPage.benefitHairGrowth",
              "Hair Fall Control": "shopPage.benefitHairFallControl",
              "Scalp Nourishment": "shopPage.benefitScalpNourishment",
              "Anti-Dandruff": "shopPage.benefitAntiDandruff",
              "Root Strengthening": "shopPage.benefitRootStrengthening",
            };
            const label = t(benefitKeyMap[benefit] || benefit, {}, benefit);
            return (
              <label key={benefit} className="flex items-center gap-3 cursor-pointer text-sm font-paragraph text-gray-700 hover:text-[#2F5D34] transition-colors">
                <input type="checkbox" checked={isChecked} onChange={() => toggleBenefit(benefit)} className="size-4 rounded accent-[#2F5D34] cursor-pointer"/>
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {t("shopPage.maxPrice", {}, "Max Price")}
          </label>
          <span className="text-sm font-bold text-[#2F5D34]">
            ₹{filters.maxPrice}
          </span>
        </div>
        <input type="range" min={0} max={2000} step={10} value={filters.maxPrice} onChange={(e) => onChangeFilter({ maxPrice: Number(e.target.value) })} className="w-full accent-[#2F5D34] cursor-pointer"/>
      </div>
    </div>);
    return (<>
      {/* Desktop Sidebar */}
      <div>{content}</div>

      {/* Mobile Drawer */}
      {isMobileOpen && (<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="bg-[#F6F3EC] w-full max-w-xs h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <span className="font-bold text-[#2F5D34] uppercase tracking-wider text-sm">
                  {t("shopPage.filterMobileTitle", {}, "Filter Formulations")}
                </span>
                <button onClick={onCloseMobile} className="size-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold">
                  ✕
                </button>
              </div>
              {content}
            </div>

            <button onClick={onCloseMobile} className="w-full mt-6 py-3 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-lg">
              {t("shopPage.applyFilters", {}, "Apply Filters")}
            </button>
          </div>
        </div>)}
    </>);
}
