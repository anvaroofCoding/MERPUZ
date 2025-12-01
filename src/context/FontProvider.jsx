import { createContext, useContext, useLayoutEffect } from "react";

const FontContext = createContext();

export const FontProvider = ({ children }) => {
  // Fontni localStorage orqali darhol o‘rnatish
  const setFont = (font) => {
    if (!font) return;

    // localStorage-ga saqlash
    localStorage.setItem("font", font);

    // faqat yangi font class qo‘shish
    document.documentElement.classList.add(font);
  };

  useLayoutEffect(() => {
    // Refreshdan keyin localStorage-dan olamiz
    const font = localStorage.getItem("font") || "roboto";
    setFont(font);
  }, []);

  return (
    <FontContext.Provider value={{ setFont }}>{children}</FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) throw new Error("useFont must be used within FontProvider");
  return context;
};
