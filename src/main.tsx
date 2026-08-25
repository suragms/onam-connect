import "@vly-ai/integrations";
import Toaster from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { HashScroll } from "./components/HashScroll.tsx";
import { MobileBottomNav } from "./components/MobileBottomNav.tsx";
import { MoreBottomSheet } from "./components/MoreBottomSheet.tsx";
import "./index.css";

const Landing = lazy(() => import("./pages/Landing.tsx"));
const GeneratorPage = lazy(() => import("./pages/Generator.tsx"));
const CardStudioPage = lazy(() => import("./pages/CardStudio.tsx"));
const HistoryPage = lazy(() => import("./pages/HistoryPage.tsx"));
const SavedPage = lazy(() => import("./pages/SavedPage.tsx"));
const TemplatesPage = lazy(() => import("./pages/TemplatesPage.tsx"));
const ImprovePage = lazy(() => import("./pages/ImprovePage.tsx"));
const SocialCaptionsPage = lazy(() => import("./pages/SocialCaptionsPage.tsx"));
const BusinessPage = lazy(() => import("./pages/BusinessPage.tsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.tsx"));
const SeoPage = lazy(() => import("./pages/SeoPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <span className="text-3xl" aria-hidden="true">🌼</span>
        <p className="mt-3 animate-pulse text-muted-foreground">ONAMCONNECT</p>
      </div>
    </div>
  );
}

class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  state = { hasError: false, message: "" };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message || "Unknown runtime error" };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-lg text-center">
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-2 text-sm text-muted-foreground">{this.state.message}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <HashScroll />
          <MobileBottomNav />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/generator" element={<GeneratorPage />} />
              <Route path="/card-studio" element={<CardStudioPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/improve" element={<ImprovePage />} />
              <Route path="/social-captions" element={<SocialCaptionsPage />} />
              <Route path="/business" element={<BusinessPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/onam-wishes" element={<SeoPage slug="onam-wishes" />} />
              <Route path="/malayalam-onam-wishes" element={<SeoPage slug="malayalam-onam-wishes" />} />
              <Route path="/onam-messages" element={<SeoPage slug="onam-messages" />} />
              <Route path="/onam-greetings" element={<SeoPage slug="onam-greetings" />} />
              <Route path="/onam-wishes-for-friends" element={<SeoPage slug="onam-wishes-for-friends" />} />
              <Route path="/onam-wishes-for-family" element={<SeoPage slug="onam-wishes-for-family" />} />
              <Route path="/onam-wishes-for-office" element={<SeoPage slug="onam-wishes-for-office" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
