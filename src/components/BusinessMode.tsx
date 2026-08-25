import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIActions } from "@/hooks/use-ai-actions";
import { getClientId } from "@/lib/clientId";
import type { GeneratedMessage, GeneratorConfig } from "@/types/generator";
import { toast } from "sonner";

interface BusinessModeProps {
  onGenerated: (msg: GeneratedMessage, config: GeneratorConfig) => void;
  onError?: (err: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function BusinessMode({ onGenerated, onError, onLoadingChange }: BusinessModeProps) {
  const { generateMessage: generateAction } = useAIActions();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [customerType, setCustomerType] = useState("Customers");

  async function handleGenerate() {
    if (!businessName.trim()) {
      toast.error("Enter your business name.");
      return;
    }
    setLoading(true);
    onLoadingChange?.(true);
    try {
      const config: GeneratorConfig = {
        recipient: "Business Client",
        recipientName: businessName.trim(),
        language: "English",
        tone: "Professional",
        style: "Professional",
        occasion: "Business Onam",
        purpose: "Business Greeting",
        length: "Medium",
        emojiLevel: "Minimal",
        instructions: `Business: ${businessName}. Industry: ${industry || "general"}. Customer type: ${customerType}. Include company branding tone.`,
      };
      const result = await generateAction({ clientId: getClientId(), ...config });
      onGenerated(result as GeneratedMessage, config);
      toast.success("Business greeting ready!");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Generation failed.";
      onError?.(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 text-left font-bold tracking-tight cursor-pointer min-h-[44px]"
      >
        <Building2 className="h-5 w-5 text-primary" />
        🏢 Business Onam Wishes
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name" className="rounded-xl min-h-[48px] sm:min-h-[48px] lg:min-h-[44px] text-base" />
          <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry (optional)" className="rounded-xl min-h-[48px] sm:min-h-[48px] lg:min-h-[44px] text-base" />
          <select value={customerType} onChange={(e) => setCustomerType(e.target.value)} className="w-full rounded-xl border px-4 py-3.5 text-base min-h-[48px] sm:min-h-[48px] lg:min-h-[44px]">
            <option>Customers</option>
            <option>Clients</option>
            <option>Employees</option>
            <option>Partners</option>
          </select>
          <Button onClick={handleGenerate} disabled={loading} className="w-full cursor-pointer min-h-[48px] sm:min-h-[48px] lg:min-h-[44px]">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Generate Business Greeting
          </Button>
        </div>
      )}
    </div>
  );
}
