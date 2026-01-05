import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  const [notive, setNotive] = useState("rangsiz");

  useEffect(() => {
    const value = localStorage.getItem("notiv") || "rangsiz";
    setNotive(value);
  }, []);

  const isColored = notive === "rangli";

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  /** -------------------------------
   *   iPhone blur style (light/dark)
   * ------------------------------- */

  const iosStyle = isDark
    ? {
        // DARK MODE → light-translucent
        "--normal-bg": "rgba(0, 0, 0, 0.39)",
        "--normal-border": "rgba(190, 177, 177, 0.19)",
        "--normal-text": "rgba(255, 255, 255, 0.95)",
        "--border-radius": "18px",
        "backdropFilter": "blur(20px) saturate(180%)",
        "WebkitBackdropFilter": "blur(16px) saturate(180%)",
      }
    : {
        // LIGHT MODE → dark-translucent
        "--normal-bg": "rgba(0, 0, 0, 0.67)",
        "--normal-border": "rgba(0, 0, 0, 0.64)",
        "--normal-text": "rgba(255, 255, 255, 0.95)",
        "--border-radius": "18px",
        "backdropFilter": "blur(16px) saturate(180%)",
        "WebkitBackdropFilter": "blur(16px) saturate(180%)",
      };

  /** Default style */
  const defaultStyle = {
    "--normal-bg": "var(--popover)",
    "--normal-text": "var(--popover-foreground)",
    "--normal-border": "var(--border)",
    "--border-radius": "var(--radius)",
  };

  /** Colored Icons */
  const coloredIcons = {
    success: (
      <CircleCheckIcon className="size-4 text-green-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
    ),
    info: (
      <InfoIcon className="size-4 text-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
    ),
    warning: (
      <TriangleAlertIcon className="size-4 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]" />
    ),
    error: (
      <OctagonXIcon className="size-4 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
    ),
    loading: <Loader2Icon className="size-4 animate-spin" />,
  };

  /** Default Icons */
  const normalIcons = {
    success: <CircleCheckIcon className="size-4" />,
    info: <InfoIcon className="size-4" />,
    warning: <TriangleAlertIcon className="size-4" />,
    error: <OctagonXIcon className="size-4" />,
    loading: <Loader2Icon className="size-4 animate-spin" />,
  };

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={isColored ? coloredIcons : normalIcons}
      style={isColored ? iosStyle : defaultStyle}
      {...props}
    />
  );
};

export { Toaster };
