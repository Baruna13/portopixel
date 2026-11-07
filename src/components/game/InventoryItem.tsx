import { cn } from "@/lib/utils";
import type { Skill } from "@/types";

interface InventoryItemProps {
  skill: Skill;
  selected?: boolean;
  onSelect?: (skill: Skill) => void;
  /** Slot number shown in the corner (1-based). */
  slot: number;
  /** How many missions list this skill in their tech stack. */
  usedIn: number;
  /** Accent colour of the skill's category. */
  color: string;
}

export function InventoryItem({ skill, selected, onSelect, slot, usedIn, color }: InventoryItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(skill)}
      aria-pressed={selected}
      title={usedIn > 0 ? `${skill.name}: used in ${usedIn} mission${usedIn === 1 ? "" : "s"}` : skill.name}
      className={cn(
        "relative flex aspect-square items-center justify-center border-4 bg-surface-variant p-1 transition-all duration-150 [transition-timing-function:steps(3)]",
        "hover:-translate-y-1 hover:bg-surface-container-high hover:shadow-[4px_4px_0_0_#020617]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60",
        selected ? "-translate-y-1 border-primary bg-surface-container-high shadow-[4px_4px_0_0_#020617]" : "border-outline-variant hover:border-primary",
      )}
    >
      <span aria-hidden="true" className="absolute left-1 top-0.5 font-label-sm text-[8px] leading-none text-on-surface-variant">
        {String(slot).padStart(2, "0")}
      </span>
      {usedIn > 0 && (
        <span
          aria-hidden="true"
          className="absolute right-1 top-1 bg-primary px-1 py-[2px] font-label-sm text-[8px] leading-none text-on-primary"
        >
          ×{usedIn}
        </span>
      )}
      <span className="break-words text-center font-label-sm text-label-sm leading-tight text-primary">{skill.name}</span>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: color }} />
      {selected && (
        <>
          <span aria-hidden="true" className="cursor-blink absolute -left-2 -top-2 h-2 w-2" style={{ backgroundColor: color }} />
          <span aria-hidden="true" className="cursor-blink absolute -right-2 -top-2 h-2 w-2" style={{ backgroundColor: color }} />
          <span aria-hidden="true" className="cursor-blink absolute -bottom-2 -left-2 h-2 w-2" style={{ backgroundColor: color }} />
          <span aria-hidden="true" className="cursor-blink absolute -bottom-2 -right-2 h-2 w-2" style={{ backgroundColor: color }} />
        </>
      )}
    </button>
  );
}