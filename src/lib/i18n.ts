import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/locales/en.json';
import fr from '@/locales/fr.json';
import af from '@/locales/af.json';
import sw from '@/locales/sw.json';
import zu from '@/locales/zu.json';
import yo from '@/locales/yo.json';

// All user-facing text lives in src/locales/<language>.json.
// English is the source of truth: add new keys to en.json and fr.json together,
// then run `npm run i18n:check` (also runs before every build).
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      af: { translation: af },
      sw: { translation: sw },
      zu: { translation: zu },
      yo: { translation: yo },
    },
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true, // "fr-FR" browser setting -> "fr"
    load: 'languageOnly',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

const syncHtmlLang = (lng: string) => {
  document.documentElement.lang = lng.split('-')[0];
};
syncHtmlLang(i18n.resolvedLanguage ?? 'en');
i18n.on('languageChanged', syncHtmlLang);

export default i18n;
