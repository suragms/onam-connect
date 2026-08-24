# ONAMCONNECT — AI-Powered Onam Wishes & Greeting Cards

> **A premium, mobile-first web application for creating personalized Onam wishes, greeting cards, and social captions using AI. Built with modern React, TypeScript, and Tailwind CSS.**

---

## 📖 Project Overview

**ONAMCONNECT** is a comprehensive Onam celebration platform that lets users:

- **Generate personalized Onam wishes** using Google Gemini AI in Malayalam, English, or Manglish
- **Create beautiful greeting cards** with 10 curated templates and 5 format presets (square, story, post, card, banner)
- **Generate social media captions** optimized for Instagram, X, LinkedIn, Facebook, WhatsApp, and more
- **Improve existing messages** with AI-powered refinements (tone, length, emoji level, formatting)
- **Browse 20+ curated templates** organized by category, language, and occasion
- **Save & manage wishes locally** — no account required, data stays on device
- **Share instantly** via native sharing, WhatsApp, Telegram, X, Facebook, Signal, Arattai, or copy to clipboard

### Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Generator** | Multi-parameter wish generation (recipient, language, tone, style, occasion, purpose, length, emoji level) |
| 🎨 **Card Studio** | Real-time preview, customizable templates, downloadable PNG export |
| 📱 **Social Captions** | Platform-optimized captions with hashtags, character count for X |
| ✨ **Message Improver** | Paste any wish → AI refines it (make it warmer, shorter, funnier, formal, etc.) |
| 📚 **Template Catalog** | 20+ ready-to-use greetings, searchable & filterable by category/language |
| 💾 **Local Storage** | Recent wishes & favorites saved in IndexedDB — private, no login |
| 🌙 **Dark Mode** | System-aware with manual toggle, persisted in localStorage |
| ♿ **Accessibility** | Reduced motion support, proper ARIA, 44px+ touch targets, semantic HTML |

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19, TypeScript, Vite 7 |
| **Routing** | React Router v7 (data-mode ready) |
| **Styling** | Tailwind CSS v4 (OKLCH color space), CSS Variables |
| **UI Primitives** | Radix UI (headless, accessible components) |
| **Animations** | Framer Motion (enter/exit, scroll-triggered, micro-interactions) |
| **Backend/DB** | Convex (real-time database, serverless functions) |
| **Authentication** | Convex Auth (email OTP, anonymous sessions) |
| **AI** | Google Gemini (via Convex actions) |
| **Icons** | Lucide React |
| **Toasts** | Sonner |
| **Forms** | React Hook Form + Zod validation |
| **Image Export** | @zumer/snapdom (DOM → Canvas → PNG) |
| **Package Manager** | Bun |

---

## 📁 Project Structure

```
onam-connect/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Radix-based primitives (Button, Input, Dialog, etc.)
│   │   ├── Navbar.tsx       # Top navigation (desktop)
│   │   ├── MobileBottomNav.tsx # Fixed bottom nav (mobile ≤767px)
│   │   ├── Footer.tsx       # Site footer
│   │   ├── Hero.tsx         # Landing hero section
│   │   ├── GeneratorForm.tsx # Multi-field AI wish generator
│   │   ├── MessageResult.tsx # Generated wish display with actions
│   │   ├── CardStudio.tsx   # Greeting card designer
│   │   ├── BusinessMode.tsx # Business greeting generator
│   │   ├── SocialCaptionGenerator.tsx # Social caption generator
│   │   ├── MessageImprover.tsx # AI message refiner
│   │   ├── MessageTemplates.tsx # Template catalog
│   │   ├── Features.tsx     # Feature grid
│   │   ├── HowItWorks.tsx   # 3-step process
│   │   ├── FAQ.tsx          # Accordion FAQ
│   │   ├── ShareButtons.tsx # Full share panel
│   │   ├── ShareIconRow.tsx # Compact share icons
│   │   ├── QuickPresets.tsx # One-tap preset configs
│   │   └── LoadingSteps.tsx # Animated loading messages
│   │
│   ├── pages/               # Route-level pages
│   │   ├── Landing.tsx      # Home page (hero + templates + features + FAQ)
│   │   ├── Generator.tsx    # AI wish generator page
│   │   ├── CardStudio.tsx   # Card designer page
│   │   ├── HistoryPage.tsx  # Recent wishes (with search/filter)
│   │   ├── SavedPage.tsx    # Favorites + recent (tabs)
│   │   ├── TemplatesPage.tsx # Template catalog page
│   │   ├── ImprovePage.tsx  # Message improver page
│   │   ├── SocialCaptionsPage.tsx # Social captions page
│   │   ├── BusinessPage.tsx # Business wishes page
│   │   ├── AboutPage.tsx    # About ONAMCONNECT
│   │   ├── SettingsPage.tsx # Appearance, notifications, data, privacy
│   │   ├── SeoPage.tsx      # SEO landing pages (7 variants)
│   │   └── NotFound.tsx     # 404 page
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── use-auth.tsx     # Convex auth integration
│   │   └── use-ai-actions.ts # AI generation actions
│   │
│   ├── lib/                 # Utilities & configuration
│   │   ├── generatorOptions.ts # All select options (recipients, languages, tones, etc.)
│   │   ├── templates.ts     # 20+ curated template messages
│   │   ├── sharing.ts       # Native & platform sharing helpers
│   │   ├── storage.ts       # IndexedDB wrapper (idb)
│   │   ├── validation.ts    # Zod schemas
│   │   ├── scrollToSection.ts # Smooth scroll utility
│   │   └── clientId.ts      # Anonymous client ID generation
│   │
│   ├── types/               # TypeScript types
│   │   └── generator.ts     # GeneratorConfig, GeneratedMessage
│   │
│   ├── convex/              # Convex backend
│   │   ├── schema.ts        # Database schema
│   │   ├── auth.ts          # Auth configuration
│   │   ├── auth.config.ts   # Auth providers
│   │   ├── users.ts         # User queries/mutations
│   │   └── ai/              # AI actions (Gemini integration)
│   │
│   ├── index.css            # Global styles, Tailwind v4 theme, animations
│   ├── main.tsx             # App entry, providers, routing
│   └── App.tsx              # Root component (minimal)
│
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts       # (minimal, theme in index.css)
└── bun.lockb
```

