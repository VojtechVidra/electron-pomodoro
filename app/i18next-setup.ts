import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enTranslations } from './translations/en';

i18n.use(initReactI18next).init({
  resources: {
    en: enTranslations
  },
  lng: 'en',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false
  }
});

export { i18n };
