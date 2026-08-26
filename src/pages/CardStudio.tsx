import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CARD_TEMPLATES, CARD_FORMATS } from "@/lib/generatorOptions";
import { snapdom } from "@zumer/snapdom";
import { toast } from "sonner";
import { Download, Share2 } from "lucide-react";
import { shareImage } from "@/lib/sharing";

const TEMPLATE_STYLES: Record<string, string> = {
  "Traditional Kerala": "from-green-800 via-green-700 to-emerald-900 text-white",
  Pookalam: "from-orange-400 via-yellow-300 to-green-600 text-green-950",
  Mahabali: "from-amber-700 via-yellow-600 to-orange-800 text-white",
  Kasavu: "from-yellow-100 via-amber-50 to-yellow-200 text-green-900",
  "Golden Lamp": "from-yellow-500 via-amber-400 to-orange-500 text-green-950",
  Floral: "from-pink-200 via-rose-100 to-green-100 text-green-900",
  "Kerala Nature": "from-green-600 via-teal-500 to-blue-400 text-white",
  "Modern Minimal": "from-neutral-100 via-white to-neutral-50 text-neutral-900",
  "Elegant Gold": "from-neutral-900 via-amber-900 to-yellow-800 text-amber-100",
  "Social Media": "from-purple-600 via-pink-500 to-orange-400 text-white",
};

export default function CardStudioPage() {
  const [template, setTemplate] = useState("Traditional Kerala");
  const [format, setFormat] = useState(CARD_FORMATS[0]);
  const [message, setMessage] = useState("Wishing you a joyous and prosperous Onam filled with love, laughter, and the warmth of togetherness.");
  const [recipientName, setRecipientName] = useState("");
  const [signature, setSignature] = useState("");
  const [fontSize, setFontSize] = useState(18);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("center");
  const cardRef = useRef<HTMLDivElement>(null);

  async function handleDownload() {
    if (!cardRef.current) return;
    try {
      const canvas = await snapdom.toCanvas(cardRef.current, { fast: true, scale: 2 });
      const link = document.createElement("a");
      link.download = `onamconnect-card-${format.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Card downloaded!");
    } catch {
      toast.error("Download failed.");
    }
  }

  async function handleShareImage() {
    if (!cardRef.current) return;
    try {
      const canvas = await snapdom.toCanvas(cardRef.current, { fast: true, scale: 2 });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "onamconnect-card.png", { type: "image/png" });
        const ok = await shareImage(file, "ONAMCONNECT", message);
        if (!ok) {
          await handleDownload();
          toast.info("Image downloaded — share from your gallery.");
        }
      });
    } catch {
      toast.error("Share failed.");
    }
  }

  const aspectRatio = format.width / format.height;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">🎨 Onam Card Studio</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">Design beautiful greeting cards and download as PNG.</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 order-2 lg:order-1">
            <div>
              <label className="text-sm font-medium">Template</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {CARD_TEMPLATES.map((t) => (
                  <button key={t} type="button" onClick={() => setTemplate(t)} className={`rounded-full border border-border/60 bg-muted/40 px-3 py-2.5 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5 cursor-pointer min-h-[44px] sm:min-h-[40px] lg:min-h-[36px] flex-1 sm:flex-none text-wrap ${template === t ? "border-primary bg-primary/10" : ""}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Format</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {CARD_FORMATS.map((f) => (
                  <button key={f.id} type="button" onClick={() => setFormat(f)} className={`rounded-full border border-border/60 bg-muted/40 px-3 py-2.5 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5 cursor-pointer min-h-[44px] sm:min-h-[40px] lg:min-h-[36px] flex-1 sm:flex-none text-wrap ${format.id === f.id ? "border-primary bg-primary/10" : ""}`}>
                    {f.label} ({f.width}×{f.height})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="mt-2 rounded-xl text-base" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Recipient Name</label>
                <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Anandu" className="mt-2 rounded-xl min-h-[48px] text-base" />
              </div>
              <div>
                <label className="text-sm font-medium">Signature</label>
                <Input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="With love" className="mt-2 rounded-xl min-h-[48px] text-base" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Font Size: {fontSize}px</label>
                <input type="range" min={14} max={28} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="mt-2 w-full" />
              </div>
              <div>
                <label className="text-sm font-medium">Alignment</label>
                <select value={alignment} onChange={(e) => setAlignment(e.target.value as typeof alignment)} className="mt-2 w-full rounded-xl border px-4 py-3.5 text-base min-h-[48px] sm:min-h-[48px] lg:min-h-[44px]">
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={handleDownload} className="gap-2 cursor-pointer min-h-[48px] flex-1 sm:flex-none">
                <Download className="h-4 w-4" /> Download PNG
              </Button>
              <Button onClick={handleShareImage} variant="outline" className="gap-2 cursor-pointer min-h-[48px] flex-1 sm:flex-none">
                <Share2 className="h-4 w-4" /> Share Image
              </Button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-3 text-sm font-medium">Preview</p>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/20 p-4">
              <div
                ref={cardRef}
                className={`mx-auto flex flex-col justify-between bg-gradient-to-br p-6 sm:p-8 ${TEMPLATE_STYLES[template] || TEMPLATE_STYLES["Traditional Kerala"]}`}
                style={{
                  aspectRatio: String(aspectRatio),
                  maxWidth: "100%",
                  width: format.width > format.height ? "100%" : "min(280px, 100%)",
                  fontSize: `${fontSize}px`,
                  textAlign: alignment,
                }}
              >
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-80">🌼 ONAMCONNECT</p>
                  <p className="mt-2 text-xl sm:text-2xl font-bold">Happy Onam</p>
                  {recipientName && <p className="mt-1 text-sm sm:text-lg opacity-90">Dear {recipientName},</p>}
                </div>
                <p className="my-4 sm:my-6 leading-relaxed whitespace-pre-line text-sm sm:text-base">{message}</p>
                <div>
                  {signature && <p className="text-xs sm:text-sm opacity-90">— {signature}</p>}
                  <p className="mt-2 text-xs opacity-70">#Onam #HappyOnam #ONAMCONNECT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
