"use client";

import {
  createContext, useContext, useState,
  useEffect, ReactNode,
} from "react";
import { THEMES, type ThemeColor } from "./theme";
import { useTheme } from "next-themes";

type ThemeColorContextType = {
  color:    ThemeColor;
  setColor: (c: ThemeColor) => void;
};

const ThemeColorContext = createContext<ThemeColorContextType>({
  color:    "neutral",
  setColor: () => {},
});

function applyTheme(color: ThemeColor, mode: string) {
  const theme   = THEMES[color];
  const vars    = mode === "dark" ? theme.dark : theme.light;
  const root    = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme }             = useTheme();
  const [color, setColorState]        = useState<ThemeColor>("neutral");
  const [mounted, setMounted]         = useState(false);

  const setColor = (c: ThemeColor) => {
    setColorState(c);
    localStorage.setItem("naxus-theme-color", c);
    applyTheme(c, resolvedTheme ?? "light");
  };

  useEffect(() => {
    const saved = localStorage.getItem("naxus-theme-color") as ThemeColor | null;
    const valid: ThemeColor[] = ["neutral","warm","yellow","blue","green","rose"];
    const initial = valid.includes(saved as ThemeColor) ? (saved as ThemeColor) : "neutral";
    setColorState(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) applyTheme(color, resolvedTheme ?? "light");
  }, [resolvedTheme, color, mounted]);

  return (
    <ThemeColorContext.Provider value={{ color, setColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export const useThemeColor = () => useContext(ThemeColorContext);