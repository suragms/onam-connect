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
            className="rounded-full border border-border/60 px-3 py-2 text-xs font-medium hover:border-primary/40 hover:bg-primary/5 cursor-pointer min-h-[36px] text-left"
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
