import { useCallback, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessMode } from "@/components/BusinessMode";
import { toast } from "sonner";
import type { GeneratedMessage, GeneratorConfig } from "@/types/generator";

export default function BusinessPage() {
  const [message, setMessage] = useState<GeneratedMessage | null>(null);
  const [config, setConfig] = useState<GeneratorConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerated = useCallback((msg: GeneratedMessage, cfg: GeneratorConfig) => {
    setMessage(msg);
    setConfig(cfg);
    setError(null);
    setLoading(false);
    toast.success("Business greeting ready!");
  }, []);

  const handleError = useCallback((err: string) => {
    setError(err);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">🏢 Business Wishes</h1>
        <p className="mt-2 text-muted-foreground">Professional Onam wishes for clients, colleagues, and business partners.</p>
        <BusinessMode
          onGenerated={handleGenerated}
          onError={handleError}
          onLoadingChange={setLoading}
        />
      </main>
      <Footer />
    </div>
  );
}