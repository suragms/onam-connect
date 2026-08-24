import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { scrollToSection } from "@/lib/scrollToSection";

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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight flex-none">
          <span className="text-xl" aria-hidden="true">🌼</span>
          <span>ONAMCONNECT</span>
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

        <div className="hidden lg:block">
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 cursor-pointer min-h-[44px]"
          >
            <Sparkles className="h-4 w-4" />
            Create Wish
          </Link>
        </div>
      </div>
    </nav>
  );
}
