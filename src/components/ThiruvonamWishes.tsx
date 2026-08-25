import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Copy, Share2, ArrowRight, Sparkles, Heart, Users, Briefcase, MessageSquare, Camera, Instagram, Star } from "lucide-react";
import { copyMessage } from "@/lib/sharing";
import { ShareIconRow } from "@/components/ShareIconRow";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ThiruvonamWish {
  id: string;
  language: "Malayalam" | "English" | "Manglish";
  message: string;
  category: string;
}

const THIRUVONAM_WISHES: ThiruvonamWish[] = [
  // Malayalam wishes (5)
  {
    id: "ml-1",
    language: "Malayalam",
    message: "ഹൃദയം നിറഞ്ഞ തിരുവോണാശംസകൾ! ഈ തിരുവോണം നിങ്ങളുടെ ജീവിതത്തിൽ സന്തോഷവും സമാധാനവും ഐശ്വര്യവും നിറയ്ക്കട്ടെ. 🌼",
    category: "General",
  },
  {
    id: "ml-2",
    language: "Malayalam",
    message: "തിരുവോണത്തിന്റെ ദിവ്യ പ്രഭ നിങ്ങളുടെ വീട്ടിൽ സന്തോഷത്തിന്റെ നിറവിൽ പകലും രാത്രിയും വിജയിക്കട്ടെ. സന്തോഷകരമായ തിരുവോണം! 🌸",
    category: "Family",
  },
  {
    id: "ml-3",
    language: "Malayalam",
    message: "മഹാബലിയുടെ വരവ് നമ്മുടെ ഹൃദയങ്ങളിൽ സമത്വവും സഹോദര്യവും പകരട്ടെ. നല്ലൊരു തിരുവോണം ആശംസിക്കുന്നു! 🌼",
    category: "Traditional",
  },
  {
    id: "ml-4",
    language: "Malayalam",
    message: "പൂക്കളം, ഓണസദ്യ, ഓണക്കൊടി — ഇവ എല്ലാം നിറഞ്ഞ ഒരു മനോഹര തിരുവോണം നിങ്ങൾക്കും നിങ്ങളുടെ കുടുംബത്തിനും! 🌸",
    category: "General",
  },
  {
    id: "ml-5",
    language: "Malayalam",
    message: "സുഹൃത്തുക്കളോടൊപ്പം നിറഞ്ഞു നിൽക്കുന്ന ഈ തിരുവോണം നിങ്ങളുടെ സൗഹൃദത്തിന് പുതുചരിത്രം കുറിക്കട്ടെ. ഹൃദയം നിറഞ്ഞ തിരുവോണാശംസകൾ! 🌼",
    category: "Friends",
  },

  // English wishes (5)
  {
    id: "en-1",
    language: "English",
    message: "Wishing you and your family a joyful Thiruvonam filled with happiness, prosperity, love and togetherness. Happy Thiruvonam! 🌼",
    category: "General",
  },
  {
    id: "en-2",
    language: "English",
    message: "May the spirit of Mahabali bring peace, harmony, and abundance to your home this Thiruvonam. Wishing you a blessed and beautiful celebration! 🌸",
    category: "Traditional",
  },
  {
    id: "en-3",
    language: "English",
    message: "Happy Thiruvonam to my dear family! May this harvest festival fill our lives with the colors of Pookalam, the warmth of Onasadya, and the joy of togetherness. 🌼",
    category: "Family",
  },
  {
    id: "en-4",
    language: "English",
    message: "To my wonderful friends — may your Thiruvonam be as vibrant as a Pookalam and as sweet as payasam. Have a fantastic celebration! 🌸",
    category: "Friends",
  },
  {
    id: "en-5",
    language: "English",
    message: "Warm Thiruvonam greetings to you and your team. May this festive season bring new opportunities, growth, and shared success. Happy Thiruvonam! 🌼",
    category: "Office",
  },

  // Manglish wishes (5)
  {
    id: "mg-1",
    language: "Manglish",
    message: "Ellavarkkum hridayam niranja Thiruvonam aashamsakal! Ee Thiruvonam santhoshavum samadhanavum aishwaryavum niranjathakatte. 🌸",
    category: "General",
  },
  {
    id: "mg-2",
    language: "Manglish",
    message: "Thiruvona aashamsakal! Mahabali chakravarthiyude aagraham pole, jeevitham niranja santhosham pole ninakum kittatte. Happy Thiruvonam! 🌼",
    category: "Traditional",
  },
  {
    id: "mg-3",
    language: "Manglish",
    message: "Kudumbam ellarkum onam aashamsakal! Pookkalam pole jeevitham niranja premathinulla onam undayirikkatte. Love you all! 🌸",
    category: "Family",
  },
  {
    id: "mg-4",
    language: "Manglish",
    message: "Machane, Thiruvonam aashamsakal! Sadyo kazhichu enjoy cheyyu, pookkalam chuttu koodi nalla time spend cheyyu. Happy Onam! 🌼",
    category: "Friends",
  },
  {
    id: "mg-5",
    language: "Manglish",
    message: "Office team ku nalla Thiruvonam! Project ellam success aayi complete aakatte, onam varaayi nalla profit kittatte. Happy Thiruvonam team! 🌼",
    category: "Office",
  },
];

