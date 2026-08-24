import {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAIActions } from "@/hooks/use-ai-actions";
import { LoadingSteps } from "@/components/LoadingSteps";
import { QuickPresets } from "@/components/QuickPresets";
import { getClientId } from "@/lib/clientId";
import { validateGeneratorConfig } from "@/lib/validation";
import {
  RECIPIENTS, LANGUAGES, TONES, STYLES, OCCASIONS,
  PURPOSES, LENGTHS, EMOJI_LEVELS,
} from "@/lib/generatorOptions";
import type { GeneratedMessage, GeneratorConfig } from "@/types/generator";
import { DEFAULT_GENERATOR_CONFIG } from "@/types/generator";

export type { GeneratedMessage, GeneratorConfig };

export interface GeneratorFormHandle {
  generate: (variation?: string, configOverride?: Partial<GeneratorConfig>) => Promise<void>;
  applyConfig: (partial: Partial<GeneratorConfig>) => void;
  getConfig: () => GeneratorConfig;
}

interface GeneratorFormProps {
  onGenerated: (msg: GeneratedMessage, config: GeneratorConfig) => void;
  onError: (err: string) => void;
  onLoadingChange?: (loading: boolean) => void;
  initialConfig?: Partial<GeneratorConfig>;
}

export const GeneratorForm = forwardRef<GeneratorFormHandle, GeneratorFormProps>(
  function GeneratorForm({ onGenerated, onError, onLoadingChange, initialConfig }, ref) {
    const { generateMessage: generateAction } = useAIActions();
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState<GeneratorConfig>({
      ...DEFAULT_GENERATOR_CONFIG,
      ...initialConfig,
    });

    const update = useCallback((partial: Partial<GeneratorConfig>) => {
      setConfig((prev) => ({ ...prev, ...partial }));
    }, []);

    const handleGenerate = useCallback(async (variation?: string, configOverride?: Partial<GeneratorConfig>) => {
      const nextConfig = configOverride ? { ...config, ...configOverride } : config;
      if (configOverride) {
        setConfig(nextConfig);
      }
      const err = validateGeneratorConfig(nextConfig);
      if (err) {
        onError(err);
        return;
      }
      setLoading(true);
      onLoadingChange?.(true);
      try {
        const result = await generateAction({
          clientId: getClientId(),
          ...nextConfig,
          variation,
        });
        onGenerated(result as GeneratedMessage, nextConfig);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "We couldn't create your wish right now. Please try again.";
        onError(msg);
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    }, [config, generateAction, onGenerated, onError, onLoadingChange]);

    useImperativeHandle(ref, () => ({
      generate: handleGenerate,
      applyConfig: update,
      getConfig: () => config,
    }), [handleGenerate, update, config]);

    const selectClass =
      "w-full rounded-xl border border-input bg-background px-4 py-3 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[48px]";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border/60 bg-card p-4 sm:p-6"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">✨ Create Your Onam Wish</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">AI-powered wishes, created in seconds.</p>
          </div>
        </div>

        <QuickPresets onSelect={(partial) => update(partial)} />

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="recipient" className="mb-1.5 block text-sm font-medium">Recipient</label>
            <select id="recipient" value={config.recipient} onChange={(e) => update({ recipient: e.target.value })} className={selectClass}>
              {RECIPIENTS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="recipientName" className="mb-1.5 block text-sm font-medium">
              Recipient Name <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="recipientName"
              value={config.recipientName}
              onChange={(e) => update({ recipientName: e.target.value })}
              placeholder="e.g. Anandu"
              className="rounded-xl min-h-[48px] text-base"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="language" className="mb-1.5 block text-sm font-medium">Language</label>
              <select id="language" value={config.language} onChange={(e) => update({ language: e.target.value })} className={selectClass}>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="tone" className="mb-1.5 block text-sm font-medium">Tone</label>
              <select id="tone" value={config.tone} onChange={(e) => update({ tone: e.target.value })} className={selectClass}>
                {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="style" className="mb-1.5 block text-sm font-medium">Style</label>
              <select id="style" value={config.style} onChange={(e) => update({ style: e.target.value })} className={selectClass}>
                {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="purpose" className="mb-1.5 block text-sm font-medium">Message Purpose</label>
              <select id="purpose" value={config.purpose} onChange={(e) => update({ purpose: e.target.value })} className={selectClass}>
                {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Length</label>
              <div className="flex gap-2">
                {LENGTHS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => update({ length: l })}
                    className={`flex-1 rounded-xl border px-2 py-3 text-sm font-medium transition-all min-h-[48px] cursor-pointer ${
                      config.length === l
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="emoji" className="mb-1.5 block text-sm font-medium">Emojis</label>
              <select id="emoji" value={config.emojiLevel} onChange={(e) => update({ emojiLevel: e.target.value })} className={selectClass}>
                {EMOJI_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="occasion" className="mb-1.5 block text-sm font-medium">Occasion</label>
            <select id="occasion" value={config.occasion} onChange={(e) => update({ occasion: e.target.value })} className={selectClass}>
              {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="instructions" className="mb-1.5 block text-sm font-medium">
              Custom Instructions <span className="text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              id="instructions"
              value={config.instructions}
              onChange={(e) => update({ instructions: e.target.value })}
              placeholder="Any special details for your wish…"
              rows={3}
              className="rounded-xl text-base"
            />
          </div>

          <Button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="w-full rounded-xl py-6 text-base font-semibold min-h-[52px] cursor-pointer"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating your Onam wish…
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                ✨ Generate
              </>
            )}
          </Button>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <LoadingSteps />
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  },
);
