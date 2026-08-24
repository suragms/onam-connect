import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  "🌼 Gathering the festive spirit…",
  "✨ Crafting your message…",
  "🪔 Adding a little Onam magic…",
  "🌸 Almost ready…",
];

export function LoadingSteps() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={step}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center text-sm text-muted-foreground"
        aria-live="polite"
      >
        {STEPS[step]}
      </motion.p>
    </AnimatePresence>
  );
}
