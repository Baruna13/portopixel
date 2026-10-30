import { cn } from "@/lib/utils";
import type { Skill } from "@/types";

interface InventoryItemProps {
  skill: Skill;
  selected?: boolean;
  onSelect?: (skill: Skill) => void;
}

export function InventoryItem({ skill, selected, onSelect }: InventoryItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(skill)}
      aria-pressed={selected}
      className={cn(
        "aspect-square bg-surface-variant border-4 flex items-center justify-center relative transition-colors p-1",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60",
        selected
          ? "border-primary bg-surface-container-high"
          : "border-outline-variant hover:border-primary hover:bg-surface-container-high",
      )}
    >
      <span className="font-label-sm text-label-sm text-primary text-center leading-tight break-words">
        {skill.name}
      </span>
    </button>
  );
}
