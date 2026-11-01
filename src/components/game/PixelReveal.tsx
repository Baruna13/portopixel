import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface PixelRevealProps {
  cols?: number;
  rows?: number;
  /** Total seconds for the whole dissolve. */
  duration?: number;
}

/**
 * A grid of dark squares that vanish in random order, so the image underneath
 * "assembles" pixel by pixel. Put it inside a `relative` container; remount it
 * (change its `key`) to replay.
 */
export function PixelReveal({ cols = 14, rows = 8, duration = 0.7 }: PixelRevealProps) {
  const reduced = usePrefersReducedMotion();

  const cells = useMemo(
    () => Array.from({ length: cols * rows }, (_, i) => ({ id: i, delay: Math.random() * duration })),
    [cols, rows, duration],
  );

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid pointer-events-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {cells.map((cell) => (
        <motion.span
          key={cell.id}
          className="bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: cell.delay, duration: 0.1, ease: "linear" }}
        />
      ))}
    </div>
  );
}