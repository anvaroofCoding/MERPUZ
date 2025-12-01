import { createContext, useContext, useEffect, useState } from "react";
import { loadLanguage } from "@/i18n/loadLanguage";

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("language") || "uz");

  useEffect(() => {
    localStorage.setItem("language", lang);
    loadLanguage(lang);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
