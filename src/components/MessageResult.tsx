import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Heart, Pencil, RefreshCw, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShareButtons } from "./ShareButtons";
import { copyMessage, copyMessageWithSiteUrl } from "@/lib/sharing";
import { saveMessage, toggleFavorite, updateMessage } from "@/lib/storage";
import { toast } from "sonner";
import type { GeneratedMessage, GeneratorConfig } from "@/types/generator";
import { VARIATIONS } from "@/lib/generatorOptions";
import { snapdom } from "@zumer/snapdom";
import { Link } from "react-router";

interface MessageResultProps {
  message: GeneratedMessage;
  config: GeneratorConfig;
  loading?: boolean;
  onRegenerate: (variation?: string) => void;
  onMessageChange: (msg: GeneratedMessage) => void;
}

export function MessageResult({
  message,
  config,
  loading,
  onRegenerate,
  onMessageChange,
}: MessageResultProps) {
  const [editing, setEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message.message);
  const [editedShort, setEditedShort] = useState(message.shortMessage);
  const [editedSocial, setEditedSocial] = useState(message.socialMessage);
  const [activeTab, setActiveTab] = useState<"full" | "short" | "social">("full");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);

  const original = message;
  const display = {
    message: editing ? editedMessage : message.message,
    shortMessage: editing ? editedShort : message.shortMessage,
    socialMessage: editing ? editedSocial : message.socialMessage,
    hashtags: message.hashtags,
  };

  const activeText =
    activeTab === "full" ? display.message :
    activeTab === "short" ? display.shortMessage :
    display.socialMessage;

  useEffect(() => {
    const entry = saveMessage({
      message: message.message,
      shortMessage: message.shortMessage,
      socialMessage: message.socialMessage,
      hashtags: message.hashtags,
      recipient: config.recipient,
      recipientName: config.recipientName,
      language: config.language,
      tone: config.tone,
      style: config.style,
      occasion: config.occasion,
      purpose: config.purpose,
    });
    setSavedId(entry.id);
    setFavorited(entry.isFavorite);
    // Save once per generated/edited message text
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.message, message.shortMessage, message.socialMessage]);

  async function handleCopy() {
    const ok = await copyMessageWithSiteUrl(activeText);
    toast[ok ? "success" : "error"](ok ? "Copied to clipboard." : "Failed to copy.");
  }

  function handleSave() {
    const payload = {
      message: editedMessage,
      shortMessage: editedShort,
      socialMessage: editedSocial,
      hashtags: message.hashtags,
      recipient: config.recipient,
      recipientName: config.recipientName,
      language: config.language,
      tone: config.tone,
      style: config.style,
      occasion: config.occasion,
      purpose: config.purpose,
    };
    if (savedId) {
      updateMessage(savedId, payload);
      toast.success("Updated in your recent wishes.");
    } else {
      const entry = saveMessage(payload);
      setSavedId(entry.id);
      toast.success("Saved to your recent wishes.");
    }
  }

  function handleFavorite() {
    if (savedId) {
      toggleFavorite(savedId);
      setFavorited(!favorited);
      toast.success(favorited ? "Removed from favorites." : "Added to favorites.");
    } else {
      const entry = saveMessage({
        message: editedMessage,
        shortMessage: editedShort,
        socialMessage: editedSocial,
        hashtags: message.hashtags,
        recipient: config.recipient,
        recipientName: config.recipientName,
        language: config.language,
        tone: config.tone,
        style: config.style,
        occasion: config.occasion,
        purpose: config.purpose,
      });
      toggleFavorite(entry.id);
      setSavedId(entry.id);
      setFavorited(true);
      toast.success("Added to favorites.");
    }
  }

  function handleReset() {
    setEditedMessage(original.message);
    setEditedShort(original.shortMessage);
    setEditedSocial(original.socialMessage);
    toast.info("Reset to AI version.");
  }

  function handleDoneEditing() {
    onMessageChange({
      message: editedMessage,
      shortMessage: editedShort,
      socialMessage: editedSocial,
      hashtags: message.hashtags,
    });
    setEditing(false);
  }

  async function handleDownload() {
    const el = document.getElementById("onam-card-preview");
    if (!el) return;
    try {
      const canvas = await snapdom.toCanvas(el, { fast: true });
      const link = document.createElement("a");
      link.download = "onamconnect-wish-2026.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Card downloaded.");
    } catch {
      toast.error("Download failed. Please try again.");
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-bold tracking-tight">✨ Your Onam Wish</h2>
        <div className="flex flex-wrap gap-1">
          <Button variant="ghost" size="sm" onClick={() => (editing ? handleDoneEditing() : setEditing(true))} className="gap-1.5 cursor-pointer min-h-[48px]">
            <Pencil className="h-3.5 w-3.5" />{editing ? "Done" : "Edit"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onRegenerate()} disabled={loading} className="gap-1.5 cursor-pointer min-h-[48px]">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Regenerate
          </Button>
        </div>
      </div>

      <div className="flex gap-1 rounded-xl bg-muted p-1" role="tablist">
        {(["full", "short", "social"] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg px-3 py-3 text-sm font-medium transition-all cursor-pointer min-h-[48px] ${
              activeTab === tab ? "bg-background text-foreground" : "text-muted-foreground"
            }`}
          >
            {tab === "full" ? "Full" : tab === "short" ? "Short" : "Social"}
          </button>
        ))}
      </div>

      <div id="onam-card-preview" className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-accent/10 p-5 sm:p-6">
        {editing ? (
          <>
            <Textarea
              value={activeTab === "full" ? editedMessage : activeTab === "short" ? editedShort : editedSocial}
              onChange={(e) => {
                if (activeTab === "full") setEditedMessage(e.target.value);
                else if (activeTab === "short") setEditedShort(e.target.value);
                else setEditedSocial(e.target.value);
              }}
              rows={6}
              className="rounded-xl text-base leading-relaxed"
              aria-label="Edit message"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Characters: {activeText.length}
            </p>
            <Button variant="ghost" size="sm" onClick={handleReset} className="mt-2 gap-1.5 cursor-pointer min-h-[48px]">
              <RotateCcw className="h-3.5 w-3.5" /> Reset to AI version
            </Button>
          </>
        ) : (
          <p className="whitespace-pre-line text-base leading-relaxed">{activeText}</p>
        )}

        {message.hashtags?.length > 0 && activeTab === "social" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {message.hashtags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={async () => { await copyMessage(tag); toast.success(`Copied ${tag}`); }}
                className="rounded-full bg-primary/10 px-3 py-2 text-xs font-medium text-primary cursor-pointer min-h-[44px]"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex flex-wrap gap-2 w-full">
          {VARIATIONS.map((v) => (
            <button
              key={v.label}
              type="button"
              onClick={() => onRegenerate(v.variation)}
              disabled={loading}
              className="rounded-full border border-border/60 px-3 py-2 text-xs font-medium hover:border-primary/40 cursor-pointer min-h-[44px]"
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleCopy} variant="outline" size="sm" className="gap-1.5 cursor-pointer min-h-[48px] flex-1 sm:flex-none">
          <Copy className="h-3.5 w-3.5" /> Copy
        </Button>
        <Button onClick={handleSave} variant="outline" size="sm" className="gap-1.5 cursor-pointer min-h-[48px] flex-1 sm:flex-none">
          <Heart className="h-3.5 w-3.5" /> Save
        </Button>
        <Button onClick={handleFavorite} variant="outline" size="sm" className="gap-1.5 cursor-pointer min-h-[48px] flex-1 sm:flex-none">
          <Heart className={`h-3.5 w-3.5 ${favorited ? "fill-primary text-primary" : ""}`} /> Favorite
        </Button>
        <Button onClick={handleDownload} variant="outline" size="sm" className="gap-1.5 cursor-pointer min-h-[48px] flex-1 sm:flex-none">
          <Download className="h-3.5 w-3.5" /> Download
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-1.5 cursor-pointer min-h-[48px] flex-1 sm:flex-none">
          <Link to="/card-studio">🎨 Make Card</Link>
        </Button>
      </div>

      <ShareButtons
        message={display.message}
        shortMessage={display.shortMessage}
        socialMessage={display.socialMessage}
        hashtags={message.hashtags}
      />
    </motion.div>
  );
}
