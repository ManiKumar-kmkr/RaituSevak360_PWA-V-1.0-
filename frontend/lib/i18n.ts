import en from '../locales/en.json';
import te from '../locales/te.json';
import hi from '../locales/hi.json';

export type SupportedLanguage = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'mr' | 'bn' | 'gu';

// Dictionaries map; regional fallbacks to English or Hindi as base
const dictionaries: Record<string, Record<string, any>> = {
  en,
  te,
  hi,
  ta: en,
  kn: en,
  mr: hi,
  bn: en,
  gu: hi,
};

export function getTranslation(
  lang: string,
  key: string,
  params?: Record<string, string | number>
): string {
  const selectedDict = dictionaries[lang] || dictionaries.en;
  const fallbackDict = dictionaries.en;

  const resolveKey = (dict: Record<string, any>, path: string): any => {
    return path.split('.').reduce((obj, segment) => (obj ? obj[segment] : undefined), dict);
  };

  let value = resolveKey(selectedDict, key);
  if (value === undefined) {
    value = resolveKey(fallbackDict, key);
  }

  if (typeof value !== 'string') {
    if (value && typeof value === 'object' && typeof value.title === 'string') {
      value = value.title;
    } else {
      return key;
    }
  }

  if (params) {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramVal));
    });
  }

  return value;
}

export default getTranslation;
