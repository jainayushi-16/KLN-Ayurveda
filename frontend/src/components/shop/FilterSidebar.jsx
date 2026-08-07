"use client";
import { CATEGORIES, PRODUCT_TYPES, BENEFITS } from "@/constants/products";
export default function FilterSidebar({ filters, onChangeFilter, onClearFilters, isMobileOpen, onCloseMobile, }) {
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
          Filters
        </h3>
        <button onClick={onClearFilters} className="text-xs font-bold uppercase tracking-wider text-[#5B7C3A] hover:text-[#2F5D34] underline transition-colors">
          Clear All
        </button>
      </div>

      {/* Search Input */}
      {/* <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Search Products
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onChangeFilter({ searchQuery: e.target.value })}
              placeholder="Search hair oil, mask..."
              className="w-full py-3 px-4 rounded-2xl bg-white border border-[#2F5D34]/20 outline-none text-sm text-[#222123] placeholder:text-gray-400 focus:border-[#2F5D34] transition-all shadow-sm"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onChangeFilter({ searchQuery: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div> */}

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Categories
        </label>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (<button key={cat} onClick={() => onChangeFilter({ category: cat })} className={`text-left py-2 px-4 rounded-xl text-sm font-medium transition-all ${filters.category === cat
                ? "bg-[#2F5D34] text-white font-bold shadow-md"
                : "bg-white/60 hover:bg-white text-gray-700 hover:text-[#2F5D34]"}`}>
              {cat}
            </button>))}
        </div>
      </div>

      {/* Product Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Product Type
        </label>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_TYPES.map((t) => (<button key={t} onClick={() => onChangeFilter({ type: t })} className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all border ${filters.type === t
                ? "bg-[#5B7C3A] text-white border-[#5B7C3A]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#5B7C3A]"}`}>
              {t}
            </button>))}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Key Benefits
        </label>
        <div className="flex flex-col gap-2.5">
          {BENEFITS.map((benefit) => {
            const isChecked = filters.selectedBenefits.includes(benefit);
            return (<label key={benefit} className="flex items-center gap-3 cursor-pointer text-sm font-paragraph text-gray-700 hover:text-[#2F5D34] transition-colors">
                <input type="checkbox" checked={isChecked} onChange={() => toggleBenefit(benefit)} className="size-4 rounded accent-[#2F5D34] cursor-pointer"/>
                <span>{benefit}</span>
              </label>);
        })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Max Price
          </label>
          <span className="text-sm font-bold text-[#2F5D34]">
            ₹{filters.maxPrice}
          </span>
        </div>
        <input type="range" min={0} max={2000} step={10} value={filters.maxPrice} onChange={(e) => onChangeFilter({ maxPrice: Number(e.target.value) })} className="w-full accent-[#2F5D34] cursor-pointer"/>
        <div className="flex justify-between text-xs text-gray-400 mt-1 font-paragraph">
          <span>₹0</span>
          <span>₹2000</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Minimum Rating
        </label>
        <div className="flex gap-2">
          {[0, 4.5, 4.8].map((star) => (<button key={star} onClick={() => onChangeFilter({ minRating: star })} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${filters.minRating === star
                ? "bg-[#C9A66B] text-[#222123] border-[#C9A66B]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#C9A66B]"}`}>
              {star === 0 ? "All" : `★ ${star}+`}
            </button>))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Availability
        </label>
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-3 cursor-pointer text-sm font-paragraph text-gray-700">
            <input type="checkbox" checked={filters.inStockOnly} onChange={(e) => onChangeFilter({ inStockOnly: e.target.checked })} className="size-4 rounded accent-[#2F5D34] cursor-pointer"/>
            <span>In Stock Only</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-sm font-paragraph text-gray-700">
            <input type="checkbox" checked={filters.onSaleOnly} onChange={(e) => onChangeFilter({ onSaleOnly: e.target.checked })} className="size-4 rounded accent-[#2F5D34] cursor-pointer"/>
            <span>On Sale / Discounted</span>
          </label>
        </div>
      </div>
    </div>);
    return (<>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 flex-none sticky top-28 h-fit bg-[#F6F3EC]/80 backdrop-blur-md p-6 rounded-3xl border border-[#2F5D34]/15 shadow-sm">
        {content}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (<div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div onClick={onCloseMobile} className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"/>

          {/* Drawer Container */}
          <div className="relative ml-auto w-full max-w-xs bg-[#F6F3EC] h-full overflow-y-auto p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2F5D34]/20">
              <h2 className="text-lg font-bold uppercase tracking-wider text-[#2F5D34]">
                Filter Products
              </h2>
              <button onClick={onCloseMobile} className="size-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-gray-600 shadow">
                ✕
              </button>
            </div>
            {content}
          </div>
        </div>)}
    </>);
}
