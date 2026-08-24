import { Link } from "react-router";

const links = [
  { label: "Home", href: "/" },
  { label: "AI Generator", href: "/generator" },
  { label: "Templates", href: "/templates" },
  { label: "Card Studio", href: "/card-studio" },
  { label: "History", href: "/history" },
];

const seoLinks = [
  { label: "Onam Wishes", href: "/onam-wishes" },
  { label: "Malayalam Wishes", href: "/malayalam-onam-wishes" },
  { label: "Office Wishes", href: "/onam-wishes-for-office" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <span aria-hidden="true">🌼</span>
              ONAMCONNECT
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              AI-powered Onam wishes, created in seconds. Create. Celebrate. Connect.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Explore</h3>
            <ul className="space-y-2">
              {seoLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
          &copy; 2026 ONAMCONNECT. Create. Celebrate. Connect.
        </div>
      </div>
    </footer>
  );
}
