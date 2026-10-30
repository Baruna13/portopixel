import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import type { NavPath } from "@/hooks/useGameNavigation";

interface PageShellProps {
  activePath: NavPath;
  onNavigate: (path: NavPath) => void;
  children: ReactNode;
}

export function PageShell({ activePath, onNavigate, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center md:p-container-margin">
      <div className="relative w-full max-w-[1200px] md:aspect-[16/10] bg-surface-container border-0 md:border-[12px] border-surface-variant shadow-none md:shadow-[12px_12px_0_0_#020617] flex flex-col overflow-hidden min-h-[100dvh] md:min-h-0">
        <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-8 bg-surface-container-high border-b-[4px] border-primary shrink-0">
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="w-3 h-3 bg-error rounded-full shadow-[0_0_8px_#f87171]" />
            <span className="font-label-sm text-label-sm text-primary uppercase hidden sm:inline">
              Status: Always Learning
            </span>
          </div>
          <div className="w-8 h-8 bg-primary flex items-center justify-center border-2 border-on-primary shadow-[2px_2px_0_0_#082f49]">
            <span aria-hidden="true" className="text-on-primary text-sm leading-none">
              ●
            </span>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          <div aria-hidden="true" className="crt-overlay absolute inset-0" />
          <Navbar activePath={activePath} onNavigate={onNavigate} />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 bg-surface relative overflow-y-auto p-grid-gutter pb-24 md:pb-grid-gutter focus:outline-none"
          >
            {children}
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}
