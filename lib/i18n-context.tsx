"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Locale, messages, defaultLocale } from "./i18n";

type Messages = {
  nav: {
    services: string;
    work: string;
    about: string;
    contact: string;
    team: string;
  };
  hero: {
    badge: string;
    line1: string;
    line2: string;
    description: string;
    cta_primary: string;
    cta_secondary: string;
    cta_start: string;
    stats: {
      projects: string;
      industries: string;
      founded: string;
      hq: string;
    };
  };
  services: {
    label: string;
    title: string;
    sub: string;
    cta: string;
    items: readonly {
      number: string;
      title: string;
      description: string;
      tags: readonly string[];
    }[];
  };
  work: {
    label: string;
    title: string;
    sub: string;
    filters: readonly string[];
    showing: string;
    of: string;
    projects: string;
    cta: string;
    status: {
      live: string;
      inProgress: string;
      completed: string;
    };
  };
  about: {
    label: string;
    title: string;
    p1: string;
    p2: string;
    cta_primary: string;
    cta_secondary: string;
    values: readonly { title: string; desc: string }[];
    stats: readonly { value: string; label: string }[];
  };
  team: {
    label: string;
    title: string;
  };
  contact: {
    label: string;
    title: string;
    sub: string;
    available: string;
    info: {
      email: string;
      location: string;
      linkedin: string;
    };
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      subject: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      subjects: readonly string[];
    };
    success: {
      title: string;
      sub: string;
      again: string;
    };
  };
  auth: {
    getStarted: string;
    headline: string;
    sub: string;
    login: string;
    loginSub: string;
    join: string;
    joinSub: string;
    tagline: string;
  };
  footer: {
    tagline: string;
    available: string;
    company: string;
    legal: string;
    links: {
      about: string;
      services: string;
      work: string;
      contact: string;
      privacy: string;
      terms: string;
    };
    copyright: string;
    motto: string;
  };
};

type I18nContextType = {
  locale:    Locale;
  t:         Messages;
  setLocale: (l: Locale) => void;
  isRTL:     boolean;
};

// ── Constants ──────────────────────────────────────────
const VALID_LOCALES: Locale[] = ["en", "ar", "de", "fr", "es", "it"];

const LOCALE_MAP: Record<string, Locale> = {
  "en": "en", "en-US": "en", "en-GB": "en", "en-AU": "en",
  "ar": "ar", "ar-SA": "ar", "ar-AE": "ar", "ar-EG": "ar",
  "ar-IQ": "ar", "ar-JO": "ar", "ar-KW": "ar", "ar-LB": "ar",
  "ar-MA": "ar", "ar-QA": "ar", "ar-SY": "ar",
  "de": "de", "de-DE": "de", "de-AT": "de", "de-CH": "de",
  "fr": "fr", "fr-FR": "fr", "fr-BE": "fr", "fr-CA": "fr",
  "fr-CH": "fr", "fr-MA": "fr",
  "es": "es", "es-ES": "es", "es-MX": "es", "es-AR": "es",
  "es-CO": "es", "es-CL": "es", "es-PE": "es",
  "it": "it", "it-IT": "it", "it-CH": "it",
};

// ── Helpers ────────────────────────────────────────────
function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const lang of langs) {
    if (LOCALE_MAP[lang])              return LOCALE_MAP[lang];
    const base = lang.split("-")[0];
    if (LOCALE_MAP[base])              return LOCALE_MAP[base];
  }
  return defaultLocale;
}

function applyLocaleToDOM(l: Locale) {
  const isRTL = l === "ar";
  document.documentElement.lang = l;
  document.documentElement.dir  = isRTL ? "rtl" : "ltr";
  document.body.dir              = isRTL ? "rtl" : "ltr";
}

// ── Context ────────────────────────────────────────────
const I18nContext = createContext<I18nContextType>({
  locale:    defaultLocale,
  t:         messages[defaultLocale] as Messages,
  setLocale: () => {},
  isRTL:     false,
});

// ── Provider ───────────────────────────────────────────
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale,  setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted]     = useState(false);

  // ✅ يُحفظ اختيار المستخدم ويُميّزه عن الـ auto
  const setLocale = (l: Locale) => {
    setLocaleState(l);
    applyLocaleToDOM(l);
    localStorage.setItem("naxus-locale",        l);
    localStorage.setItem("naxus-locale-source", "manual");
  };

  useEffect(() => {
    const saved  = localStorage.getItem("naxus-locale")        as Locale | null;
    const source = localStorage.getItem("naxus-locale-source");

    let initial: Locale;

    if (source === "manual" && saved && VALID_LOCALES.includes(saved)) {
      // ✅ المستخدم اختار يدوياً — احترم اختياره
      initial = saved;
    } else {
      // ✅ Auto-detect من البراوزر
      initial = detectBrowserLocale();
      localStorage.setItem("naxus-locale",        initial);
      localStorage.setItem("naxus-locale-source", "auto");
    }

    setLocaleState(initial);
    applyLocaleToDOM(initial);
    setMounted(true);
  }, []);

  return (
    <I18nContext.Provider
      value={{
        locale:  mounted ? locale : defaultLocale,
        t:       messages[mounted ? locale : defaultLocale] as Messages,
        setLocale,
        isRTL:   mounted ? locale === "ar" : false,
      }}
    >
      {mounted
        ? children
        : <div suppressHydrationWarning>{children}</div>
      }
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);