const CATEGORIES = [
  { id: "all", label: "🌼 All", emoji: "🌼" },
  { id: "General", label: "🌼 General", emoji: "🌼" },
  { id: "Family", label: "👨‍👩‍👧 Family", emoji: "👨‍👩‍👧" },
  { id: "Friends", label: "❤️ Friends", emoji: "❤️" },
  { id: "Loved Ones", label: "👩‍❤️‍👨 Loved Ones", emoji: "👩‍❤️‍👨" },
  { id: "Office", label: "💼 Office", emoji: "💼" },
  { id: "Business", label: "🏢 Business", emoji: "🏢" },
  { id: "WhatsApp", label: "📱 WhatsApp", emoji: "📱" },
  { id: "Instagram", label: "📸 Instagram", emoji: "📸" },
  { id: "Malayalam", label: "🇮🇳 Malayalam", emoji: "🇮🇳" },
  { id: "Manglish", label: "🔤 Manglish", emoji: "🔤" },
] as const;

const QUICK_ACTIONS: Array<{ label: string; config: Record<string, string> }> = [
  { label: "Malayalam Thiruvonam Wishes", config: { language: "Malayalam", occasion: "Thiruvonam", tone: "Traditional" } },
  { label: "Family Thiruvonam Wishes", config: { recipient: "Family", occasion: "Thiruvonam", tone: "Heartwarming" } },
  { label: "Thiruvonam Wishes for Friends", config: { recipient: "Friends", occasion: "Thiruvonam", tone: "Friendly" } },
  { label: "Office Thiruvonam Wishes", config: { recipient: "Colleague", occasion: "Office Onam", tone: "Professional" } },
  { label: "Thiruvonam WhatsApp Wishes", config: { purpose: "WhatsApp", occasion: "Thiruvonam", length: "Short" } },
  { label: "Thiruvonam Instagram Captions", config: { purpose: "Instagram", occasion: "Thiruvonam", tone: "Social Media" } },
];

const CARD_STYLES = [
  "Traditional Kerala",
  "Pookalam",
  "Kasavu",
  "Golden Lamp",
  "Mahabali",
  "Floral",
  "Kerala Nature",
  "Modern Minimal",
];

