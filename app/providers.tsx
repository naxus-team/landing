"use client";

import { ThemeProvider }      from "next-themes";
import { I18nProvider }       from "@/lib/i18n-context";
import { ThemeColorProvider } from "@/lib/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <I18nProvider>
        <ThemeColorProvider>
          {children}
        </ThemeColorProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}