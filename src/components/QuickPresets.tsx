import type { GeneratorConfig } from "@/types/generator";
import { QUICK_PRESETS } from "@/lib/generatorOptions";

interface QuickPresetsProps {
  onSelect: (config: Partial<GeneratorConfig>) => void;
}

export function QuickPresets({ onSelect }: QuickPresetsProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Quick Generate
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onSelect(preset.config as Partial<GeneratorConfig>)}
            className="rounded-full border border-border/60 bg-muted/40 px-3 py-2 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5 cursor-pointer min-h-[44px] flex-1 sm:flex-none"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
