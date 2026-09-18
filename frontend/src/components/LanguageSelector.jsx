'use client';

import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector({ className = '', variant = 'auto' }) {
  const { setLocale, isHindi } = useLanguage();
  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs font-bold select-none ${className}`}>
      <Globe className={`w-4 h-4 ${isDark ? 'text-[#C9A66B]' : 'text-[#2F5D34]'}`} />
      <button
        type="button"
        onClick={() => setLocale('en-IN')}
        className={`px-3 py-1.5 rounded-full transition-all duration-300 font-extrabold cursor-pointer ${
          !isHindi
            ? isDark
              ? 'bg-[#C9A66B] text-[#1B351E] shadow-md scale-105'
              : 'bg-[#2F5D34] text-white shadow-md scale-105'
            : isDark
            ? 'text-white hover:text-[#C9A66B] hover:bg-white/15'
            : 'text-[#222123] hover:text-[#2F5D34] hover:bg-[#E7F0E4]'
        }`}
        title="Switch to English"
      >
        English
      </button>
      <span className={isDark ? 'text-white/40' : 'text-gray-300'}>|</span>
      <button
        type="button"
        onClick={() => setLocale('hi-IN')}
        className={`px-3 py-1.5 rounded-full transition-all duration-300 font-extrabold cursor-pointer ${
          isHindi
            ? isDark
              ? 'bg-[#C9A66B] text-[#1B351E] shadow-md scale-105'
              : 'bg-[#2F5D34] text-white shadow-md scale-105'
            : isDark
            ? 'text-white hover:text-[#C9A66B] hover:bg-white/15'
            : 'text-[#222123] hover:text-[#2F5D34] hover:bg-[#E7F0E4]'
        }`}
        title="हिन्दी में बदलें"
      >
        हिन्दी
      </button>
    </div>
  );
}
