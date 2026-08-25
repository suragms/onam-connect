import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAIActions } from "@/hooks/use-ai-actions";
import { getClientId } from "@/lib/clientId";
import { SOCIAL_PLATFORMS } from "@/lib/generatorOptions";
import { getXCharCount } from "@/lib/sharing";
import type { GeneratedMessage, GeneratorConfig } from "@/types/generator";
import { DEFAULT_GENERATOR_CONFIG } from "@/types/generator";
import { toast } from "sonner";

interface SocialCaptionGeneratorProps {
  onGenerated: (msg: GeneratedMessage, config: GeneratorConfig) => void;
  onError?: (err: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function SocialCaptionGenerator({ onGenerated, onError, onLoadingChange }: SocialCaptionGeneratorProps) {
  const { generateSocialCaption: captionAction } = useAIActions();
  const [platform, setPlatform] = useState("Instagram");
  const [loading, setLoading] = useState(false);
  const [lastCaption, setLastCaption] = useState("");

  async function handleGenerate() {
    setLoading(true);
    onLoadingChange?.(true);
    try {
      const result = await captionAction({
        clientId: getClientId(),
        platform,
        recipient: "Everyone",
        language: "English",
        tone: "Social Media",
      });
      setLastCaption(result.socialMessage);
      onGenerated(result as GeneratedMessage, { ...DEFAULT_GENERATOR_CONFIG, purpose: platform });
      toast.success(`${platform} caption ready!`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Caption generation failed.";
      onError?.(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <h3 className="font-bold tracking-tight">📸 Onam Social Caption AI</h3>
      <p className="mt-1 text-sm text-muted-foreground">Platform-optimized captions with hashtags.</p>
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="mt-3 w-full rounded-xl border border-input bg-background px-4 py-3.5 text-base min-h-[48px] sm:min-h-[48px] lg:min-h-[44px]"
      >
        {SOCIAL_PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <Button onClick={handleGenerate} disabled={loading} className="mt-3 w-full cursor-pointer min-h-[48px] sm:min-h-[48px] lg:min-h-[44px]">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Generate Caption
      </Button>
      {lastCaption && platform === "X" && (
        <p className="mt-2 text-xs text-muted-foreground">
          Characters: {getXCharCount(lastCaption)} / 280
        </p>
      )}
    </div>
  );
}
