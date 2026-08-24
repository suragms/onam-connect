import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  shareToWhatsApp, shareToTelegram, shareToX, shareToFacebook,
  shareToFacebookWithFallback, nativeShare, canNativeShare,
  copyMessage, shareViaSignal, shareViaArattai, getXCharCount, getSiteUrl,
} from "@/lib/sharing";
import { toast } from "sonner";

interface ShareButtonsProps {
  message: string;
  shortMessage?: string;
  socialMessage?: string;
  hashtags?: string[];
}

export function ShareButtons({ message, shortMessage, socialMessage, hashtags }: ShareButtonsProps) {
  const [showMore, setShowMore] = useState(false);

  const hashtagStr = hashtags?.length ? hashtags.join(" ") : "";
  const fullMessage = hashtagStr ? `${message}\n\n${hashtagStr}` : message;
  const socialFull = socialMessage
    ? (hashtagStr ? `${socialMessage}\n\n${hashtagStr}` : socialMessage)
    : fullMessage;
  const shortFull = shortMessage || message;
  const xCount = getXCharCount(socialFull);

  const primaryPlatforms = [
    { name: "WhatsApp", icon: "🟢", color: "bg-green-600 hover:bg-green-700 text-white", action: () => shareToWhatsApp(fullMessage) },
    { name: "Telegram", icon: "🔵", color: "bg-sky-500 hover:bg-sky-600 text-white", action: () => shareToTelegram(fullMessage, getSiteUrl()) },
    { name: "X", icon: "⚫", color: "bg-neutral-900 hover:bg-neutral-800 text-white", action: () => { shareToX(socialFull); toast.info(`Characters: ${xCount} / 280`); } },
    { name: "Facebook", icon: "🔵", color: "bg-blue-700 hover:bg-blue-800 text-white", action: async () => {
      await shareToFacebookWithFallback(fullMessage);
      toast.success("Message copied. Opening Facebook to share.");
    }},
  ];

  const morePlatforms = [
    { name: "Signal", icon: "💬", action: async () => {
      const result = await shareViaSignal(fullMessage);
      if (result === "native") toast.success("Shared via your device.");
      else if (result === "copied") toast.info("Message copied. Signal sharing depends on your device/browser.");
      else toast.error("Could not share.");
    }},
    { name: "Arattai", icon: "🟠", action: async () => {
      const result = await shareViaArattai(fullMessage);
      if (result === "native") toast.success("Shared via your device.");
      else if (result === "copied") toast.info("Message copied. Open Arattai to paste and share.");
      else toast.error("Could not share.");
    }},
    { name: "Copy Message", icon: "📋", action: async () => {
      const ok = await copyMessage(fullMessage);
      toast[ok ? "success" : "error"](ok ? "Message copied!" : "Failed to copy.");
    }},
  ];

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Share2 className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold tracking-tight">📤 Share Your Onam Wish</span>
      </div>

      {xCount > 0 && (
        <p className="mb-3 text-xs text-muted-foreground">X characters: {xCount} / 280</p>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {primaryPlatforms.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={p.action}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition-all active:scale-[0.97] cursor-pointer min-h-[48px] ${p.color}`}
          >
            <span aria-hidden="true">{p.icon}</span>
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => shareToWhatsApp(shortFull)} className="rounded-lg border border-border/60 px-3 py-2.5 text-xs cursor-pointer min-h-[44px] flex-1 sm:flex-none">
          WhatsApp (Short)
        </button>
        <button type="button" onClick={() => shareToWhatsApp(socialFull)} className="rounded-lg border border-border/60 px-3 py-2.5 text-xs cursor-pointer min-h-[44px] flex-1 sm:flex-none">
          WhatsApp (Social)
        </button>
      </div>

      <Button
        variant="outline"
        onClick={() => setShowMore(!showMore)}
        className="mt-3 w-full cursor-pointer min-h-[44px]"
      >
        {showMore ? "Hide" : "More sharing options"}
      </Button>

      {showMore && (
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {morePlatforms.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={p.action}
              className="flex items-center justify-center gap-2 rounded-xl border border-border/60 px-3 py-3 text-sm font-medium hover:bg-accent/50 cursor-pointer min-h-[48px]"
            >
              <span aria-hidden="true">{p.icon}</span>
              {p.name}
            </button>
          ))}
        </div>
      )}

      {canNativeShare() && (
        <Button
          onClick={() => nativeShare("ONAMCONNECT", fullMessage, getSiteUrl())}
          variant="outline"
          className="mt-3 w-full gap-2 cursor-pointer min-h-[44px]"
        >
          <Share2 className="h-4 w-4" />
          📤 Share Everywhere
        </Button>
      )}
    </div>
  );
}
