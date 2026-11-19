import { useEffect, useState } from "react";

interface LightboxProps {
  images: string[];
  title: string;
  startIndex?: number;
  onClose: () => void;
}

const BTN =
  "border-[3px] border-primary bg-surface-variant px-3 py-2 font-label-sm text-label-sm uppercase text-primary shadow-[3px_3px_0_0_#020617] transition-colors hover:bg-primary hover:text-on-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60";

/** Full-screen image viewer: Esc closes, ← → switch images. */
export function Lightbox({ images, title, startIndex = 0, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const count = images.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
      else if (e.key === "ArrowRight") setIndex((i) => (i + 1) % count);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [count, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-background/90 p-4"
    >
      <div className="flex w-full max-w-5xl items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
        <p className="font-label-sm text-label-sm uppercase text-primary">
          ▶ {title}
          {count > 1 && <span className="ml-3 text-on-surface-variant">{index + 1}/{count}</span>}
        </p>
        <button type="button" autoFocus onClick={onClose} aria-label="Close" className={BTN}>
          [ X ] Close
        </button>
      </div>

      <div
        className="relative flex max-h-[78vh] w-full max-w-5xl items-center justify-center border-[6px] border-primary bg-surface-container p-2 shadow-[8px_8px_0_0_#020617]"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={images[index]} alt={`${title}, image ${index + 1} of ${count}`} className="max-h-[72vh] max-w-full object-contain" />
      </div>

      {count > 1 && (
        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
          <button type="button" aria-label="Previous image" onClick={() => setIndex((i) => (i - 1 + count) % count)} className={BTN}>
            ◀ Prev
          </button>
          <button type="button" aria-label="Next image" onClick={() => setIndex((i) => (i + 1) % count)} className={BTN}>
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}
