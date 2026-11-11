import { MUSIC_CREDIT, music, useMusic } from "@/lib/music";
import { cn } from "@/lib/utils";

/** Small pixel equalizer: bars bounce while music plays. */
function Equalizer({ active }: { active: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
      {[0, 0.2, 0.4].map((delay) => (
        <span
          key={delay}
          className={cn("w-[3px] bg-current", active ? "animate-[eq_0.8s_steps(4)_infinite]" : "h-[3px]")}
          style={active ? { animationDelay: `${delay}s` } : undefined}
        />
      ))}
    </span>
  );
}

export function MusicButton({ className }: { className?: string }) {
  const { available, muted, playing, volume } = useMusic();
  if (!available) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => music.toggle()}
        aria-pressed={!muted}
        aria-label={muted ? "Turn music on" : "Turn music off"}
        title={`♪ ${MUSIC_CREDIT}`}
        className={cn(
          "flex items-center gap-2 border-2 border-primary bg-surface-container-high px-3 py-2 font-label-sm text-label-sm text-primary transition-colors",
          "hover:bg-primary hover:text-on-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60",
        )}
      >
        <Equalizer active={playing && !muted} />
        <span className="hidden sm:inline">{muted ? "MUSIC OFF" : "MUSIC ON"}</span>
      </button>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={Math.round(volume * 100)}
        onChange={(e) => music.setVolume(Number(e.target.value) / 100)}
        aria-label="Music volume"
        className="hidden h-2 w-20 cursor-pointer accent-primary md:block"
      />
    </div>
  );
}

/** Credit line (shown only when a track is actually installed). */
export function MusicCredit({ className }: { className?: string }) {
  const { available } = useMusic();
  if (!available) return null;
  return <p className={className}>♪ {MUSIC_CREDIT}</p>;
}