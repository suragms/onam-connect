import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { FloatingElements, PookalamDecorative } from "./FloatingElements";

const EXAMPLES = [
  { lang: "Malayalam", text: "എല്ലാവർക്കും ഹൃദയം നിറഞ്ഞ ഓണാശംസകൾ…" },
  { lang: "English", text: "May this Onam bring happiness, prosperity, and togetherness to your home." },
  { lang: "Manglish", text: "Ellavarkkum hridayam niranja Onashamsakal…" },
];

export function Hero() {
  const [exampleIdx, setExampleIdx] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setExampleIdx((i) => (i + 1) % EXAMPLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-primary/5" aria-labelledby="hero-heading">
      <FloatingElements />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-12 pt-12 sm:pt-16 lg:pt-24">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-3 text-sm font-medium text-primary">Create. Celebrate. Connect.</p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
            >
              <Sparkles className="h-3 w-3" />
              AI-powered Onam wishes, created in seconds
            </motion.div>

            <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Your Onam wish.{" "}
              <span className="onam-text-gradient">Made special by AI.</span>
            </h1>

            <p className="mt-4 max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground">
              Create beautiful Onam wishes in Malayalam, English or Manglish — then share them with everyone you love.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/generator"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] cursor-pointer min-h-[48px]"
              >
                <Sparkles className="h-5 w-5" />
                ✨ Create My Wish
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/templates"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-base font-semibold transition-all hover:bg-accent/50 cursor-pointer min-h-[48px]"
              >
                Explore Onam Wishes
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>🔐 No Login Required</span>
              <span>🌸 Malayalam Support</span>
              <span>📤 Share Everywhere</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:order-last"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none group">
              {/* Glowing Background Blur */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary via-amber-500 to-emerald-600 opacity-30 blur-xl transition-all group-hover:opacity-50" />

              {/* Cover Photo Banner */}
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-2xl">
                <img
                  src="/cover.jpg"
                  alt="ONAMCONNECT Cover - AI Onam Wishes & Greeting Cards"
                  className="w-full h-auto aspect-video object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />

                <div className="p-4 bg-card/95 backdrop-blur-md border-t border-border/50">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">Onam 2026 Live Preview</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                      <Sparkles className="h-3 w-3" /> AI Wish Generator
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={exampleIdx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-xs font-medium text-muted-foreground">{EXAMPLES[exampleIdx].lang}:</p>
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        "{EXAMPLES[exampleIdx].text}"
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
