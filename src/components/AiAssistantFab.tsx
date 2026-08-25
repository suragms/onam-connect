import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Wand2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { QUICK_PRESETS, VARIATIONS } from "@/lib/generatorOptions";
import type { GeneratorConfig } from "@/types/generator";
import { cn } from "@/lib/utils";

const ASSISTANT_PRESETS = QUICK_PRESETS.slice(0, 4);

interface AiAssistantFabProps {
  loading?: boolean;
  hasMessage?: boolean;
  onApplyAndGenerate: (partial: Partial<GeneratorConfig>) => void;
  onRegenerate: (variation?: string) => void;
  onGenerate: () => void;
}

export function AiAssistantFab({
  loading,
  hasMessage,
  onApplyAndGenerate,
  onRegenerate,
  onGenerate,
}: AiAssistantFabProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  function handlePreset(partial: Partial<GeneratorConfig>) {
    onApplyAndGenerate(partial);
    setOpen(false);
  }

  function handleVariation(variation: string) {
    onRegenerate(variation);
    setOpen(false);
  }

  function handleSendPrompt() {
    const text = prompt.trim();
    if (!text) return;
    if (hasMessage) {
      onRegenerate(text);
    } else {
      onApplyAndGenerate({ instructions: text });
    }
    setPrompt("");
    setOpen(false);
  }

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open ONAM AI assistant"
        onClick={() => setOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.92 }}
        className={cn(
          "fixed z-[45] flex flex-col items-center justify-center gap-0.5 rounded-full shadow-2xl cursor-pointer",
          "h-16 w-16 bg-primary text-primary-foreground",
          "ring-4 ring-background hover:brightness-105 transition-[filter,box-shadow]",
          /* WhatsApp Meta AI style: float above fixed bottom nav */
          "bottom-[calc(var(--mobile-nav-height,72px)+1rem+env(safe-area-inset-bottom,0px))] right-4",
          "lg:bottom-8 lg:right-8",
        )}
      >
        <span
          className="pointer-events-none absolute -inset-1 rounded-full bg-primary/30 animate-ping [animation-duration:2.5s] opacity-40"
          aria-hidden="true"
        />
        <Sparkles className="relative h-6 w-6" strokeWidth={2.4} />
        <span className="relative text-[9px] font-bold leading-none tracking-wide">AI</span>
      </motion.button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] rounded-t-3xl border-t border-border/60 px-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
        >
          <SheetHeader className="border-b border-border/40 px-5 pb-4 text-left">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <SheetTitle className="text-base">ONAM AI Assistant</SheetTitle>
                <p className="text-xs font-normal text-muted-foreground">
                  Quick wishes & smart tweaks — like Meta AI
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex max-h-[calc(85vh-8rem)] flex-col overflow-y-auto px-5 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick create
            </p>
            <div className="flex flex-wrap gap-2">
              {ASSISTANT_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  disabled={loading}
                  onClick={() => handlePreset(preset.config)}
                  className="rounded-full border border-border/60 bg-muted/50 px-3 py-2 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5 cursor-pointer disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {hasMessage && (
              <>
                <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Refine your wish
                </p>
                <div className="flex flex-wrap gap-2">
                  {VARIATIONS.slice(0, 4).map((v) => (
                    <button
                      key={v.label}
                      type="button"
                      disabled={loading}
                      onClick={() => handleVariation(v.variation)}
                      className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-2 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5 cursor-pointer disabled:opacity-50"
                    >
                      <Wand2 className="h-3 w-3" />
                      {v.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            <AnimatePresence>
              {!hasMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-2xl bg-muted/40 p-4 text-sm text-muted-foreground"
                >
                  <p>Ask me anything — family wishes, Malayalam messages, office greetings, and more.</p>
                  <Button
                    type="button"
                    size="sm"
                    className="mt-3 cursor-pointer"
                    disabled={loading}
                    onClick={() => { onGenerate(); setOpen(false); }}
                  >
                    Generate with current settings
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5 border-t border-border/40 pt-4">
              <div className="flex items-end gap-2">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={hasMessage ? "Tell AI how to change your wish…" : "Describe the wish you want…"}
                  rows={2}
                  className="min-h-[44px] resize-none rounded-2xl"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendPrompt();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  disabled={loading || !prompt.trim()}
                  onClick={handleSendPrompt}
                  className="h-11 w-11 shrink-0 rounded-full cursor-pointer"
                  aria-label="Send to AI"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