---

## 🚀 Getting Started

### Prerequisites

- **Bun** ≥ 1.0 (recommended) or Node.js ≥ 20
- **Convex account** for backend (free tier works)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd onam-connect

# Install dependencies
bun install

# Set up Convex (first time only)
bunx convex dev

# Start development server
bun run dev
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Convex (provided by `convex dev` or dashboard)
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Optional: Gemini API key (if not set in Convex dashboard)
GEMINI_API_KEY=your-gemini-api-key
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Vite dev server (port 5173) |
| `bun run build` | Type-check + production build to `dist/` |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint |
| `bunx convex dev` | Start Convex local backend |
| `bunx convex deploy` | Deploy Convex functions to production |

---

## 🎨 Design System & Theming

### Color Palette (OKLCH)

Defined in `src/index.css` as CSS custom properties:

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--primary` | `oklch(0.55 0.18 145)` | `oklch(0.72 0.16 145)` | Brand green, CTAs, active states |
| `--accent` | `oklch(0.82 0.14 85)` | `oklch(0.82 0.14 85)` | Gold accents, highlights |
| `--background` | `oklch(0.99 0.005 85)` | `oklch(0.15 0.015 160)` | Page background |
| `--card` | `oklch(1 0 0)` | `oklch(0.2 0.015 160)` | Card surfaces |
| `--muted` | `oklch(0.96 0.005 85)` | `oklch(0.25 0.01 160)` | Subtle backgrounds |

### Custom Utilities

```css
/* Gradient text */
.onam-text-gradient {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Floating petal animations */
.animate-float-petal { ... }
.animate-float-petal-alt { ... }

/* Mobile bottom nav spacing */
body.has-mobile-nav {
  padding-bottom: calc(var(--mobile-nav-height, 72px) + env(safe-area-inset-bottom, 0px));
}
```

### Responsive Breakpoints

| Breakpoint | Range | Usage |
|------------|-------|-------|
| **Mobile** | ≤ 767px | Bottom nav, stacked layouts, larger touch targets |
| **Tablet** | 768px – 1023px | 2-column grids, side-by-side forms |
| **Desktop** | ≥ 1024px | Full nav, multi-column layouts, hover states |

---

## 📱 Mobile-First Responsive Guidelines

All components follow **mobile-first** patterns:

1. **Base styles** target mobile (≤767px)
2. **`sm:`** (640px+) for small tablets
3. **`lg:`** (1024px+) for desktop enhancements
4. **Touch targets** ≥ 44px (using `min-h-[44px]` / `min-h-[48px]`)
5. **Content ordering** — most important content first on mobile (`order-2 lg:order-1`)
6. **Safe areas** — `env(safe-area-inset-bottom)` for bottom nav

---

## 🔐 Authentication & Data

- **No login required** — fully functional anonymously
- **Convex Auth** available for optional accounts (email OTP)
- **All user data** (wishes, favorites, settings) stored locally in IndexedDB
- **AI generation** calls Convex actions → Google Gemini API
- **No tracking, analytics, or third-party cookies**

---

## 📦 Deployment

### Vercel (Recommended)

```bash
# Connect repo to Vercel
# Add VITE_CONVEX_URL from Convex dashboard
# Deploy — auto-detects Vite + React
```

### Netlify / Cloudflare Pages / Static Hosting

```bash
bun run build
# Upload dist/ folder
# Set VITE_CONVEX_URL in build environment
```

### Convex Backend

```bash
bunx convex deploy --prod
# Sets production deployment URL
```

---

## 💰 Paid Project Notice

> **ONAMCONNECT is a paid/proprietary project.**
>
> This codebase, its design, assets, and underlying intellectual property are **not licensed for public use, redistribution, modification, or commercial exploitation** without explicit written permission from the copyright holder.
>
> Unauthorized copying, forking, or deployment of this project (in whole or in part) is strictly prohibited.

---

## 👨‍💻 Developed By

**Surag** — Full-Stack Developer

> **Copyright © 2026 Surag. All rights reserved.**
>
> This project is the exclusive intellectual property of Surag. Do not use, copy, modify, distribute, or deploy this code without prior written permission.

---

## 📄 License

**Proprietary — All Rights Reserved.**  
This is not open source software. See [Paid Project Notice](#-paid-project-notice) above.

---

## 🙏 Acknowledgments

- **Google Gemini** for AI-powered wish generation
- **Convex** for real-time backend & auth
- **Radix UI** for accessible component primitives
- **Tailwind CSS v4** for modern utility-first styling
- **Framer Motion** for delightful animations
- **Lucide** for beautiful icons
- **Kerala culture & Onam traditions** for inspiration

---

**ONAMCONNECT** — Create. Celebrate. Connect. 🌼