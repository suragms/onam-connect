import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  GeneratorForm,
  type GeneratedMessage,
  type GeneratorConfig,
  type GeneratorFormHandle,
} from "@/components/GeneratorForm";
import { MessageResult } from "@/components/MessageResult";
import { MessageImprover } from "@/components/MessageImprover";
import { SocialCaptionGenerator } from "@/components/SocialCaptionGenerator";
import { TrendingWishes } from "@/components/TrendingWishes";
import { BusinessMode } from "@/components/BusinessMode";
import { LoadingSteps } from "@/components/LoadingSteps";
import { AiAssistantFab } from "@/components/AiAssistantFab";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import type { GeneratorConfig as Config } from "@/types/generator";

function parseInitialConfig(params: URLSearchParams): Partial<Config> {
  const config: Partial<Config> = {};
  const keys = ["recipient", "language", "tone", "style", "occasion", "purpose", "length"] as const;
  for (const key of keys) {
    const val = params.get(key);
    if (val) config[key] = val;
  }
  return config;
}

export default function GeneratorPage() {
  const [searchParams] = useSearchParams();
  const formRef = useRef<GeneratorFormHandle>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<GeneratedMessage | null>(null);
  const [config, setConfig] = useState<GeneratorConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerated = useCallback((msg: GeneratedMessage, cfg: GeneratorConfig) => {
    setMessage(msg);
    setConfig(cfg);
    setError(null);
    setGenerating(false);
    toast.success("Your Onam wish is ready!");
  }, []);

  const handleError = useCallback((err: string) => {
    setError(err);
    setGenerating(false);
  }, []);

  const handleRegenerate = useCallback(async (variation?: string) => {
    if (!formRef.current) return;
    setGenerating(true);
    setError(null);
    toast.info("Creating a new wish…");
    await formRef.current.generate(variation);
  }, []);

  const handleTrendingSelect = useCallback((partial: Partial<GeneratorConfig>) => {
    formRef.current?.applyConfig(partial);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleApplyAndGenerate = useCallback(async (partial: Partial<GeneratorConfig>) => {
    if (!formRef.current) return;
    setGenerating(true);
    setError(null);
    toast.info("Creating your wish…");
    await formRef.current.generate(undefined, partial);
  }, []);

  const handleFabGenerate = useCallback(async () => {
    if (!formRef.current) return;
    setGenerating(true);
    setError(null);
    await formRef.current.generate();
  }, []);

  useEffect(() => {
    if (message && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [message]);

  const showResult = (message && !error) || generating;
  const showPlaceholder = !showResult && !error;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            ✨ Create Your <span className="onam-text-gradient">Onam Wish</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            AI-powered Onam wishes in Malayalam, English or Manglish — ready to share in seconds.
          </p>
        </div>

        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="space-y-6 order-2 lg:order-1">
            <GeneratorForm
              ref={formRef}
              initialConfig={parseInitialConfig(searchParams)}
              onGenerated={handleGenerated}
              onError={handleError}
              onLoadingChange={setGenerating}
            />
            <TrendingWishes onSelect={handleTrendingSelect} />
            <MessageImprover
              onImproved={handleGenerated}
              onError={handleError}
              onLoadingChange={setGenerating}
            />
            <SocialCaptionGenerator
              onGenerated={handleGenerated}
              onError={handleError}
              onLoadingChange={setGenerating}
            />
            <BusinessMode
              onGenerated={handleGenerated}
              onError={handleError}
              onLoadingChange={setGenerating}
            />
          </div>

          <div ref={resultRef} className="order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center"
                  role="alert"
                >
                  <p className="text-sm font-medium text-destructive">{error}</p>
                  <p className="mt-1 text-xs text-destructive/70">Please try again in a moment.</p>
                </motion.div>
              )}

              {showResult && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {message && config ? (
                    <MessageResult
                      message={message}
                      config={config}
                      loading={generating}
                      onRegenerate={handleRegenerate}
                      onMessageChange={setMessage}
                    />
                  ) : generating ? (
                    <div className="rounded-2xl border border-border/60 bg-card p-6 text-center">
                      <p className="font-medium">Creating your Onam wish…</p>
                      <div className="mt-4">
                        <LoadingSteps />
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              )}

              {showPlaceholder && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20"
                >
                  <div className="text-center px-4">
                    <span className="text-3xl sm:text-4xl" aria-hidden="true">🌼</span>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Your AI-generated Onam wish will appear here.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <AiAssistantFab
        loading={generating}
        hasMessage={!!message}
        onApplyAndGenerate={handleApplyAndGenerate}
        onRegenerate={handleRegenerate}
        onGenerate={handleFabGenerate}
      />
      <Footer />
    </div>
  );
}
