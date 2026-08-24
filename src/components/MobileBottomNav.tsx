import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";
import {
  Home,
  Sparkles,
  Palette,
  Heart,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { MoreBottomSheet } from "./MoreBottomSheet";

type NavTab = {
  label: string;
  href: string;
  icon: LucideIcon;
  isPrimary?: boolean;
};

const tabs: NavTab[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Create", href: "/generator", icon: Sparkles, isPrimary: true },
  { label: "Cards", href: "/card-studio", icon: Palette },
  { label: "Saved", href: "/saved", icon: Heart },
  { label: "More", href: "#more", icon: Menu },
];

const NAV_HEIGHT = "72px";

/** Inline styles so fixed positioning always wins (no Tailwind conflict). */
const navShellStyle: CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
  width: "100%",
  margin: 0,
  padding: 0,
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderTop: "1px solid oklch(0.91 0.01 85)",
  boxShadow: "0 -4px 24px -4px oklch(0.55 0.18 145 / 0.12), 0 -2px 8px -2px oklch(0.82 0.14 85 / 0.08)",
  boxSizing: "border-box",
};

const listStyle: CSSProperties = {
  display: "flex",
  alignItems: "stretch",
  justifyContent: "space-between",
  height: NAV_HEIGHT,
  maxWidth: "480px",
  margin: "0 auto",
  padding: "6px 4px 8px",
  listStyle: "none",
  boxSizing: "border-box",
};

const primaryButtonStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 3,
  padding: "4px 2px",
  textDecoration: "none",
  color: "oklch(0.55 0.18 145)",
  WebkitTapHighlightColor: "transparent",
  touchAction: "manipulation",
};

const primaryIconStyle = (active: boolean) => ({
  width: active ? 26 : 24,
  height: active ? 26 : 24,
  strokeWidth: active ? 2.6 : 2.2,
  color: "oklch(0.55 0.18 145)",
  ariaHidden: true,
  transition: "all 0.2s ease",
});

const primaryLabelStyle = (active: boolean) => ({
  display: "block",
  width: "100%",
  textAlign: "center",
  fontSize: 11,
  lineHeight: 1.2,
  fontWeight: active ? 700 : 600,
  color: "oklch(0.55 0.18 145)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition: "all 0.2s ease",
});

const regularButtonStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 3,
  padding: "4px 2px",
  textDecoration: "none",
  color: "oklch(0.5 0.01 160)",
  WebkitTapHighlightColor: "transparent",
  touchAction: "manipulation",
};

const regularIconStyle = (active: boolean) => ({
  width: 22,
  height: 22,
  strokeWidth: active ? 2.4 : 1.9,
  color: active ? "oklch(0.55 0.18 145)" : "oklch(0.5 0.01 160)",
  ariaHidden: true,
  transition: "all 0.2s ease",
});

const regularLabelStyle = (active: boolean) => ({
  display: "block",
  width: "100%",
  textAlign: "center",
  fontSize: 11,
  lineHeight: 1.2,
  fontWeight: active ? 700 : 500,
  color: active ? "oklch(0.55 0.18 145)" : "oklch(0.5 0.01 160)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition: "all 0.2s ease",
});

const primaryButtonContainerStyle = (active: boolean): CSSProperties => ({
  flex: "1 1 0",
  minWidth: 0,
  display: "flex",
  position: "relative",
});

const regularButtonContainerStyle: CSSProperties = {
  flex: "1 1 0",
  minWidth: 0,
  display: "flex",
};

export function MobileBottomNav() {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    function update() {
      const on = mq.matches;
      setIsMobile(on);
      document.body.classList.toggle("has-mobile-nav", on);
      document.documentElement.style.setProperty(
        "--mobile-nav-height",
        on ? NAV_HEIGHT : "0px",
      );
      const el = document.getElementById("mobile-bottom-nav");
      if (el) el.style.display = on ? "block" : "none";
    }
    update();
    mq.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      document.body.classList.remove("has-mobile-nav");
      document.documentElement.style.removeProperty("--mobile-nav-height");
    };
  }, []);

  function isActive(href: string) {
    if (href === "/") return location.pathname === "/";
    if (href === "/saved") return location.pathname === "/saved" || location.pathname === "/history";
    return location.pathname.startsWith(href);
  }

  function handleMoreClick(e: React.MouseEvent) {
    e.preventDefault();
    setIsMoreOpen(true);
  }

  const nav = (
    <nav
      id="mobile-bottom-nav"
      style={navShellStyle}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <ul style={listStyle}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          const isPrimaryTab = tab.isPrimary;

          // More button - opens bottom sheet
          if (tab.href === "#more") {
            return (
              <li key={tab.href} style={regularButtonContainerStyle}>
                <button
                  type="button"
                  onClick={handleMoreClick}
                  aria-label={tab.label}
                  aria-expanded={isMoreOpen}
                  aria-controls="more-bottom-sheet"
                  style={regularButtonStyle}
                >
                  <Icon
                    {...regularIconStyle(active)}
                  />
                  <span
                    {...regularLabelStyle(active)}
                  >
                    {tab.label}
                  </span>
                </button>
              </li>
            );
          }

          // Primary Create button
          if (isPrimaryTab) {
            return (
              <li key={tab.href} style={primaryButtonContainerStyle(active)}>
                <Link
                  to={tab.href}
                  aria-label={tab.label}
                  aria-current={active ? "page" : undefined}
                  style={{
                    ...primaryButtonStyle,
                    ...(active && {
                      transform: "scale(1.02)",
                    }),
                  }}
                >
                  <Icon
                    {...primaryIconStyle(active)}
                  />
                  <span
                    {...primaryLabelStyle(active)}
                  >
                    {tab.label}
                  </span>
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        top: -2,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "oklch(0.55 0.18 145)",
                        opacity: 0.8,
                      }}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            );
          }

          // Regular tabs
          return (
            <li key={tab.href} style={regularButtonContainerStyle}>
              <Link
                to={tab.href}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
                style={regularButtonStyle}
              >
                <Icon
                  {...regularIconStyle(active)}
                />
                <span
                  {...regularLabelStyle(active)}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  if (typeof document === "undefined" || !isMobile) return null;

  return (
    <>
      {createPortal(nav, document.body)}
      <MoreBottomSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
      />
    </>
  );
}