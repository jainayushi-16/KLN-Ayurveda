"use client";
export default function SortDropdown({ value, onChange }) {
    return (<div className="flex items-center gap-3">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap hidden sm:block">
        Sort By:
      </label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none py-2.5 pl-4 pr-10 rounded-2xl bg-white border border-[#2F5D34]/20 text-xs sm:text-sm font-bold text-[#2F5D34] outline-none shadow-sm cursor-pointer hover:border-[#2F5D34] transition-all">
          <option value="featured">Featured</option>
          <option value="bestselling">Best Selling</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
        </select>
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#2F5D34] pointer-events-none">
          ▼
        </span>
      </div>
    </div>);
}
