import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Hero } from "@/components/sections/Hero";
import { PixelButton } from "@/components/ui/PixelButton";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { PLAYER_PROFILE } from "@/data/profile";

/**
 * Scroll-driven boot sequence shown BEFORE the console UI.
 *
 * Scroll progress (0 → 1) is the timeline:
 *   0.00–0.18  title screen ("scroll to start")
 *   0.20–0.62  boot log typed out letter by letter as you scroll
 *   0.62–0.80  LOADING bar that is literally your scroll position
 *   0.80–1.00  existing <Hero /> (START ADVENTURE) fades in
 *
 * The stage is `position: fixed` and a tall spacer drives the scroll, instead of
 * `position: sticky`. index.css sets overflow-x on html AND body, which makes
 * sticky unreliable.
 */

const SCROLL_HEIGHT_VH = 500;
const HERO_VISIBLE_AT = 0.8;

interface ScrollIntroProps {
  onStart: () => void;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/* ---------- parallax stars ---------- */

interface Star {
  x: number;
  y: number;
  size: number;
}

function makeStars(count: number, seed: number): Star[] {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: 2 + Math.floor(rand() * 3) * 2, // 2 / 4 / 6 px, keeps the pixel look
  }));
}

const STAR_LAYERS = [
  { count: 36, seed: 7, travel: -140, opacity: 0.35 },
  { count: 22, seed: 13, travel: -320, opacity: 0.6 },
  { count: 12, seed: 29, travel: -640, opacity: 0.95 },
];

function StarLayer({
  progress,
  count,
  seed,
  travel,
  opacity,
}: {
  progress: MotionValue<number>;
  count: number;
  seed: number;
  travel: number;
  opacity: number;
}) {
  const stars = useMemo(() => makeStars(count, seed), [count, seed]);
  const y = useTransform(progress, [0, 1], [0, travel]);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-0 top-0 w-full h-[300%] pointer-events-none"
      style={{ y, opacity }}
    >
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute bg-primary"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
        />
      ))}
    </motion.div>
  );
}

/* ---------- text typed by scroll position ---------- */

function typedCount(value: number, start: number, end: number, length: number) {
  return Math.round(clamp01((value - start) / (end - start)) * length);
}

function TypedLine({
  progress,
  start,
  end,
  text,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  text: string;
}) {
  const [count, setCount] = useState(() => typedCount(progress.get(), start, end, text.length));

  useMotionValueEvent(progress, "change", (v) => {
    setCount(typedCount(v, start, end, text.length));
  });

  const typing = count > 0 && count < text.length;

  return (
    <p className="font-headline-md text-headline-md text-primary min-h-[1.4em] break-words">
      {text.slice(0, count)}
      <span aria-hidden="true" className={typing ? "cursor-blink" : "invisible"}>
        █
      </span>
    </p>
  );
}

/* ---------- loading percent ---------- */

function Percent({ progress }: { progress: MotionValue<number> }) {
  const [value, setValue] = useState(() => Math.round(progress.get() * 100));
  useMotionValueEvent(progress, "change", (v) => setValue(Math.round(v * 100)));
  return <span>{String(value).padStart(3, "0")}%</span>;
}

/* ---------- main component ---------- */

export function ScrollIntro({ onStart }: ScrollIntroProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const [heroReady, setHeroReady] = useState(false);

  // Always start the console UI at the top of the page.
  useEffect(() => {
    return () => window.scrollTo(0, 0);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setHeroReady(v >= HERO_VISIBLE_AT);
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.12, 0.2], [1, 1, 0]);
  const logOpacity = useTransform(scrollYProgress, [0.18, 0.24, 0.58, 0.64], [0, 1, 1, 0]);
  const loadOpacity = useTransform(scrollYProgress, [0.62, 0.68, 0.78, 0.82], [0, 1, 1, 0]);
  const loadFill = useTransform(scrollYProgress, [0.66, 0.8], [0, 1]);
  const loadWidth = useTransform(loadFill, (v) => `${v * 100}%`);
  const heroOpacity = useTransform(scrollYProgress, [HERO_VISIBLE_AT, 0.92], [0, 1]);

  if (prefersReducedMotion) {
    return <Hero onStart={onStart} />;
  }

  const bootLines = [
    "> PLAYER DETECTED",
    `> CLASS: ${PLAYER_PROFILE.class.toUpperCase()}`,
    `> ROLES: ${PLAYER_PROFILE.roles.join(" & ").toUpperCase()}`,
    "> LOADING WORLD...",
  ];
  const LOG_START = 0.22;
  const LOG_STEP = 0.095;

  const skipToEnd = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <>
      {/* This spacer is what makes the page scrollable. */}
      <div aria-hidden="true" style={{ height: `${SCROLL_HEIGHT_VH}vh` }} />

      <div className="fixed inset-0 z-40 bg-background overflow-hidden">
        <div aria-hidden="true" className="crt-overlay absolute inset-0" />

        {STAR_LAYERS.map((layer) => (
          <StarLayer key={layer.seed} progress={scrollYProgress} {...layer} />
        ))}

        {/* Scene 1: title */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-10 text-center px-4"
        >
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary drop-shadow-[4px_4px_0_#082f49] leading-relaxed">
            PORTOPIXEL
          </h1>
          <p className="font-headline-md text-headline-md text-on-surface-variant cursor-blink">
            SCROLL TO START ▼
          </p>
        </motion.div>

        {/* Scene 2: boot log typed by scroll */}
        <motion.div
          style={{ opacity: logOpacity }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <div className="w-full max-w-xl border-[6px] border-primary bg-surface-container-low p-6 md:p-8 shadow-[8px_8px_0_0_#020617] flex flex-col gap-5">
            {bootLines.map((line, i) => (
              <TypedLine
                key={line}
                progress={scrollYProgress}
                start={LOG_START + i * LOG_STEP}
                end={LOG_START + i * LOG_STEP + LOG_STEP * 0.9}
                text={line}
              />
            ))}
          </div>
        </motion.div>

        {/* Scene 3: loading bar = scroll position */}
        <motion.div
          style={{ opacity: loadOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6"
        >
          <p className="font-headline-md text-headline-md text-primary">LOADING</p>
          <div className="w-full max-w-md h-8 border-[4px] border-primary bg-surface-container-low p-1">
            <motion.div
              className="h-full bg-primary"
              style={{
                width: loadWidth,
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent 0 10px, #082f49 10px 12px)",
              }}
            />
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            <Percent progress={loadFill} />
          </p>
        </motion.div>

        {/* Scene 4: existing Hero with START ADVENTURE */}
        <motion.div
          aria-hidden={!heroReady}
          style={{
            opacity: heroOpacity,
            visibility: heroReady ? "visible" : "hidden",
          }}
          className="absolute inset-0"
        >
          <Hero onStart={onStart} />
        </motion.div>

        {!heroReady && (
          <PixelButton
            variant="ghost"
            onClick={skipToEnd}
            className="absolute top-4 right-4 z-[110] px-3 py-2 text-label-sm font-label-sm"
          >
            SKIP ▶
          </PixelButton>
        )}
      </div>
    </>
  );
}