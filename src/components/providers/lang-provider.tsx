'use client';
import { createContext, useContext, useState } from 'react';
import { useT, type I18nKey } from '@/data/transit';
import type { Lang } from '@/types/transit';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: I18nKey) => string;
}

const LangContext = createContext<LangContextValue>({ lang: 'es', setLang: () => {}, t: (k) => k });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'es';
    const saved = localStorage.getItem('lang') as Lang | null;
    return saved === 'es' || saved === 'en' ? saved : 'es';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  const t = useT(lang);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
