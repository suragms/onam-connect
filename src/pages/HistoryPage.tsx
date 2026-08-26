import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShareIconRow } from "@/components/ShareIconRow";
import { copyMessageWithSiteUrl } from "@/lib/sharing";
import {
  getHistory, getFavorites, deleteMessage, toggleFavorite,
  clearHistory, formatRelativeTime, groupHistoryByDate,
} from "@/lib/storage";
import { toast } from "sonner";
import { Link } from "react-router";
import { Copy, Heart, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HistoryPage() {
  const [tab, setTab] = useState<"recent" | "favorites">("recent");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [, refresh] = useState(0);
  const forceRefresh = () => refresh((n) => n + 1);

  const items = tab === "favorites" ? getFavorites() : getHistory();

  const filtered = useMemo(() => {
    return items.filter((m) => {
      const matchSearch = !search || m.message.toLowerCase().includes(search.toLowerCase()) ||
        m.recipient.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all" ||
        m.language === filter ||
        m.recipient === filter ||
        m.tone === filter;
      return matchSearch && matchFilter;
    });
  }, [items, search, filter]);

  const groups = groupHistoryByDate(filtered);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Your Recent Wishes</h1>
        <p className="mt-2 text-muted-foreground">Saved locally on your device — no account needed.</p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("recent")}
            className={`rounded-xl px-4 py-2 text-sm font-medium cursor-pointer min-h-[44px] ${tab === "recent" ? "bg-primary text-primary-foreground" : "border border-border"}`}
          >
            Recent
          </button>
          <button
            type="button"
            onClick={() => setTab("favorites")}
            className={`rounded-xl px-4 py-2 text-sm font-medium cursor-pointer min-h-[44px] ${tab === "favorites" ? "bg-primary text-primary-foreground" : "border border-border"}`}
          >
            ❤️ Favorites
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search wishes…" className="pl-9 rounded-xl min-h-[48px] text-base" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-input px-4 py-3.5 text-base min-h-[48px] sm:min-h-[48px] lg:min-h-[44px]">
            <option value="all">All</option>
            <option value="Malayalam">Malayalam</option>
            <option value="English">English</option>
            <option value="Manglish">Manglish</option>
            <option value="Family">Family</option>
            <option value="Friends">Friends</option>
            <option value="Professional">Professional</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 text-center text-muted-foreground">
            <p>
              {items.length === 0
                ? tab === "favorites"
                  ? "No favorites yet. Heart a wish from Recent or the generator."
                  : "No wishes saved yet. Generate a wish — it saves automatically."
                : "No wishes match your search or filter."}
            </p>
            {items.length === 0 && tab === "recent" && (
              <Button asChild className="mt-4 cursor-pointer">
                <Link to="/generator">Create Your First Wish</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {groups.map((group) => (
              <div key={group.label}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</h2>
                <div className="space-y-3">
                  {group.items.map((msg) => (
                    <div key={msg.id} className="rounded-2xl border border-border/60 bg-card p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">🌼 {msg.recipient}{msg.recipientName ? ` — ${msg.recipientName}` : ""}</p>
                          <p className="text-xs text-muted-foreground">{msg.language} · {msg.tone} · {formatRelativeTime(msg.date)}</p>
                        </div>
                        {msg.isFavorite && <Heart className="h-4 w-4 fill-primary text-primary" />}
                      </div>
                      <p className="mt-2 text-sm line-clamp-2">{msg.message}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" onClick={async () => { await copyMessageWithSiteUrl(msg.message); toast.success("Copied"); }} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2.5 text-xs cursor-pointer min-h-[44px] flex-1 sm:flex-none">
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </button>
                        <button type="button" onClick={() => { toggleFavorite(msg.id); forceRefresh(); toast.success(msg.isFavorite ? "Removed from favorites." : "Added to favorites."); }} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2.5 text-xs cursor-pointer min-h-[44px] flex-1 sm:flex-none">
                          <Heart className={`h-3.5 w-3.5 ${msg.isFavorite ? "fill-primary text-primary" : ""}`} /> Favorite
                        </button>
                        <Link to="/generator" className="inline-flex items-center gap-1 rounded-lg border px-3 py-2.5 text-xs cursor-pointer min-h-[44px] flex-1 sm:flex-none">
                          Regenerate
                        </Link>
                        <button type="button" onClick={() => { deleteMessage(msg.id); forceRefresh(); toast.success("Deleted"); }} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2.5 text-xs text-destructive cursor-pointer min-h-[44px] flex-1 sm:flex-none">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                      <ShareIconRow message={msg.message} className="mt-3" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <Button
            variant="outline"
            className="mt-8 cursor-pointer"
            onClick={() => { clearHistory(); forceRefresh(); toast.success("History cleared."); }}
          >
            Clear History
          </Button>
        )}
      </main>
      <Footer />
    </div>
  );
}
