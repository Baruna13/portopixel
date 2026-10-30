import { NAV_ITEMS, type NavPath } from "@/hooks/useGameNavigation";
import { cn } from "@/lib/utils";

interface GameMenuProps {
  activePath: NavPath;
  onNavigate: (path: NavPath) => void;
  orientation?: "vertical" | "horizontal";
}

export function GameMenu({ activePath, onNavigate, orientation = "vertical" }: GameMenuProps) {
  const isVertical = orientation === "vertical";

  return (
    <ul className={cn("flex", isVertical ? "flex-col gap-4" : "flex-row justify-between gap-1")}>
      {NAV_ITEMS.map((item) => {
        const active = item.path === activePath;
        return (
          <li key={item.path} className={cn(!isVertical && "flex-1")}>
            <button
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => onNavigate(item.path)}
              className={cn(
                "group flex w-full transition-all",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60 rounded-none",
                isVertical
                  ? "items-center whitespace-nowrap font-headline-md text-headline-md py-1"
                  : "flex-col items-center justify-center gap-1 font-label-sm text-label-sm py-1",
                active ? "text-primary" : "text-on-surface-variant hover:text-primary",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "cursor-blink text-primary transition-opacity",
                  isVertical ? "mr-3" : "",
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                )}
              >
                ▶
              </span>
              <span>{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
