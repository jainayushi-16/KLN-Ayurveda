"use client";
import { CATEGORIES } from "@/constants/products";
export default function FloatingGlassFilter({ searchQuery, selectedCategory, onSearchChange, onCategoryChange, onClear, }) {
    const hasActiveFilters = searchQuery || selectedCategory !== "All";
    return (<div className="w-full flex justify-center mb-16 px-4">
      <div className="bg-white/75 backdrop-blur-xl border border-white/90 p-3 md:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-4xl">
        {/* Search input */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <input type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search formulation..." className="w-full py-2.5 px-4 pr-8 rounded-full bg-white/80 border border-[#2F5D34]/15 text-xs md:text-sm font-medium text-[#222123] outline-none placeholder:text-gray-400 focus:border-[#2F5D34] transition-all shadow-inner"/>
          {searchQuery && (<button onClick={() => onSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs">
              ✕
            </button>)}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {CATEGORIES.map((cat) => (<button key={cat} onClick={() => onCategoryChange(cat)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${selectedCategory === cat
                ? "bg-[#2F5D34] text-white shadow-md scale-105"
                : "bg-white/60 text-gray-700 hover:bg-white hover:text-[#2F5D34]"}`}>
              {cat}
            </button>))}
        </div>

        {/* Clear Filters button */}
        {hasActiveFilters && (<button onClick={onClear} className="px-3.5 py-2 rounded-full bg-[#C9A66B]/20 text-[#222123] hover:bg-[#C9A66B] text-xs font-bold uppercase tracking-wider transition-all">
            Reset ✕
          </button>)}
      </div>
    </div>);
}
