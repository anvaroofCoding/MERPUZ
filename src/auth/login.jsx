import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { LoginsNewForm } from "./login.form";
import SettingsPage from "./login_element";

export default function Login() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* 🔷 HeroGeometric BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <HeroGeometric />
      </div>

      {/* ⚙️ Settings */}
      <div className="absolute z-100 bottom-4 left-4 text-sm text-muted-foreground">
        <SettingsPage />
      </div>

      {/* 🔐 Login form */}
      <div className="relative z-20 flex h-full w-full items-center justify-center">
        <LoginsNewForm />
      </div>
    </div>
  );
}
