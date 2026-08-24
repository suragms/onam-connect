import { useCallback, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MessageImprover } from "@/components/MessageImprover";
import { toast } from "sonner";
import type { GeneratedMessage, GeneratorConfig } from "@/types/generator";

export default function ImprovePage() {
  const [message, setMessage] = useState<GeneratedMessage | null>(null);
  const [config, setConfig] = useState<GeneratorConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImproved = useCallback((msg: GeneratedMessage, cfg: GeneratorConfig) => {
    setMessage(msg);
    setConfig(cfg);
    setError(null);
    setLoading(false);
    toast.success("Message improved!");
  }, []);

  const handleError = useCallback((err: string) => {
    setError(err);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">🤖 Improve Message</h1>
        <p className="mt-2 text-muted-foreground">Refine and polish your Onam wishes with AI assistance.</p>
        <MessageImprover
          onImproved={handleImproved}
          onError={handleError}
          onLoadingChange={setLoading}
        />
      </main>
      <Footer />
    </div>
  );
}