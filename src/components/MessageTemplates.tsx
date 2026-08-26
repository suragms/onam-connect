import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Copy, Wand2, Check, Search } from "lucide-react";
import { TEMPLATES, TEMPLATE_CATEGORIES, type TemplateCategory } from "@/lib/templates";
import { copyMessageWithSiteUrl } from "@/lib/sharing";
import { ShareIconRow } from "@/components/ShareIconRow";
import { toast } from "sonner";
import { Link } from "react-router";

export function MessageTemplates() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let results = activeCategory === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (t) =>
          t.message.toLowerCase().includes(q) ||
          t.label.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.language.toLowerCase().includes(q),
      );
    }

    return results;
  }, [activeCategory, searchQuery]);

  async function handleCopy(id: string, message: string) {
    const ok = await copyMessageWithSiteUrl(message);
    if (ok) {
      setCopiedId(id);
      toast.success("Greeting copied to clipboard.");
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  return (
    <section id="catalog" className="py-16 sm:py-24" aria-labelledby="catalog-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 id="catalog-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Greeting <span className="onam-text-gradient">Catalog</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            A curated library of Onam greetings — ready to copy, customize with AI, or share directly.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search greetings by keyword, language, or category…"
              className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Search greetings"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Greeting categories">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="mb-4 text-center text-xs text-muted-foreground">
          {filtered.length} greeting{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Catalog grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {template.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{template.language}</span>
                </div>
                <span className="text-xs text-muted-foreground">{template.label}</span>
              </div>

              <p className="mb-4 line-clamp-4 text-sm leading-relaxed text-foreground/80">
                {template.message}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(template.id, template.message)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer min-h-[44px] flex-1 sm:flex-none"
                >
                  {copiedId === template.id ? (
                    <><Check className="h-3.5 w-3.5" /> Copied</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy</>
                  )}
                </button>
                <Link
                  to={`/generator?language=${encodeURIComponent(template.language)}&tone=${encodeURIComponent(template.category === "Funny" ? "Funny" : "Heartwarming")}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20 cursor-pointer min-h-[44px] flex-1 sm:flex-none"
                >
                  <Wand2 className="h-3.5 w-3.5" /> Customize
                </Link>
              </div>

              <ShareIconRow message={template.message} className="mt-3" />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No greetings match your search. Try different keywords or browse all categories.</p>
          </div>
        )}
      </div>
    </section>
  );
}
