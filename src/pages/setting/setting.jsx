import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sun,
  Moon,
  Languages,
  Loader2,
  Volume2,
  Bell,
  Lock,
  ListChecks,
  Text,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { loadLanguage } from "@/i18n/loadLanguage";
export default function SettingsPanel() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
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
  const [langs, setLang] = useState(() => localStorage.getItem("language"));
  useEffect(() => {
    const changeLang = async () => {
      await loadLanguage(langs);
    };
    localStorage.setItem("language", langs);
    changeLang();
  }, [langs]);
  const [loadingStyle, setLoadingStyle] = useState("spinner");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notiv, setNotiv] = useState(() => localStorage.getItem("notiv"));
  const [pass, setPass] = useState(true);
  useEffect(() => {
    localStorage.setItem("notiv", notiv);
  }, [notiv]);
  const fonts = [
    "roboto",
    "nunito",
    "Stack",
    "raleWay",
    "Quicksand",
    "Libre",
    "Delius",
    "Bitter",
    "playWrite",
  ];
  const handleChange = (value) => {
    if (!value) return;
    localStorage.setItem("font", value);
    window.location.reload();
  };
  const currentFont = localStorage.getItem("font") || "roboto";
  return (
    <div>
      <CardContent className="space-y-6 p-0">
        {/* DARK MODE */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium">
            {darkMode ? <Moon size={16} /> : <Sun size={16} />}
            {t("1_20251120")}
          </span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>

        <Separator />

        {/* LANGUAGE */}
        <div className="flex flex-row justify-between items-center space-y-1">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Languages size={16} /> {t("2_20251120")}
          </span>
          <Select value={langs} onValueChange={setLang}>
            <SelectTrigger>
              <SelectValue placeholder="Tilni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uz">{t("9_20251120")}</SelectItem>
              <SelectItem value="ru">{t("10_20251120")}</SelectItem>
              <SelectItem value="en">{t("11_20251120")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* LOADING STYLE */}
        <div className="flex flex-row justify-between items-center space-y-1">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Loader2 size={16} /> {t("3_20251120")}
          </span>
          <Select value={loadingStyle} onValueChange={setLoadingStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Select loading style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spinner">{t("13_20251120")}</SelectItem>
              <SelectItem value="dots">{t("14_20251120")}</SelectItem>
              <SelectItem value="skeleton">{t("12_20251120")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* SOUND */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Volume2 size={16} />
            {t("4_20251120")}
          </span>
          <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
        </div>

        <Separator />

        {/* NOTIFICATIONS */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Bell size={16} /> {t("5_20251120")}
          </span>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>

        <Separator />

        {/* PASSWORD */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Lock size={16} /> {t("6_20251120")}
          </span>
          <Switch checked={pass} onCheckedChange={setPass} />
        </div>

        <Separator />

        {/* BILDIRNOMA TURINI */}
        <div className="flex flex-row justify-between items-center space-y-1">
          <span className="flex items-center gap-2 text-sm font-medium">
            <ListChecks size={16} /> {t("7_20251120")}
          </span>
          <Select value={notiv} onValueChange={setNotiv}>
            <SelectTrigger>
              <SelectValue placeholder="Bildirnomani tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rangli">Rangli</SelectItem>
              <SelectItem value="rangsiz">Rangsiz</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator />

        {/* SHRIFT */}
        <div className="flex flex-row justify-between items-center">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Text size={16} /> Shrift tanlang
          </span>

          <Select value={currentFont} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Shrift tanlang" />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((f) => (
                <SelectItem key={f} value={f}>
                  {f === "roboto" ? "Roboto (Default)" : f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </div>
  );
}
