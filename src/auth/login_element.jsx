import { Loader2, Moon, Settings, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsFloatingPanel() {
  const [open, setOpen] = useState(false);
  const [isChangingTheme, setIsChangingTheme] = useState(false); // Loading holati

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  // 🌙 Tema o'zgartirish funksiyasi (Loading bilan)
  const toggleTheme = (isDark) => {
    if (isDark === darkMode) return;

    setIsChangingTheme(true); // Loadingni yoqish

    // Brauzerga render qilish uchun ozgina vaqt beramiz (Macro-task)
    setTimeout(() => {
      setDarkMode(isDark);

      // Temani qo'llash biroz vaqt olishi mumkin, shuning uchun
      // loadingni darhol o'chirmaymiz
      setTimeout(() => {
        setIsChangingTheme(false);
      }, 400); // 400ms silliq o'tish uchun yetarli
    }, 50);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      {/* 🌀 FULL SCREEN LOADING OVERLAY */}
      {isChangingTheme && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium animate-pulse">
            Tema yangilanmoqda...
          </p>
        </div>
      )}

      {/* 🔘 FLOATING BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
      >
        <Settings className="h-7 w-7" />
      </button>

      {/* 🌫 BACKDROP */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* 📱 SLIDE PANEL */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-background shadow-2xl transform transition-transform duration-300 ease-out will-change-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <span className="font-bold">Sozlamalar</span>
          <button onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* TEMA SELECTION */}
          <section>
            <label className="text-sm font-medium text-muted-foreground block mb-3">
              Interfeys rejimi
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
              <button
                onClick={() => toggleTheme(false)}
                className={`flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
                  !darkMode
                    ? "bg-background shadow text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Sun className="h-4 w-4" />{" "}
                <span className="text-sm font-medium">Yorug'</span>
              </button>
              <button
                onClick={() => toggleTheme(true)}
                className={`flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
                  darkMode
                    ? "bg-background shadow text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Moon className="h-4 w-4" />{" "}
                <span className="text-sm font-medium">Tungi</span>
              </button>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
