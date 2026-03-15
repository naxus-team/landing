# Naxus — Landing Page

Corporate landing page for Naxus, a technology development and holding company based in Dubai, UAE.

---

## Overview

A production-grade static landing page built with Next.js, featuring full internationalization support across six languages, dark/light theme switching, and a responsive layout optimized for all screen sizes.

---

## Technology Stack

| Category        | Technology                        |
|-----------------|-----------------------------------|
| Framework       | Next.js 15 (App Router)           |
| Language        | TypeScript                        |
| Styling         | Tailwind CSS v4                   |
| Components      | shadcn/ui                         |
| Animation       | Framer Motion                     |
| Icons           | Lucide React                      |
| Fonts           | Noto Sans / Noto Sans Arabic      |
| Output          | Static Export                     |

---

## Features

- Static export — deployable on any CDN or static host
- Internationalization — English, Arabic, German, French, Spanish, Italian
- RTL support — full right-to-left layout for Arabic
- Theme system — Light, Dark, and System modes with animated toggle
- Auto locale detection — detects browser language on first visit
- Responsive — optimized for mobile, tablet, and desktop
- Floating navbar — fixed pill-style navbar with scroll gradient
- Sections — Hero, Services, Work, About, Team, Contact, Footer

---

## Project Structure
```
naxus-landing/
├── app/
│   ├── layout.tsx            # Root layout with fonts and providers
│   ├── page.tsx              # Main page composition
│   ├── globals.css           # Global styles and theme variables
│   └── providers.tsx         # Theme and i18n providers
├── components/
│   ├── common/               # Shared components
│   │   ├── Navbar.tsx
│   │   ├── Logo.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── LangDialog.tsx
│   │   ├── AuthMenu.tsx
│   │   └── DynamicTitle.tsx
│   ├── sections/             # Page sections
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Work.tsx
│   │   ├── About.tsx
│   │   ├── Team.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── i18n.ts               # Translations and locale definitions
│   ├── i18n-context.tsx      # i18n React context and provider
│   └── utils.ts              # Utility functions
├── types/
│   └── index.ts              # Shared TypeScript types
├── public/                   # Static assets
├── next.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation
```bash
git clone https://github.com/naxus-team/landing.git
cd landing
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build
```bash
npm run build
```

The static output will be generated in the `out/` directory.

---

## Internationalization

The project uses a custom i18n solution compatible with static export.

Supported locales:

| Code | Language | Direction |
|------|----------|-----------|
| `en` | English  | LTR       |
| `ar` | Arabic   | RTL       |
| `de` | German   | LTR       |
| `fr` | French   | LTR       |
| `es` | Spanish  | LTR       |
| `it` | Italian  | LTR       |

Locale is auto-detected from the browser on first visit. Users can override the detected locale manually via the language selector. Manual selections are persisted in `localStorage`.

---

## Theme

Three theme modes are available: Light, Dark, and System. The active theme is persisted across sessions via `next-themes`. Theme switching is instant with no transition delay.

---

## Deployment

The project outputs a fully static site via `next.config.ts`:
```ts
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};
```

Compatible with Vercel, Netlify, Cloudflare Pages, or any static hosting provider.

### Deploy to Vercel
```bash
npx vercel
```

### Deploy to Netlify
```bash
npx netlify deploy --dir=out
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is proprietary. All rights reserved by Naxus.

---

## Contact

- Website: [naxus.dev](https://naxus.dev)
- LinkedIn: [linkedin.com/company/naxus](https://linkedin.com/company/naxus)
- Email: hello@naxus.dev