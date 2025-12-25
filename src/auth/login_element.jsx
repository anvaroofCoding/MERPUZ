import { Moon, Settings, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsFloatingPanel() {
  /* PANEL OPEN */
  const [open, setOpen] = useState(false);

  /* 🌙 DARK MODE */
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* 🌍 LANGUAGE */
  const [langs, setLang] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("language") || "uz"
      : "uz",
  );

  useEffect(() => {
    localStorage.setItem("language", langs);
  }, [langs]);

  return (
    <>
      {/* 🔘 FLOATING ICON BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="
          fixed bottom-5 right-5 z-50
          h-12 w-12 rounded-full
          bg-primary text-primary-foreground
          flex items-center justify-center
          shadow-lg active:scale-95 transition
        "
      >
        <Settings className="h-6 w-6" />
      </button>

      {/* 🌫 BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* 📱 SLIDE PANEL */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-background shadow-xl
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="px-4 py-4 border-b text-sm font-semibold">
          Sozlamalar
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-6">
          {/* 🌙 DARK MODE ICON TOGGLE */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Tema</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDarkMode(false)}
                className={`h-10 w-10 rounded-full flex items-center justify-center
                  ${
                    !darkMode
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
              >
                <Sun className="h-5 w-5" />
              </button>

              <button
                onClick={() => setDarkMode(true)}
                className={`h-10 w-10 rounded-full flex items-center justify-center
                  ${
                    darkMode ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
              >
                <Moon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 🌍 LANGUAGE FLAGS */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Til</p>
            <div className="flex gap-3 text-xl">
              <button
                onClick={() => setLang("uz")}
                className={`h-10 w-10 rounded-full
                  ${langs === "uz" ? "bg-primary/20" : "bg-muted"}`}
              >
                🇺🇿
              </button>

              <button
                onClick={() => setLang("ru")}
                className={`h-10 w-10 rounded-full
                  ${langs === "ru" ? "bg-primary/20" : "bg-muted"}`}
              >
                🇷🇺
              </button>

              <button
                onClick={() => setLang("en")}
                className={`h-10 w-10 rounded-full
                  ${langs === "en" ? "bg-primary/20" : "bg-muted"}`}
              >
                🇺🇸
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
