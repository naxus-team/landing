import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Arabic } from "next/font/google";
import { Providers } from "./providers";
import { type Locale } from "@/lib/i18n";
import { Analytics } from "@vercel/analytics/next"

import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Naxus - Your Vision. Our Code.",
  description: "We design, build, and scale companies that redefine industries through efficiency, technology, and vision.",
  keywords: ["Naxus", "Software Development", "Tech Company", "Dubai", "Innovation", "Efficiency", "Scalability"],
  authors: [{ name: "Naxus Team", url: "https://naxus.dev" }],
  creator: "Naxus",
  openGraph: {
    title: "Naxus - Your Vision. Our Code.",
    description: "We design, build, and scale companies that redefine industries through efficiency, technology, and vision.",
    url: "https://naxus.dev",
    siteName: "Naxus",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Naxus OG Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naxus - Your Vision. Our Code.",
    description: "We design, build, and scale companies that redefine industries through efficiency, technology, and vision.",
    images: ["https://naxus.dev/og-image.png"],
  },
};

export const dynamicParams = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${notoSans.variable} ${notoSansArabic.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}