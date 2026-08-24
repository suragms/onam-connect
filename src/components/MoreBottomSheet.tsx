import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router";
import {
  X,
  LayoutGrid,
  Wand2,
  Share2,
  Briefcase,
  HelpCircle,
  Info,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

type MoreMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

const moreMenuItems: MoreMenuItem[] = [
  { label: "Templates", href: "/templates", icon: LayoutGrid },
  { label: "Improve Message", href: "/improve", icon: Wand2 },
  { label: "Social Captions", href: "/social-captions", icon: Share2 },
  { label: "Business Wishes", href: "/business", icon: Briefcase },
  { label: "How It Works", href: "/#how-it-works", icon: HelpCircle },
  { label: "About ONAMCONNECT", href: "/about", icon: Info },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function MoreBottomSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      // Focus the close button or first item for accessibility
      setTimeout(() => {
        sheetRef.current?.focus();
      }, 0);
    } else {
      document.body.style.overflow = "";
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
      // Trap focus within the sheet
      if (e.key === "Tab") {
        const focusableElements = sheetRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  function handleItemClick(href: string, external?: boolean) {
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer");
      onClose();
      return;
    }
    if (href.startsWith("/#")) {
      const [path, hash] = href.split("#");
      navigate({ pathname: path, hash: `#${hash}` });
    } else {
      navigate(href);
    }
    onClose();
  }

  const sheet = (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        ref={sheetRef}
        side="bottom"
        className="rounded-t-3xl border-t border-border/60 bg-background/95 backdrop-blur-xl shadow-[0_-4px_24px_-4px_oklch(0.55_0.18_145_/_0.12),_0_-2px_8px_-2px_oklch(0.82_0.14_85_/_0.08)] max-h-[85vh] overflow-y-auto"
        tabIndex={-1}
      >
        <div className="flex items-center justify-center mb-2">
          <div
            className="w-10 h-1.5 rounded-full bg-border/50"
            aria-hidden="true"
          />
        </div>
        <SheetHeader className="px-6 pb-2">
          <SheetTitle className="text-xl font-bold text-center">More</SheetTitle>
          <SheetDescription className="text-center text-muted-foreground">
            Additional features and settings
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6 space-y-2">
          {moreMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => handleItemClick(item.href, item.external)}
                className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all hover:bg-accent/50 active:scale-[0.98] min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-base font-medium text-foreground">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="px-6 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background px-5 py-3.5 text-base font-medium text-foreground transition-all hover:bg-accent/50 active:scale-[0.98] min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <X className="h-5 w-5" />
            Close
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );

  if (typeof document === "undefined") return null;
  return createPortal(sheet, document.body);
}