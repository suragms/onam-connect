import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do I need an account to use ONAMCONNECT?",
    a: "No. The entire platform is accessible without creating an account. Your saved greetings and preferences are stored locally in your browser.",
  },
  {
    q: "Which languages are supported?",
    a: "ONAMCONNECT supports Malayalam, English, and Manglish — a phonetic rendering of Malayalam in English script. You can also generate messages that blend Malayalam and English.",
  },
  {
    q: "Can I share greetings directly to WhatsApp?",
    a: "Yes. Each greeting can be sent to WhatsApp in a single tap. Telegram, X, and Facebook are also supported with the same one-tap workflow.",
  },
  {
    q: "How does the AI greeting generator work?",
    a: "The generator uses Google Gemini to craft personalized messages based on your selected recipient, language, tone, and occasion. Every output is culturally informed and ready to use.",
  },
  {
    q: "What is the greeting catalog?",
    a: "The catalog is a curated collection of professionally written Onam greetings organized by category, language, and occasion. You can search, filter, copy instantly, or customize any entry with AI.",
  },
  {
    q: "Can I download greeting cards as images?",
    a: "Yes. Every greeting can be exported as a high-resolution PNG image — ready for print, email, or social media distribution.",
  },
  {
    q: "Can I share to Signal or Arattai?",
    a: "Signal and Arattai do not offer direct web sharing APIs. ONAMCONNECT uses native share on supported devices, or copies your message so you can paste it in the app.",
  },
  {
    q: "How does Facebook sharing work?",
    a: "Facebook's web sharer only accepts URLs, not pre-filled text. ONAMCONNECT copies your message and opens Facebook so you can paste it in a post.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 id="faq-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked <span className="onam-text-gradient">Questions</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-border/60 bg-card px-5 shadow-sm"
              >
                <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
