import { useState } from "react";
import { Menu, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { scrollToSection } from "@/lib/scrollToSection";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AppMenuContent } from "@/components/AppMenuContent";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "AI Generator", href: "/generator" },
  { label: "Templates", href: "/templates" },
  { label: "Card Studio", href: "/card-studio" },
  { label: "History", href: "/history" },
  { label: "How It Works", href: "/", hash: "how-it-works" },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleHashNav(hash: string) {
    if (location.pathname === "/") {
      scrollToSection(hash);
      window.history.replaceState(null, "", `#${hash}`);
    } else {
      navigate({ pathname: "/", hash: `#${hash}` });
    }
  }

  function isActive(href: string, hash?: string) {
    if (hash) {
      return location.pathname === "/" && location.hash === `#${hash}`;
    }
    return location.pathname === href;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl" role="navigation" aria-label="Main navigation">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight flex-none group">
          <img
            src="/logo.jpg"
            alt="ONAMCONNECT Logo"
            className="h-9 w-9 rounded-xl object-cover border border-primary/20 shadow-xs transition-transform group-hover:scale-105"
          />
          <span className="onam-text-gradient font-extrabold tracking-wide">ONAMCONNECT</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) =>
            link.hash ? (
              <button
                key={link.label}
                type="button"
                onClick={() => handleHashNav(link.hash!)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  isActive(link.href, link.hash)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 cursor-pointer min-h-[44px]"
          >
            <Sparkles className="h-4 w-4" />
            Create Wish
          </Link>
        </div>

        {/* Mobile / Tablet menu */}
        <div className="flex items-center lg:hidden">
          <Link
            to="/generator"
            aria-label="Create wish"
            className="mr-1 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 sm:hidden"
          >
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-foreground transition-colors hover:bg-accent/50 active:scale-95 cursor-pointer"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-[320px] overflow-y-auto p-0 border-l border-border/60"
        >
          <SheetHeader className="border-b border-border/40 px-5 py-4 text-left">
            <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
            <SheetDescription>Jump to any page or tool</SheetDescription>
          </SheetHeader>
          <AppMenuContent onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </nav>
  );
}
