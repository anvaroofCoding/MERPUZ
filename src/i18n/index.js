import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "uz", // default til
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  resources: {}, // boshida bo‘sh
});

export default i18n;
