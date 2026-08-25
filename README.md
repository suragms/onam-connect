# ONAMCONNECT — AI-Powered Onam Wishes & Greeting Cards 🌼

![ONAMCONNECT Banner](public/cover.jpg)

> **A premium, mobile-first web application for creating personalized Onam wishes, greeting cards, and social captions using Google Gemini AI. Built with React 19, TypeScript, Tailwind CSS v4, and Convex / Vercel Serverless backend.**

🌐 **Live Demo:** [https://onamconnect.vercel.app/](https://onamconnect.vercel.app/)

---

## 📖 Project Overview

**ONAMCONNECT** is a comprehensive Onam celebration platform that empowers users worldwide to craft, customize, and share authentic Malayalam, English, and Manglish Onam greetings.

### Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Generator** | Multi-parameter wish generation (recipient, language, tone, style, occasion, purpose, length, emoji level) |
| 🎨 **Card Studio** | Real-time card designer, customizable presets, downloadable PNG export |
| 📱 **Social Captions** | Platform-optimized captions for Instagram, X, WhatsApp, Facebook, LinkedIn with hashtags |
| ✨ **Message Improver** | Paste any wish → AI refines it (warmer, shorter, funnier, formal) |
| 📚 **Template Catalog** | 20+ ready-to-use greetings, searchable & filterable by category/language |
| 💾 **Local Storage** | Recent wishes & favorites saved securely in IndexedDB — private, no login required |
| ⚡ **Vercel & Convex** | Cloud serverless functions + Vercel deployment ready |
| 🌙 **Dark Mode** | System-aware theme toggle, persisted in `localStorage` |
| ♿ **Accessibility** | Reduced motion support, proper ARIA attributes, 44px+ touch targets |

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend Framework** | React 19, TypeScript, Vite 7 |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v4 (OKLCH color space), CSS Custom Properties |
| **UI Components** | Radix UI (headless, accessible components) |
| **Animations** | Framer Motion (enter/exit, scroll-triggered animations) |
| **Backend & Realtime** | Convex (Serverless Database & Cloud Actions) |
| **Serverless API** | Vercel Serverless Functions (`api/ai/*`) |
| **AI Integration** | Google Gemini API (via Convex & Vercel API routes) |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Forms & Validation** | React Hook Form + Zod |
| **Card Export** | `@zumer/snapdom` (DOM → Canvas → PNG) |

---

## 📁 Project Structure

```
onam-connect/
├── api/                      # Vercel Serverless Functions
│   └── ai/
│       ├── generate.ts       # AI Wish Generation endpoint
│       ├── improve.ts        # AI Message Improver endpoint
│       └── social-caption.ts # AI Social Captions endpoint
├── public/                   # Static public assets
│   ├── cover.jpg             # Official 16:9 Cover Banner
│   ├── logo.jpg              # Official Brand Logo Icon
│   ├── og-image.jpg          # Open Graph Social Card
│   ├── manifest.webmanifest  # PWA Manifest
│   ├── robots.txt            # Search Engine Crawling Rules
│   └── sitemap.xml           # SEO Sitemap
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # Radix & Shadcn primitives (Button, Dialog, Sonner, etc.)
│   │   ├── Navbar.tsx        # Header Navigation with Logo
│   │   ├── Hero.tsx          # Landing Hero Section with Cover Banner
│   │   ├── GeneratorForm.tsx # AI Wish Generator Form
│   │   ├── CardStudio.tsx    # Greeting Card Designer
│   │   └── ...
│   ├── pages/                # Route-level pages
│   │   ├── Landing.tsx       # Home page
│   │   ├── Generator.tsx     # Generator page
│   │   ├── CardStudio.tsx    # Card designer page
│   │   ├── SeoPage.tsx       # Search-optimized landing pages
│   │   └── ...
│   ├── lib/                  # Utilities & core logic
│   │   └── geminiCore.ts     # Gemini AI prompts & retries
│   ├── index.css             # Global styles & Tailwind v4 theme
│   └── main.tsx              # Application entrypoint
├── .env.vercel               # Vercel Environment Template
├── .env.production           # Production Environment Config
├── index.html                # App HTML Shell with Meta Tags
├── package.json
└── vite.config.ts
```

---

## ⚡ Environment Variables & Vercel Deployment

### 1. Vercel Configuration

Add the following environment variables under **Vercel Project Settings ➔ Environment Variables**:

```env
# Required: Convex Cloud Deployment URL
VITE_CONVEX_URL=https://good-otter-826.convex.cloud

# Production Deployment Identifier
CONVEX_DEPLOYMENT=prod:good-otter-826

# Site URL for Auth and Callbacks
CONVEX_SITE_URL=https://onamconnect.vercel.app

# Google Gemini API Key for Serverless Functions
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/suragms/onam-connect.git
   cd onam-connect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local dev server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 🗺️ Sitemap & SEO

- **Sitemap XML:** [https://onamconnect.vercel.app/sitemap.xml](https://onamconnect.vercel.app/sitemap.xml)
- **Robots TXT:** [https://onamconnect.vercel.app/robots.txt](https://onamconnect.vercel.app/robots.txt)

---

## 💰 Paid Project Notice & License

> **ONAMCONNECT is a paid / proprietary project.**
>
> This codebase, its design, assets, and underlying intellectual property are **not licensed for public redistribution, modification, or commercial exploitation** without explicit written permission from the copyright holder.

**Developed By:** Surag — Full-Stack Developer  
**Copyright © 2026 Surag. All rights reserved.**