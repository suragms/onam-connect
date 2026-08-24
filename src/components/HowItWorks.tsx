import { motion } from "framer-motion";
import { MousePointerClick, Sparkles, Share2 } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    number: "1",
    title: "Choose",
    description: "Select recipient, language, tone, and style. Add a name for personalization.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Sparkles,
    number: "2",
    title: "Generate",
    description: "AI creates your personalized Onam wish in Malayalam, English, or Manglish.",
    color: "bg-accent/30 text-accent-foreground",
  },
  {
    icon: Share2,
    number: "3",
    title: "Share",
    description: "Send it to everyone you care about — WhatsApp, Telegram, X, and more.",
    color: "bg-primary/10 text-primary",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-12 sm:py-16 bg-muted/30" aria-labelledby="hiw-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 id="hiw-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
            How It <span className="onam-text-gradient">Works</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">Three simple steps to your perfect Onam wish.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className={`relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}>
                <step.icon className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {step.number}
                </span>
              </div>
              <h3 className="mb-1 text-sm sm:text-base font-bold tracking-tight">{step.title}</h3>
              <p className="mx-auto max-w-xs text-xs sm:text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
