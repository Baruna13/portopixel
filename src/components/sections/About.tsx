import { User } from "lucide-react";
import { PLAYER_PROFILE } from "@/data/profile";
import { PixelBorder } from "@/components/ui/PixelBorder";
import { Typewriter } from "@/components/ui/Typewriter";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBar } from "@/components/game/StatusBar";

export function About() {
  return (
    <div className="flex flex-col w-full gap-grid-gutter">
      <SectionHeader title="PLAYER PROFILE" />

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative p-2 bg-surface-container border-[6px] border-primary shadow-[8px_8px_0_0_#020617]">
            <PixelBorder />
            <div className="w-40 h-40 md:w-48 md:h-48 bg-surface-container-highest border-[4px] border-surface-variant flex items-center justify-center overflow-hidden">
              {PLAYER_PROFILE.avatarUrl ? (
                <img
                  src={PLAYER_PROFILE.avatarUrl}
                  alt={`Portrait of ${PLAYER_PROFILE.name}`}
                  className="w-full h-full object-cover [image-rendering:pixelated]"
                />
              ) : (
                <>
                  <User aria-hidden="true" className="w-20 h-20 text-primary" />
                  <span className="sr-only">Portrait placeholder for {PLAYER_PROFILE.name}</span>
                </>
              )}
            </div>
          </div>

          <div className="w-full bg-surface-container p-4 border-[4px] border-primary shadow-[4px_4px_0_0_#020617] flex flex-col gap-3">
            <StatusBar label="HP" value={10} segments={10} colorClass="bg-error" valueLabel="MAX" />
            <StatusBar label="MP" value={10} segments={10} colorClass="bg-secondary" valueLabel="MAX" />
          </div>
        </div>

        <div className="bg-surface-container border-[8px] border-primary p-1 shadow-[8px_8px_0_0_#020617]">
          <div className="border-[4px] border-surface-variant p-4 md:p-6 bg-surface-container-lowest flex flex-col gap-6">
            <h2 className="font-headline-lg text-headline-lg text-primary border-b-[4px] border-surface-variant pb-4">
              STATUS DATA
            </h2>
            <ProfileRow label="NAME" value={PLAYER_PROFILE.name} />
            <ProfileRow label="CLASS" value={PLAYER_PROFILE.class} />
            <ProfileRow label="ROLES" value={PLAYER_PROFILE.roles.join(", ")} />
            <ProfileRow label="FOCUS" value={PLAYER_PROFILE.focus.join(", ")} />
            {PLAYER_PROFILE.location && <ProfileRow label="LOC." value={PLAYER_PROFILE.location} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
      <div className="font-headline-md text-headline-md text-surface-variant flex items-center h-full">{label}</div>
      <div className="font-body-lg text-body-lg text-on-surface bg-surface-container p-3 border-l-[4px] border-primary">
        <Typewriter text={value} />
      </div>
    </div>
  );
}
