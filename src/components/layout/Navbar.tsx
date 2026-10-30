import { GameMenu } from "@/components/game/GameMenu";
import type { NavPath } from "@/hooks/useGameNavigation";

interface NavbarProps {
  activePath: NavPath;
  onNavigate: (path: NavPath) => void;
}

export function Navbar({ activePath, onNavigate }: NavbarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-72 bg-surface-container-low border-r-[4px] border-primary z-10 flex-col py-8 px-6 shrink-0 overflow-y-auto">
        <div className="mb-8 p-4 bg-surface-variant border-2 border-primary">
          <h2 className="font-headline-md text-headline-md text-primary">COMMAND</h2>
        </div>
        <nav aria-label="Main navigation">
          <GameMenu activePath={activePath} onNavigate={onNavigate} orientation="vertical" />
        </nav>
      </aside>

      {/* Mobile bottom bar */}
      <nav
        aria-label="Main navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-low border-t-[4px] border-primary px-2 py-2"
      >
        <GameMenu activePath={activePath} onNavigate={onNavigate} orientation="horizontal" />
      </nav>
    </>
  );
}