export function ThiruvonamWishes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredWishes = THIRUVONAM_WISHES.filter((wish) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "Malayalam" || activeCategory === "English" || activeCategory === "Manglish") {
      return wish.language === activeCategory;
    }
    return wish.category === activeCategory;
  });

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleQuickAction = (config: Record<string, string>) => {
    const params = new URLSearchParams(config);
    params.set("occasion", "Thiruvonam");
    navigate(`/generator?${params.toString()}`);
  };

  const handleCopy = async (id: string, message: string) => {
    const ok = await copyMessage(message);
    if (ok) {
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      toast.error("Copy failed");
    }
  };

  const navigateToGenerator = (partialConfig?: Record<string, string>) => {
    const params = new URLSearchParams(partialConfig);
    params.set("occasion", "Thiruvonam");
    navigate(`/generator?${params.toString()}`);
  };

  const navigateToCards = (template?: string) => {
    const params = new URLSearchParams();
    params.set("occasion", "Thiruvonam");
    if (template) params.set("template", template);
    navigate(`/card-studio?${params.toString()}`);
  };

  return (
    <section id="thiruvonam-wishes" className="py-16 sm:py-24 bg-gradient-to-b from-background via-amber-50/30 to-background" aria-labelledby="thiruvonam-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-12 text-center"
        >
          <p className="mb-3 text-sm sm:text-base font-medium uppercase tracking-wider text-primary">
            🌼 Thiruvonam Wishes 2026
          </p>
          <h2 id="thiruvonam-heading" className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
            Share the joy, prosperity and togetherness of{" "}
            <span className="onam-text-gradient">Thiruvonam</span>
            with beautiful wishes created by AI.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
            Create heartfelt Thiruvonam wishes in Malayalam, English or Manglish and share them with your family, friends and loved ones.
          </p>

          {/* Primary CTAs */}
          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => navigateToGenerator({ occasion: "Thiruvonam" })}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] cursor-pointer min-h-[48px] shadow-lg"
              size="lg"
            >
              <Sparkles className="h-4 sm:h-5 w-4 sm:w-5" />
              ✨ Create Thiruvonam Wish
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/templates?occasion=Thiruvonam")}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold transition-all hover:bg-accent/50 cursor-pointer min-h-[48px]"
              size="lg"
            >
              Explore Wishes
              <ArrowRight className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-0 sm:px-0 sm:pb-0">
            <div className="flex flex-wrap sm:flex-nowrap gap-2 min-w-max sm:min-w-0" role="tablist" aria-label="Thiruvonam wish categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex-shrink-0 rounded-full px-4 py-2.5 text-sm sm:text-base font-medium transition-all whitespace-nowrap cursor-pointer min-h-[44px] sm:min-h-[40px] lg:min-h-[36px] ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Wishes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="mb-3 flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary text-wrap">
                      {wish.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {wish.language === "Malayalam" ? "🇮🇳" : wish.language === "English" ? "🇬🇧" : "🔤"} {wish.language}
                    </span>
                  </div>
                </div>

                <p className="mb-4 leading-relaxed text-sm sm:text-base text-foreground/80 whitespace-pre-line text-wrap break-words">
                  {wish.message}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => handleCopy(wish.id, wish.message)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-muted px-3 py-2.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer min-h-[44px] sm:min-h-[40px] lg:min-h-[36px] flex-1 text-wrap"
                  >
                    {copiedId === wish.id ? (
                      <>
                        <span className="h-3.5 w-3.5">✓</span> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                  <ShareIconRow message={wish.message} className="flex-1 min-w-[140px]" />
                </div>
              </motion.div>
            ))}
          </div>

          {filteredWishes.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">No wishes match this category. Try another filter.</p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <h3 className="mb-6 text-center text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Quick Thiruvonam Actions</h3>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_ACTIONS.map((action, index) => (
              <motion.button
                key={action.label}
                type="button"
                onClick={() => handleQuickAction(action.config)}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="w-full rounded-2xl border border-border/60 bg-card p-4 sm:p-5 text-left transition-all hover:border-primary/30 hover:shadow-md cursor-pointer min-h-[48px] sm:min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-foreground text-wrap">{action.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Thiruvonam Card Studio CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <div className="relative rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-amber-50/30 p-6 sm:p-8 lg:p-12 shadow-lg overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
            <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-amber-200/30 blur-2xl" aria-hidden="true" />

            <div className="relative text-center">
              <span className="text-3xl sm:text-4xl" aria-hidden="true">🎨</span>
              <h3 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                Create a <span className="onam-text-gradient">Thiruvonam Greeting Card</span>
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Turn your Thiruvonam wish into a beautiful Kerala-inspired greeting card. Download as PNG and share everywhere.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {CARD_STYLES.slice(0, 4).map((style) => (
                  <span key={style} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary text-wrap">
                    {style}
                  </span>
                ))}
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground text-wrap">
                  +{CARD_STYLES.length - 4} more
                </span>
              </div>

              <Button
                onClick={() => navigateToCards()}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] cursor-pointer min-h-[48px] shadow-lg"
                size="lg"
              >
                <Sparkles className="h-4 sm:h-5 w-4 sm:w-5" />
                Create Thiruvonam Card
                <ArrowRight className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* AI Personalization CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 lg:p-10">
            <span className="text-3xl sm:text-4xl" aria-hidden="true">✨</span>
            <h3 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              Want a more personal <span className="onam-text-gradient">Thiruvonam wish</span>?
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              Tell AI who you&apos;re wishing and the kind of message you want. Get a unique, personalized Thiruvonam wish in seconds.
            </p>
            <Button
              onClick={() => navigateToGenerator({ occasion: "Thiruvonam" })}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] cursor-pointer min-h-[48px]"
              size="lg"
            >
              <Sparkles className="h-4 sm:h-5 w-4 sm:w-5" />
              Personalize with AI
            </Button>
          </div>
        </motion.div>

        {/* Thiruvonam FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <h3 className="mb-8 text-center text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Thiruvonam <span className="onam-text-gradient">FAQ</span>
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {THIRUVONAM_FAQS.map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 transition-all hover:border-primary/30"
              >
                <h4 className="font-semibold text-sm sm:text-base">{faq.q}</h4>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* JSON-LD Structured Data for Thiruvonam FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: THIRUVONAM_FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}

const THIRUVONAM_FAQS = [
  {
    q: "What are Thiruvonam wishes?",
    a: "Thiruvonam wishes are greetings shared to celebrate the most important day of the Onam festival and express happiness, prosperity, togetherness and goodwill.",
  },
  {
    q: "Can I create Thiruvonam wishes in Malayalam?",
    a: "Yes. ONAMCONNECT can generate personalized Thiruvonam wishes in Malayalam, English and Manglish.",
  },
  {
    q: "Can I create a Thiruvonam wish for my family?",
    a: "Yes. Select Family or Parents in the AI generator and personalize the message.",
  },
  {
    q: "Can I share Thiruvonam wishes on WhatsApp?",
    a: "Yes. Use the WhatsApp sharing option or the native Share feature on supported devices.",
  },
  {
    q: "Can I create a Thiruvonam greeting card?",
    a: "Yes. Open Card Studio and choose a Thiruvonam-inspired design.",
  },
  {
    q: "What is the difference between Onam and Thiruvonam?",
    a: "Onam is the 10-day harvest festival. Thiruvonam is the 10th and most important day, when King Mahabali is believed to visit Kerala. Wishes on this day carry special significance.",
  },
];