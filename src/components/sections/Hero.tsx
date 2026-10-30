import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PixelButton } from "@/components/ui/PixelButton";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PLAYER_PROFILE } from "@/data/profile";

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    window.setTimeout(onStart, 700);
  };

  const nameParts = PLAYER_PROFILE.name.split(" ");
  const nameLine1 = nameParts.slice(0, 2).join(" ");
  const nameLine2 = nameParts.slice(2).join(" ");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-container-margin relative overflow-hidden">
      <div aria-hidden="true" className="crt-overlay absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 md:gap-12 max-w-2xl">
        <div className="border-[6px] md:border-[8px] border-primary bg-surface-container-low p-6 md:p-8 shadow-[8px_8px_0_0_#020617] relative">
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary mb-4 drop-shadow-[4px_4px_0_#082f49] leading-relaxed">
            {nameLine1}
            <br />
            {nameLine2}
          </h1>
          <div className="inline-block bg-primary px-4 py-1">
            <h2 className="font-body-md text-body-md text-on-primary">
              {PLAYER_PROFILE.class} / {PLAYER_PROFILE.roles.join(" & ")}
            </h2>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <p aria-hidden="true" className="font-headline-md text-headline-md text-on-surface-variant cursor-blink">
            PRESS START
          </p>
          <PixelButton
            variant="secondary"
            onClick={handleStart}
            disabled={loading}
            className="px-8 py-4 text-headline-lg font-headline-lg"
          >
            [ START ADVENTURE ]
          </PixelButton>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between font-label-sm text-label-sm text-on-surface-variant z-10 pointer-events-none opacity-50">
        <span>PORTFOLIO BUILD</span>
        <span>V 1.0</span>
      </div>

      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
    </div>
  );
}
