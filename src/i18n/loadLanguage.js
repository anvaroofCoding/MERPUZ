import i18n from "./index";

export const loadLanguage = async (lang) => {
  // Agar til allaqachon yuklangan bo‘lsa, qayta yuklamaymiz
  if (!i18n.hasResourceBundle(lang, "translation")) {
    const translations = await import(`./locales/${lang}/translation.json`);
    i18n.addResourceBundle(
      lang,
      "translation",
      translations.default || translations
    );
  }
  i18n.changeLanguage(lang); // tilni o‘zgartirish
};
