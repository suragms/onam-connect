import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MessageTemplates } from "@/components/MessageTemplates";
import { Link } from "react-router";
import { Sparkles } from "lucide-react";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Onam Wish Templates</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            20+ curated templates — copy, customize with AI, or share instantly.
          </p>
          <Link
            to="/generator"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground cursor-pointer min-h-[44px]"
          >
            <Sparkles className="h-4 w-4" /> Create with AI
          </Link>
        </section>
        <MessageTemplates />
      </main>
      <Footer />
    </div>
  );
}
