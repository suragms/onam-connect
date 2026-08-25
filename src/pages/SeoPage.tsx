import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router";
import { Sparkles } from "lucide-react";

const SEO_CONTENT: Record<string, { title: string; description: string; config: Record<string, string> }> = {
  "onam-wishes": {
    title: "Onam Wishes — AI Generator",
    description: "Create personalized Onam wishes for family, friends, and colleagues. Generate in Malayalam, English, or Manglish with AI.",
    config: { occasion: "Onam Wishes" },
  },
  "malayalam-onam-wishes": {
    title: "Malayalam Onam Wishes",
    description: "Beautiful Onam wishes in proper Malayalam script. AI-crafted, culturally authentic, ready to share on WhatsApp and social media.",
    config: { language: "Malayalam", tone: "Traditional" },
  },
  "onam-messages": {
    title: "Onam Messages",
    description: "Send heartfelt Onam messages to everyone you love. Short, medium, or long — optimized for every platform.",
    config: { purpose: "WhatsApp" },
  },
  "onam-greetings": {
    title: "Onam Greetings",
    description: "Premium Onam greeting cards and messages. Create, download, and share your festive greetings.",
    config: { tone: "Heartwarming" },
  },
  "onam-wishes-for-friends": {
    title: "Onam Wishes for Friends",
    description: "Fun, friendly, and heartfelt Onam wishes for your closest friends. Generate with AI in seconds.",
    config: { recipient: "Friends", tone: "Friendly" },
  },
  "onam-wishes-for-family": {
    title: "Onam Wishes for Family",
    description: "Warm family Onam wishes in Malayalam, English, or Manglish. Perfect for parents, siblings, and loved ones.",
    config: { recipient: "Family", tone: "Heartwarming" },
  },
  "onam-wishes-for-office": {
    title: "Onam Wishes for Office",
    description: "Professional Onam greetings for colleagues, teams, and business clients. Respectful and festive.",
    config: { recipient: "Colleague", occasion: "Office Onam", tone: "Professional" },
  },
};

export default function SeoPage({ slug }: { slug: string }) {
  const content = SEO_CONTENT[slug] || SEO_CONTENT["onam-wishes"];
  const params = new URLSearchParams(content.config).toString();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
        <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{content.description}</p>

        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-bold tracking-tight">Why ONAMCONNECT?</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>✨ AI-powered personalized Onam wishes</li>
            <li>🌸 Malayalam, English, and Manglish support</li>
            <li>📤 Share on WhatsApp, Telegram, X, Facebook, and more</li>
            <li>🎨 Create downloadable greeting cards</li>
            <li>🔐 No login required — completely free</li>
          </ul>
        </div>

        <Link
          to={`/generator?${params}`}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground cursor-pointer min-h-[48px]"
        >
          <Sparkles className="h-5 w-5" /> Create Your Onam Wish
        </Link>
      </main>
      <Footer />
    </div>
  );
}
