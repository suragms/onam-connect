import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router";
import { Sparkles, Heart, Palette, Globe, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Wishes",
    description: "Generate personalized Onam wishes in Malayalam, English, or Manglish using advanced AI.",
  },
  {
    icon: Heart,
    title: "Save & Share",
    description: "Save your favorite wishes locally and share instantly via WhatsApp, Telegram, or native sharing.",
  },
  {
    icon: Palette,
    title: "Card Studio",
    description: "Design beautiful greeting cards with customizable templates, formats, and styles.",
  },
  {
    icon: Globe,
    title: "No Account Required",
    description: "Use all features instantly without signing up. Your data stays on your device.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "No tracking, no ads, no data collection. Your wishes are yours alone.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with modern web technologies for instant loading and smooth interactions.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div className="text-center mb-12">
          <span className="text-5xl" aria-hidden="true">🌼</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">About ONAMCONNECT</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            AI-powered Onam wishes, created in seconds. Create. Celebrate. Connect.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-8">Why ONAMCONNECT?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border/60 bg-card p-6 text-center transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-8">How It Works</h2>
          <div className="space-y-6">
            {[
              { step: 1, title: "Choose Your Style", desc: "Select recipient, language, tone, and style for your wish." },
              { step: 2, title: "Generate with AI", desc: "Our AI creates a personalized Onam wish just for you." },
              { step: 3, title: "Customize & Share", desc: "Edit if needed, then share via WhatsApp, Telegram, or save for later." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-accent/20 p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Ready to Celebrate Onam?</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Create personalized wishes, greeting cards, and share with everyone you love — no login required.
          </p>
          <Link
            to="/generator"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] cursor-pointer min-h-[48px]"
          >
            <Sparkles className="h-5 w-5" />
            ✨ Create My Wish
          </Link>
        </section>

        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>Built with ❤️ for Onam celebrations everywhere</p>
          <p className="mt-1">
            <a
              href="https://onamconnect.vercel.app/"
              className="underline underline-offset-2 hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://onamconnect.vercel.app/
            </a>
          </p>
          <p className="mt-1">&copy; 2026 ONAMCONNECT. Create. Celebrate. Connect.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}