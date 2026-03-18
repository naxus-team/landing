"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { messages, defaultLocale } from "./i18n";
export type getLocale = "en" | "ar" | "de" | "fr" | "es" | "it";

type Messages = {
  nav: {
    services: string;
    work: string;
    about: string;
    contact: string;
    team: string;
    analytics: string;
    content: string;
    clients: string;
    settings: string;
    overview: string;
    dashboard: string;
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
    getStarted: string; headline: string; sub: string;
    login: string; loginSub: string; join: string; joinSub: string; tagline: string;
    pageTitle: string; pageSubtitle: string;
    registerTitle: string; registerSubtitle: string;
    name: string; namePlaceholder: string;
    email: string; emailPlaceholder: string;
    password: string; passwordPlaceholder: string;
    forgotPassword: string; signIn: string; createAccount: string;
    noAccount: string; hasAccount: string; createOne: string; signInLink: string;
    orContinueWith: string; terms: string; privacy: string;
    termsText: string; and: string;
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
  locale: getLocale;
  t: Messages;
  setLocale: (l: getLocale) => void;
  isRTL: boolean;
};

// ── Constants ──────────────────────────────────────────
const VALID_LOCALES: getLocale[] = ["en", "ar", "de", "fr", "es", "it"];

const LOCALE_MAP: Record<string, getLocale> = {
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
function detectBrowserLocale(): getLocale {
  if (typeof window === "undefined") return defaultLocale;
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const lang of langs) {
    if (LOCALE_MAP[lang]) return LOCALE_MAP[lang];
    const base = lang.split("-")[0];
    if (LOCALE_MAP[base]) return LOCALE_MAP[base];
  }
  return defaultLocale;
}

function applyLocaleToDOM(l: getLocale) {
  const isRTL = l === "ar";
  document.documentElement.lang = l;
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  document.body.dir = isRTL ? "rtl" : "ltr";
}

// ── Context ────────────────────────────────────────────
const I18nContext = createContext<I18nContextType>({
  locale: defaultLocale,
  t: messages[defaultLocale] as Messages,
  setLocale: () => { },
  isRTL: false,
});

// ── Provider ───────────────────────────────────────────
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<getLocale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  const setLocale = (l: getLocale) => {
    setLocaleState(l);
    applyLocaleToDOM(l);
    localStorage.setItem("naxus-locale", l);
    localStorage.setItem("naxus-locale-source", "manual");
  };

  useEffect(() => {
    const saved = localStorage.getItem("naxus-locale") as getLocale | null;
    const source = localStorage.getItem("naxus-locale-source");

    let initial: getLocale;

    if (source === "manual" && saved && VALID_LOCALES.includes(saved)) {
      initial = saved;
    } else {
      initial = detectBrowserLocale();
      localStorage.setItem("naxus-locale", initial);
      localStorage.setItem("naxus-locale-source", "auto");
    }

    setLocaleState(initial);
    applyLocaleToDOM(initial);
    setMounted(true);
  }, []);

  return (
    <I18nContext.Provider
      value={{
        locale: mounted ? locale : defaultLocale,
        t: messages[mounted ? locale : defaultLocale] as Messages,
        setLocale,
        isRTL: mounted ? locale === "ar" : false,
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