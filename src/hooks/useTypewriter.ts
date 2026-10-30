import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./useMediaQuery";

interface UseTypewriterOptions {
  /** ms per character */
  speed?: number;
  startDelay?: number;
}

export function useTypewriter(text: string, { speed = 30, startDelay = 0 }: UseTypewriterOptions = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayed, setDisplayed] = useState(prefersReducedMotion ? text : "");
  const [done, setDone] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    setDisplayed("");
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay, prefersReducedMotion]);

  return { displayed, done };
}
