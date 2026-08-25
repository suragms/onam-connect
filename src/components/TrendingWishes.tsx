import type { GeneratorConfig } from "@/types/generator";
import { TRENDING } from "@/lib/generatorOptions";

interface TrendingWishesProps {
  onSelect: (config: Partial<GeneratorConfig>) => void;
}

export function TrendingWishes({ onSelect }: TrendingWishesProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <h3 className="font-bold tracking-tight">🔥 Trending Onam Wishes</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {TRENDING.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onSelect(item.config as Partial<GeneratorConfig>)}
            className="rounded-full border border-border/60 bg-muted/40 px-3 py-2.5 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5 cursor-pointer min-h-[40px] sm:min-h-[36px] lg:min-h-[32px] flex-1 sm:flex-none text-wrap text-left"
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
