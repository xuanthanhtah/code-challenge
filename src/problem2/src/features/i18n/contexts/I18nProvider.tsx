import { useEffect, useState, type ReactNode } from 'react';
import { I18nContext } from './I18nContext';
import { en } from '../locales/en';
import { vi } from '../locales/vi';
import type { Locale } from '../types/i18n.types';

const I18N_STORAGE_KEY = 'fancyswap_locale';

const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem(I18N_STORAGE_KEY);
  if (saved === 'en' || saved === 'vi') return saved;
  const navLang = navigator.language?.toLowerCase() ?? '';
  return navLang.startsWith('vi') ? 'vi' : 'en';
};

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    localStorage.setItem(I18N_STORAGE_KEY, locale);
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  const toggleLocale = () => {
    setLocale((prev) => (prev === 'en' ? 'vi' : 'en'));
  };

  const t = locale === 'vi' ? vi : en;

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};
