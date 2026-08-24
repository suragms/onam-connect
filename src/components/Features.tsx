import { motion } from "framer-motion";
import { Sparkles, Globe, Smartphone, Share, Palette, Heart, Shield, Wand2, Camera } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI-Powered Wishes", desc: "Personalized Onam greetings crafted by Gemini AI in seconds." },
  { icon: Globe, title: "Malayalam Support", desc: "Proper Malayalam Unicode script with cultural authenticity." },
  { icon: Wand2, title: "Manglish Support", desc: "Phonetic Malayalam in English script for easy reading." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Designed for one-handed use on every screen size." },
  { icon: Share, title: "Share Everywhere", desc: "WhatsApp, Telegram, X, Facebook, and native share." },
  { icon: Palette, title: "Greeting Card Studio", desc: "10 templates, 5 formats, downloadable PNG cards." },
  { icon: Heart, title: "Save Favorites", desc: "Recent wishes and favorites stored locally — no login." },
  { icon: Shield, title: "No Login Required", desc: "Start creating immediately. Completely free." },
  { icon: Wand2, title: "AI Message Improver", desc: "Paste any wish and refine it with one click." },
  { icon: Camera, title: "Social Captions", desc: "Instagram, X, LinkedIn captions with hashtags." },
];

export function Features() {
  return (
    <section className="py-12 sm:py-16" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
            Everything for <span className="onam-text-gradient">Onam 2026</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">Kerala culture + AI + sharing — all in one place.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 transition-all hover:border-primary/30"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 text-xs sm:text-sm font-bold tracking-tight">{f.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
