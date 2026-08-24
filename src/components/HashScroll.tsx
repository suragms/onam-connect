import { useEffect } from "react";
import { useLocation } from "react-router";
import { scrollToHash } from "@/lib/scrollToSection";

/** Scroll to in-page anchors after route/hash changes (SPA + lazy routes). */
export function HashScroll() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.slice(1);
    let attempts = 0;

    const tryScroll = () => {
      attempts += 1;
      if (scrollToHash(location.hash)) return;
      if (attempts < 12) {
        window.setTimeout(tryScroll, 50);
      }
    };

    const timer = window.setTimeout(tryScroll, 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return null;
}
