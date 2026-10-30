import { useTypewriter } from "@/hooks/useTypewriter";

interface TypewriterProps {
  text: string;
  speed?: number;
  startDelay?: number;
  showCursor?: boolean;
  className?: string;
}

export function Typewriter({ text, speed, startDelay, showCursor = false, className }: TypewriterProps) {
  const { displayed, done } = useTypewriter(text, { speed, startDelay });

  return (
    <span className={className}>
      {/* Visible animated text is hidden from AT to avoid reading partial updates */}
      <span aria-hidden="true">
        {displayed}
        {showCursor && !done && (
          <span className="cursor-blink inline-block w-2 h-[1em] bg-primary ml-1 align-middle" />
        )}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
