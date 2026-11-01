import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { Achievement } from "@/types";
import { getCertificateImages } from "@/data/certificateImages";
import { PixelButton } from "@/components/ui/PixelButton";
import { cn } from "@/lib/utils";

interface TrophyCardProps {
  achievement: Achievement;
  onOpen: (id: string) => void;
}

function LockedCard({ achievement }: { achievement: Achievement }) {
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!denied) return;
    const t = window.setTimeout(() => setDenied(false), 700);
    return () => window.clearTimeout(t);
  }, [denied]);

  return (
    <button
      type="button"
      onClick={() => setDenied(true)}
      aria-label="Locked trophy"
      className={cn(
        "relative flex w-full flex-col gap-4 border-[4px] bg-surface-container-low p-4 text-left shadow-[8px_8px_0_0_#020617] transition-all",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60",
        denied
          ? "border-error animate-[shake_0.5s_steps(8)_1]"
          : "border-surface-variant opacity-70 grayscale hover:grayscale-0 hover:opacity-100",
      )}
    >
      <span className="w-fit border-2 border-surface bg-surface-variant px-3 py-1 font-label-sm text-label-sm uppercase text-on-surface-variant">
        LOCKED
      </span>
      <span className="flex items-center gap-4">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center border-[4px] border-surface-variant bg-surface">
          <span aria-hidden="true" className="font-headline-xl text-headline-xl text-surface-variant">
            ?
          </span>
        </span>
        <span className="flex flex-col gap-2">
          <span className="font-headline-md text-headline-md text-on-surface-variant">{achievement.title}</span>
          <span className="font-label-sm text-label-sm uppercase text-surface-variant">Classified</span>
        </span>
      </span>
      <span
        aria-live="polite"
        className={cn(
          "flex items-center justify-center border-2 bg-surface p-3 font-label-sm text-label-sm",
          denied ? "border-error text-error" : "border-surface-variant text-surface-variant",
        )}
      >
        {denied ? "ACCESS DENIED — KEEP LEVELING" : "COMING SOON..."}
      </span>
    </button>
  );
}

export function TrophyCard({ achievement, onOpen }: TrophyCardProps) {
  if (achievement.status === "Locked") return <LockedCard achievement={achievement} />;

  const preview = getCertificateImages(achievement.id)[0];

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col gap-4 border-[4px] border-primary bg-surface-container p-4 shadow-[8px_8px_0_0_#020617] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#020617]"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="w-fit border-2 border-on-primary bg-primary px-3 py-1 font-label-sm text-label-sm uppercase text-on-primary">
          UNLOCKED
        </span>
        {achievement.date && <span className="font-label-sm text-label-sm text-primary">{achievement.date}</span>}
      </div>

      {/* Certificate preview: click to inspect */}
      <button
        type="button"
        onClick={() => onOpen(achievement.id)}
        aria-label={`Inspect trophy: ${achievement.title}`}
        className="group relative block aspect-[4/3] w-full overflow-hidden border-[4px] border-surface-variant bg-surface-container-low transition-colors hover:border-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60"
      >
        {preview ? (
          <img
            src={preview}
            alt={`${achievement.title} certificate`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-300 [transition-timing-function:steps(5)] group-hover:scale-110"
          />
        ) : (
          <span className="no-signal absolute inset-0 flex items-center justify-center">
            <Trophy aria-hidden="true" className="h-12 w-12 text-primary" />
          </span>
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 bg-primary/25 opacity-0 group-hover:opacity-100 group-hover:animate-[slideRight_0.7s_steps(10)_1]"
        />
        <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center bg-primary px-3 py-2 font-label-sm text-label-sm text-on-primary transition-transform duration-200 [transition-timing-function:steps(3)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
          ▶ INSPECT
        </span>
      </button>

      <div className="flex flex-col gap-2">
        <h2 className="font-headline-md text-headline-md leading-tight text-primary">{achievement.title}</h2>
        {achievement.subtitle && (
          <p className="font-label-sm text-label-sm uppercase text-on-surface-variant">{achievement.subtitle}</p>
        )}
        {achievement.rank && (
          <p className="w-fit border-2 border-secondary px-2 py-1 font-label-sm text-label-sm uppercase text-secondary">
            {achievement.rank}
          </p>
        )}
      </div>

      {(achievement.description || achievement.organizer) && (
        <div className="border-2 border-surface-variant bg-surface p-3 text-body-md font-body-md text-on-surface">
          {achievement.description && <p>{achievement.description}</p>}
          {achievement.organizer && (
            <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">{achievement.organizer}</p>
          )}
        </div>
      )}

      <PixelButton
        variant="secondary"
        onClick={() => onOpen(achievement.id)}
        className="self-start px-3 py-2 text-label-sm font-label-sm"
      >
        [ INSPECT TROPHY ]
      </PixelButton>
    </motion.article>
  );
}