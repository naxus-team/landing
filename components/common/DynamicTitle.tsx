"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n-context";
import { type Locale } from "@/lib/i18n";

type TitleEntry = {
  title:       string;
  description: string;
};

const META: Record<Locale, TitleEntry> = {
  en: {
    title:       "Naxus — Your Vision. Our Reality.",
    description: "We design, build, and scale companies that redefine industries through efficiency, technology, and vision.",
  },
  ar: {
    title:       "Naxus — رؤيتك. واقعنا.",
    description: "نصمم ونبني ونطور شركات تعيد تعريف الصناعات من خلال الكفاءة والتقنية والرؤية.",
  },
  de: {
    title:       "Naxus — Deine Vision. Unsere Realität.",
    description: "Wir entwerfen, entwickeln und skalieren Unternehmen, die Branchen durch Effizienz, Technologie und Vision neu definieren.",
  },
  fr: {
    title:       "Naxus — Votre Vision. Notre Réalité.",
    description: "Nous concevons, construisons et développons des entreprises qui redéfinissent les secteurs grâce à l'efficacité, la technologie et la vision.",
  },
  es: {
    title:       "Naxus — Tu Visión. Nuestra Realidad.",
    description: "Diseñamos, construimos y escalamos empresas que redefinen industrias a través de la eficiencia, la tecnología y la visión.",
  },
  it: {
    title:       "Naxus — La Tua Visione. La Nostra Realtà.",
    description: "Progettiamo, costruiamo e scaliamo aziende che ridefiniscono i settori attraverso efficienza, tecnologia e visione.",
  },
};

export default function DynamicTitle() {
  const { locale } = useI18n();

  useEffect(() => {
    const entry = META[locale] ?? META.en;

    // Title
    document.title = entry.title;

    // Description
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", entry.description);

    // OG tags
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", entry.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", entry.description);

    // Twitter tags
    document
      .querySelector('meta[name="twitter:title"]')
      ?.setAttribute("content", entry.title);
    document
      .querySelector('meta[name="twitter:description"]')
      ?.setAttribute("content", entry.description);

  }, [locale]);

  return null;
}