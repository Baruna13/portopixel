import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared look of the formal page: the game's pixel identity, with readable body text. */

export const FOCUS = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60";

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 border-[4px] px-4 py-3 font-label-sm text-label-sm uppercase shadow-[4px_4px_0_0_#020617] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none";

/** Class strings so that <a> links can look exactly like the game's PixelButton. */
export const btn = {
  primary: cn(BTN_BASE, "border-on-primary bg-primary text-on-primary hover:bg-secondary", FOCUS),
  secondary: cn(BTN_BASE, "border-primary bg-surface-variant text-primary hover:bg-primary hover:text-on-primary", FOCUS),
};

type Tone = "plain" | "outline" | "gold" | "solid";

const TAG_TONES: Record<Tone, string> = {
  plain: "bg-surface-variant text-surface-tint",
  outline: "border-2 border-primary text-primary",
  gold: "border-2 border-secondary text-secondary",
  solid: "bg-primary text-on-primary",
};

export function Tag({ children, tone = "plain", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 font-label-sm text-label-sm uppercase", TAG_TONES[tone], className)}>
      {children}
    </span>
  );
}

/** A small boxed label, like the items in the game's Inventory. */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border-2 border-outline bg-surface-container-high px-2 py-1 font-label-sm text-label-sm text-on-surface">
      {children}
    </span>
  );
}

export function SectionTitle({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="mb-8 border-b-[4px] border-primary pb-4">
      <h2 className="flex items-center gap-4 font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg text-primary">
        <span aria-hidden="true" className="text-secondary">
          ▶
        </span>
        {title}
      </h2>
      {meta && (
        <p className="mt-3 flex items-start gap-2 font-inter text-sm leading-6 text-on-surface-variant sm:text-base">
          <span aria-hidden="true" className="mt-2 inline-block h-2 w-2 shrink-0 bg-secondary" />
          {meta}
        </p>
      )}
    </div>
  );
}
