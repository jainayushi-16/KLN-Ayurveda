'use client';

import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector({ className = '', compact = false }) {
  const { locale, setLocale, isHindi } = useLanguage();

  return (
    <div className={`inline-flex items-center gap-1 text-xs font-semibold select-none ${className}`}>
      <Globe className="w-3.5 h-3.5 opacity-70" style={{ color: 'var(--primary, #2F5D34)' }} />
      <button
        type="button"
        onClick={() => setLocale('en-IN')}
        className={`px-2 py-1 rounded transition-colors ${
          !isHindi
            ? 'bg-[#2F5D34] text-white shadow-sm'
            : 'text-gray-700 hover:text-[#2F5D34] hover:bg-emerald-50'
        }`}
        title="Switch to English"
      >
        English
      </button>
      <span className="text-gray-300">|</span>
      <button
        type="button"
        onClick={() => setLocale('hi-IN')}
        className={`px-2 py-1 rounded transition-colors ${
          isHindi
            ? 'bg-[#2F5D34] text-white shadow-sm'
            : 'text-gray-700 hover:text-[#2F5D34] hover:bg-emerald-50'
        }`}
        title="हिन्दी में बदलें"
      >
        हिन्दी
      </button>
    </div>
  );
}
