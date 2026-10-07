import { useCallback } from 'react';
import { useAuthStore } from '../store/auth-store';
import { getTranslation } from '../lib/i18n';

export function useTranslation() {
  const language = useAuthStore((state) => state.selectedLanguage) || 'en';
  const setLanguage = useAuthStore((state) => state.setLanguage);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      return getTranslation(language, key, params);
    },
    [language]
  );

  return {
    t,
    language,
    setLanguage,
  };
}

export default useTranslation;
