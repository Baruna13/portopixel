import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Achievement } from "@/types";
import { getCertificateImages } from "@/data/certificateImages";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelReveal } from "@/components/game/PixelReveal";
import { cn } from "@/lib/utils";

interface TrophyModalProps {
  /** Unlocked achievements only, in display order. */
  items: Achievement[];
  activeId: string;
  onChange: (id: string) => void;
  onClose: () => void;
}

export function TrophyModal({ items, activeId, onChange, onClose }: TrophyModalProps) {
  const index = items.findIndex((a) => a.id === activeId);
  const achievement = items[index];
  const images = achievement ? getCertificateImages(achievement.id) : [];

  const [imgIdx, setImgIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Reset the viewer when switching trophies.
  useEffect(() => {
    setImgIdx(0);
    setZoomed(false);
  }, [activeId]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const go = (delta: number) => {
      if (items.length < 2) return;
      onChange(items[(index + delta + items.length) % items.length].id);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, index, onChange, onClose]);

  if (!achievement) return null;

  const image = images[imgIdx];
  const go = (delta: number) => onChange(items[(index + delta + items.length) % items.length].id);

  return (
    <motion.div
      role="presentation"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "linear" }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 p-4"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="trophy-title"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, ease: "linear" }}
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col gap-4 overflow-y-auto border-[6px] border-primary bg-surface-container p-4 shadow-[10px_10px_0_0_#020617] md:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="font-label-sm text-label-sm text-secondary">▶ INSPECT TROPHY</p>
          <PixelButton
            ref={closeRef}
            variant="ghost"
            onClick={onClose}
            className="px-3 py-2 text-label-sm font-label-sm"
          >
            [ X ] CLOSE
          </PixelButton>
        </div>

        <div>
          <h2 id="trophy-title" className="break-words font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg leading-relaxed text-primary">
            {achievement.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 font-label-sm text-label-sm">
            {achievement.rank && (
              <span className="border-2 border-secondary px-2 py-1 uppercase text-secondary">{achievement.rank}</span>
            )}
            {achievement.subtitle && <span className="uppercase text-on-surface-variant">{achievement.subtitle}</span>}
            {achievement.date && <span className="text-primary">{achievement.date}</span>}
          </div>
        </div>

        {/* Certificate viewer: click to zoom */}
        <div
          className={cn(
            "relative overflow-auto border-[4px] border-surface-variant bg-surface-container-low",
            zoomed ? "max-h-[65vh]" : "",
          )}
        >
          {image ? (
            <button
              type="button"
              onClick={() => setZoomed((z) => !z)}
              aria-label={zoomed ? "Zoom out" : "Zoom in"}
              className={cn(
                "relative block w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60",
                zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
              )}
            >
              <img
                key={image}
                src={image}
                alt={`${achievement.title} certificate, page ${imgIdx + 1} of ${images.length}`}
                className={cn(
                  "mx-auto block",
                  zoomed ? "w-full max-w-none" : "max-h-[45vh] w-auto max-w-full object-contain",
                )}
              />
              <PixelReveal key={`reveal-${image}`} />
              <span className="pointer-events-none absolute bottom-2 left-2 bg-background/85 px-2 py-1 font-label-sm text-label-sm text-primary">
                {zoomed ? "CLICK = ZOOM OUT" : "CLICK = ZOOM IN"}
              </span>
            </button>
          ) : (
            <div className="no-signal flex min-h-40 items-center justify-center p-6">
              <span className="bg-background px-3 py-2 text-center font-label-sm text-label-sm text-on-surface-variant">
                CERTIFICATE SCAN NOT AVAILABLE YET
              </span>
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex flex-wrap gap-3">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => {
                  setImgIdx(i);
                  setZoomed(false);
                }}
                aria-label={`Show certificate page ${i + 1}`}
                aria-current={i === imgIdx}
                className={cn(
                  "h-12 w-20 overflow-hidden border-4 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60",
                  i === imgIdx
                    ? "border-primary"
                    : "border-surface-variant opacity-60 hover:border-secondary hover:opacity-100",
                )}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {(achievement.description || achievement.organizer) && (
          <div className="border-2 border-surface-variant bg-surface p-3 text-body-md font-body-md text-on-surface">
            {achievement.description && <p>{achievement.description}</p>}
            {achievement.organizer && (
              <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">{achievement.organizer}</p>
            )}
          </div>
        )}

        {items.length > 1 && (
          <div className="flex items-center justify-between gap-4">
            <PixelButton variant="secondary" onClick={() => go(-1)} className="px-3 py-2 text-label-sm font-label-sm">
              ◀ PREV
            </PixelButton>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {`TROPHY ${String(index + 1).padStart(2, "0")}/${String(items.length).padStart(2, "0")}`}
            </span>
            <PixelButton variant="secondary" onClick={() => go(1)} className="px-3 py-2 text-label-sm font-label-sm">
              NEXT ▶
            </PixelButton>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}