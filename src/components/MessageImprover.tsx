import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIActions } from "@/hooks/use-ai-actions";
import { getClientId } from "@/lib/clientId";
import { IMPROVEMENTS } from "@/lib/generatorOptions";
import type { GeneratedMessage, GeneratorConfig } from "@/types/generator";
import { DEFAULT_GENERATOR_CONFIG } from "@/types/generator";
import { toast } from "sonner";

interface MessageImproverProps {
  onImproved: (msg: GeneratedMessage, config: GeneratorConfig) => void;
  onError?: (err: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function MessageImprover({ onImproved, onError, onLoadingChange }: MessageImproverProps) {
  const { improveMessage: improveAction } = useAIActions();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleImprove(improvement: string) {
    if (!text.trim()) {
      toast.error("Paste a message to improve.");
      return;
    }
    setLoading(true);
    onLoadingChange?.(true);
    try {
      const result = await improveAction({
        clientId: getClientId(),
        message: text.trim(),
        improvement,
      });
      onImproved(result as GeneratedMessage, DEFAULT_GENERATOR_CONFIG);
      toast.success("Message improved!");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Improvement failed.";
      onError?.(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <h3 className="font-bold tracking-tight">🤖 Improve My Message</h3>
      <p className="mt-1 text-sm text-muted-foreground">Paste your wish and let AI refine it.</p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Happy Onam everyone…"
        rows={3}
        className="mt-3 rounded-xl"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {IMPROVEMENTS.map((imp) => (
          <button
            key={imp}
            type="button"
            disabled={loading}
            onClick={() => handleImprove(imp)}
            className="rounded-full border border-border/60 px-3 py-2 text-xs font-medium hover:border-primary/40 cursor-pointer min-h-[44px] disabled:opacity-50 flex-1 sm:flex-none"
          >
            {imp}
          </button>
        ))}
      </div>
      {loading && (
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Improving…
        </p>
      )}
    </div>
  );
}
