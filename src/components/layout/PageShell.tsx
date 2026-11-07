import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CityBackdrop } from "./CityBackdrop";
import { MusicButton } from "@/components/ui/MusicButton";
import type { NavPath } from "@/hooks/useGameNavigation";

interface PageShellProps {
  activePath: NavPath;
  onNavigate: (path: NavPath) => void;
  /** When provided, the header shows a button that walks back out to the city map. */
  onExitToMap?: () => void;
  children: ReactNode;
}

export function PageShell({ activePath, onNavigate, onExitToMap, children }: PageShellProps) {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center bg-surface-container-lowest md:p-container-margin">
      <CityBackdrop />
      <div className="relative z-10 flex min-h-[100dvh] w-full max-w-[1200px] flex-col overflow-hidden border-0 bg-surface-container/50 shadow-none backdrop-blur-[2px] md:aspect-[16/10] md:min-h-0 md:border-[12px] md:border-surface-variant md:shadow-[12px_12px_0_0_#020617]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b-[4px] border-primary bg-surface-container-high/80 px-4 md:h-16 md:px-8">
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="w-3 h-3 bg-error rounded-full shadow-[0_0_8px_#f87171]" />
            <span className="font-label-sm text-label-sm text-primary uppercase hidden sm:inline">
              Status: Always Learning
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MusicButton />
            {onExitToMap ? (
              <button
                type="button"
                onClick={onExitToMap}
                aria-label="Back to city map"
                className="flex items-center gap-2 bg-primary px-3 py-2 border-2 border-on-primary shadow-[2px_2px_0_0_#082f49] font-label-sm text-label-sm text-on-primary hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60"
              >
                ◀ CITY MAP
              </button>
            ) : (
              <div className="w-8 h-8 bg-primary flex items-center justify-center border-2 border-on-primary shadow-[2px_2px_0_0_#082f49]">
                <span aria-hidden="true" className="text-on-primary text-sm leading-none">
                  ●
                </span>
              </div>
            )}
          </div>
        </header>

        <div className="relative flex flex-1 overflow-hidden">
          <div aria-hidden="true" className="crt-overlay absolute inset-0" />
          <Navbar activePath={activePath} onNavigate={onNavigate} />
          <main
            id="main-content"
            tabIndex={-1}
            className="relative flex-1 overflow-y-auto bg-surface/40 p-grid-gutter pb-24 focus:outline-none md:pb-grid-gutter"
          >
            {children}
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}