import { ACHIEVEMENTS } from "@/data/achievements";
import { TrophyCard } from "@/components/game/TrophyCard";

export function Achievements() {
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.status === "Unlocked").length;

  return (
    <div className="flex flex-col w-full gap-grid-gutter pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b-[4px] border-primary">
        <div>
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary">
            TROPHIES
          </h1>
          <p className="text-on-surface-variant font-headline-md text-headline-md mt-2">ACCOMPLISHMENTS</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-high border-[4px] border-primary p-2 shadow-[4px_4px_0_0_#020617] w-fit">
          <span className="text-primary font-label-sm text-label-sm">TOTAL:</span>
          <span className="text-on-surface font-headline-md text-headline-md">
            {String(unlockedCount).padStart(2, "0")}/{String(ACHIEVEMENTS.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-gutter">
        {ACHIEVEMENTS.map((a) => (
          <TrophyCard key={a.id} achievement={a} />
        ))}
      </div>
    </div>
  );
}
