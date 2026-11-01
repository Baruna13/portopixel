import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ACHIEVEMENTS } from "@/data/achievements";
import { TrophyCard } from "@/components/game/TrophyCard";
import { TrophyModal } from "@/components/game/TrophyModal";

export function Achievements() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.status === "Unlocked");
  const [activeId, setActiveId] = useState<string | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const open = (id: string) => {
    lastFocused.current = document.activeElement as HTMLElement | null;
    setActiveId(id);
  };

  const close = () => {
    setActiveId(null);
    // give focus back to the card the player came from
    window.setTimeout(() => lastFocused.current?.focus(), 0);
  };

  return (
    <div className="flex w-full flex-col gap-grid-gutter pb-8">
      <div className="flex flex-col gap-4 border-b-[4px] border-primary pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary">
            TROPHIES
          </h1>
          <p className="mt-2 font-headline-md text-headline-md text-on-surface-variant">ACCOMPLISHMENTS</p>
        </div>
        <div className="flex w-fit items-center gap-4 border-[4px] border-primary bg-surface-container-high p-2 shadow-[4px_4px_0_0_#020617]">
          <span className="font-label-sm text-label-sm text-primary">TOTAL:</span>
          <span className="font-headline-md text-headline-md text-on-surface">
            {String(unlocked.length).padStart(2, "0")}/{String(ACHIEVEMENTS.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-grid-gutter md:grid-cols-2">
        {ACHIEVEMENTS.map((a) => (
          <TrophyCard key={a.id} achievement={a} onOpen={open} />
        ))}
      </div>

      <AnimatePresence>
        {activeId && <TrophyModal items={unlocked} activeId={activeId} onChange={setActiveId} onClose={close} />}
      </AnimatePresence>
    </div>
  );
}