import { Share2 } from "lucide-react";
import {
  shareToWhatsApp,
  shareToTelegram,
  shareToX,
  canNativeShare,
  nativeShare,
  copyMessage,
} from "@/lib/sharing";
import { toast } from "sonner";

const SHARE_ACTIONS = [
  { label: "WhatsApp", icon: "💬", action: (msg: string) => shareToWhatsApp(msg) },
  { label: "Telegram", icon: "✈️", action: (msg: string) => shareToTelegram(msg) },
  {
    label: "X",
    icon: "𝕏",
    action: (msg: string) => {
      shareToX(msg);
      toast.info("Opening X to share…");
    },
  },
] as const;

interface ShareIconRowProps {
  message: string;
  className?: string;
}

export function ShareIconRow({ message, className = "" }: ShareIconRowProps) {
  async function handleNativeShare() {
    const ok = await nativeShare("ONAMCONNECT", message);
    if (!ok) {
      const copied = await copyMessage(message);
      toast[copied ? "success" : "error"](copied ? "Copied — paste to share." : "Share failed.");
    }
  }

  return (
    <div className={`flex items-center gap-1.5 border-t border-border/40 pt-3 ${className}`}>
      <span className="mr-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Share
      </span>
      {SHARE_ACTIONS.map((s) => (
        <button
          key={s.label}
          type="button"
          title={`Share on ${s.label}`}
          aria-label={`Share on ${s.label}`}
          onClick={() => s.action(message)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-border/60 bg-background text-sm transition-colors hover:border-primary/40 hover:bg-primary/5 cursor-pointer min-h-[44px]"
        >
          <span aria-hidden="true">{s.icon}</span>
        </button>
      ))}
      {canNativeShare() && (
        <button
          type="button"
          title="Share everywhere"
          aria-label="Share everywhere"
          onClick={handleNativeShare}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 cursor-pointer min-h-[44px]"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
