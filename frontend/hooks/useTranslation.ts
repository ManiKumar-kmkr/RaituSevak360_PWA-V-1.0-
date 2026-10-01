"use client";

import { useAuthStore } from '../store/auth-store';
import { getTranslation } from '../lib/i18n';

export function useTranslation() {
  const language = useAuthStore((state) => state.selectedLanguage) || 'en';
  const setLanguage = useAuthStore((state) => state.setLanguage);

  const t = (key: string, params?: Record<string, string | number>): string => {
    return getTranslation(language, key, params);
  };

  return {
    t,
    language,
    setLanguage,
  };
}

export default useTranslation;
