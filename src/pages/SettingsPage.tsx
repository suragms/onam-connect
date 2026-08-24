import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Palette, Bell, Database, Trash2, Shield, Info } from "lucide-react";
import { toast } from "sonner";
import { clearHistory } from "@/lib/storage";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [animations, setAnimations] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("onamconnect-dark-mode");
    if (saved) {
      setDarkMode(saved === "true");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("onamconnect-dark-mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("onamconnect-dark-mode", "false");
    }
  }, [darkMode]);

  useEffect(() => {
    if (!animations) {
      document.documentElement.style.setProperty("--animation-duration", "0s");
    } else {
      document.documentElement.style.removeProperty("--animation-duration");
    }
  }, [animations]);

  function handleClearData() {
    if (confirm("Are you sure you want to clear all saved wishes and history? This cannot be undone.")) {
      clearHistory();
      toast.success("All data cleared.");
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">⚙️ Settings</h1>
        <p className="mt-2 text-muted-foreground">Customize your ONAMCONNECT experience.</p>

        <section className="mt-8 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Moon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Dark Mode</label>
                <p className="text-sm text-muted-foreground">Use dark theme for the app</p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                aria-label="Toggle dark mode"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Manage notification preferences</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Push Notifications</label>
                <p className="text-sm text-muted-foreground">Receive updates about new features</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                aria-label="Toggle notifications"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Animations</h2>
                <p className="text-sm text-muted-foreground">Reduce motion for accessibility</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Reduce Motion</label>
                <p className="text-sm text-muted-foreground">Disable non-essential animations</p>
              </div>
              <Switch
                checked={!animations}
                onCheckedChange={(v) => setAnimations(!v)}
                aria-label="Toggle reduced motion"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Data Management</h2>
                <p className="text-sm text-muted-foreground">Clear all saved data</p>
              </div>
            </div>
            <Button variant="destructive" onClick={handleClearData} className="w-full sm:w-auto cursor-pointer min-h-[44px]">
              <Trash2 className="h-4 w-4" />
              Clear All Saved Data
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              This will permanently delete all your saved wishes, favorites, and history.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Privacy</h2>
                <p className="text-sm text-muted-foreground">Your data stays on your device</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• No account required — everything works anonymously</p>
              <p>• All data stored locally in your browser</p>
              <p>• No tracking, analytics, or third-party cookies</p>
              <p>• No data sent to servers except for AI generation</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">About</h2>
                <p className="text-sm text-muted-foreground">Version information</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>ONAMCONNECT v1.0.0</p>
              <p>Built with React, TypeScript, and Tailwind CSS</p>
              <p>Powered by Google Gemini AI</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}