import { motion } from "framer-motion";

const elements = [
  { symbol: "✦", x: "10%", delay: 0, duration: 6, size: "text-2xl" },
  { symbol: "✦", x: "25%", delay: 1.2, duration: 7, size: "text-xl" },
  { symbol: "✧", x: "45%", delay: 0.5, duration: 5.5, size: "text-lg" },
  { symbol: "✦", x: "65%", delay: 2, duration: 6.5, size: "text-2xl" },
  { symbol: "✧", x: "80%", delay: 0.8, duration: 5, size: "text-xl" },
  { symbol: "✦", x: "90%", delay: 1.5, duration: 7.5, size: "text-lg" },
  { symbol: "◆", x: "15%", delay: 3, duration: 8, size: "text-3xl" },
  { symbol: "✦", x: "55%", delay: 2.5, duration: 6, size: "text-xl" },
];

export function FloatingElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className={`absolute ${el.size} text-primary/30 select-none`}
          style={{ left: el.x, top: "-5%" }}
          animate={{
            y: ["0%", "110%"],
            x: [0, Math.sin(i) * 30, 0],
            rotate: [0, 360],
            opacity: [0, 0.4, 0.2, 0],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {el.symbol}
        </motion.div>
      ))}
    </div>
  );
}

export function PookalamDecorative({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx="100"
            cy="100"
            rx="80"
            ry="25"
            fill="none"
            stroke="oklch(0.82 0.14 85)"
            strokeWidth="1.5"
            transform={`rotate(${angle} 100 100)`}
            opacity="0.6"
          />
        ))}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse
            key={`inner-${angle}`}
            cx="100"
            cy="100"
            rx="45"
            ry="18"
            fill="none"
            stroke="oklch(0.55 0.18 145)"
            strokeWidth="1"
            transform={`rotate(${angle} 100 100)`}
            opacity="0.5"
          />
        ))}
        <circle cx="100" cy="100" r="20" fill="none" stroke="oklch(0.6 0.18 25)" strokeWidth="1.5" opacity="0.4" />
        <circle cx="100" cy="100" r="8" fill="oklch(0.82 0.14 85)" opacity="0.3" />
      </svg>
    </div>
  );
}
