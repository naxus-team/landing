import { type getLocale } from "./i18n-context";

import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import de from "@/locales/de.json";
import fr from "@/locales/fr.json";
import es from "@/locales/es.json";
import it from "@/locales/it.json";

export const locales    = ["en", "ar", "de", "fr", "es", "it"] as const;
export const defaultLocale: getLocale = "en";

export const messages = { en, ar, de, fr, es, it } as const;

export type Messages = typeof en;