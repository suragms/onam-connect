import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { MessageTemplates } from "@/components/MessageTemplates";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { ThiruvonamWishes } from "@/components/ThiruvonamWishes";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ThiruvonamWishes />
        <MessageTemplates />
        <Features />

        {/* Final CTA */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-accent/20 p-10 sm:p-14 shadow-lg"
            >
              <span className="text-4xl" aria-hidden="true">✦</span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Celebrate Onam?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                Create personalized wishes, greeting cards, and share with everyone you love — no login required.
              </p>
              <Link
                to="/generator"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] cursor-pointer min-h-[48px]"
              >
                <Sparkles className="h-5 w-5" />
                ✨ Create My Wish
              </Link>
            </motion.div>
          </div>
        </section>

        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
