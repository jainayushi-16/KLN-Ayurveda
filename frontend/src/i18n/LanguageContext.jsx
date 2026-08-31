'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enIN from './locales/en-IN.json';
import hiIN from './locales/hi-IN.json';

const dictionaries = {
  'en-IN': enIN,
  'hi-IN': hiIN,
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState('en-IN');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedLang = localStorage.getItem('kln_language');
        if (storedLang && (storedLang === 'hi-IN' || storedLang === 'en-IN')) {
          setLocaleState(storedLang);
          document.documentElement.lang = storedLang;
          return;
        }

        const cookieMatch = document.cookie.match(/NEXT_LOCALE=(en-IN|hi-IN)/);
        if (cookieMatch && cookieMatch[1]) {
          setLocaleState(cookieMatch[1]);
          document.documentElement.lang = cookieMatch[1];
          return;
        }
      } catch (e) {}
    }
  }, []);

  const setLocale = (newLocale) => {
    if (newLocale !== 'en-IN' && newLocale !== 'hi-IN') return;
    setLocaleState(newLocale);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kln_language', newLocale);
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = newLocale;
      } catch (e) {}
    }
  };

  const t = (keyPath, params = {}, fallbackText = null) => {
    if (!keyPath) return fallbackText || '';
    const keys = keyPath.split('.');
    
    let currentDict = dictionaries[locale] || dictionaries['en-IN'];
    let val = currentDict;

    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        val = undefined;
        break;
      }
    }

    if (val === undefined) {
      // Fallback to English dictionary
      val = dictionaries['en-IN'];
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = val[k];
        } else {
          val = undefined;
          break;
        }
      }
    }

    if (val === undefined || typeof val !== 'string') {
      return fallbackText || keyPath;
    }

    if (params && typeof params === 'object') {
      Object.keys(params).forEach((paramKey) => {
        val = val.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
      });
    }

    return val;
  };

  const isHindi = locale === 'hi-IN';

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isHindi }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      locale: 'en-IN',
      setLocale: () => {},
      t: (k, p, fb) => fb || k,
      isHindi: false,
    };
  }
  return context;
}
