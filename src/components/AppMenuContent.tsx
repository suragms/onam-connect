import { useLocation, useNavigate } from "react-router";
import {
  Sparkles,
  LayoutGrid,
  Palette,
  Wand2,
  Share2,
  Briefcase,
  Heart,
  History,
  HelpCircle,
  Info,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Create",
    items: [
      { label: "AI Generator", href: "/generator", icon: Sparkles },
      { label: "Templates", href: "/templates", icon: LayoutGrid },
      { label: "Card Studio", href: "/card-studio", icon: Palette },
    ],
  },
  {
    title: "Tools",
    items: [
      { label: "Improve Text", href: "/improve", icon: Wand2 },
      { label: "Captions", href: "/social-captions", icon: Share2 },
      { label: "Business", href: "/business", icon: Briefcase },
    ],
  },
  {
    title: "Your Library",
    items: [
      { label: "Saved", href: "/saved", icon: Heart },
      { label: "History", href: "/history", icon: History },
    ],
  },
  {
    title: "Explore",
    items: [
      { label: "How It Works", href: "/#how-it-works", icon: HelpCircle },
      { label: "About Us", href: "/about", icon: Info },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

function isActivePath(href: string, pathname: string) {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppMenuContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function handleItemClick(href: string) {
    if (href.startsWith("/#")) {
      const [path, hash] = href.split("#");
      navigate({ pathname: path || "/", hash: `#${hash}` });
    } else {
      navigate(href);
    }
    onNavigate?.();
  }

  return (
    <nav aria-label="All pages" className="px-4 pb-6">
      {MENU_SECTIONS.map((section) => (
        <div key={section.title} className="mb-5 last:mb-0">
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(item.href, pathname);
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleItemClick(item.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-[88px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-3 text-center transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer",
                    active
                      ? "border-primary/40 bg-primary/10 text-primary shadow-xs"
                      : "border-border/60 bg-muted/30 text-foreground hover:border-primary/40 hover:bg-primary/5",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      active ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary",
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-xs font-medium leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
