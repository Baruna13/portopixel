import type { ReactNode } from "react";
import type { Project } from "@/types";
import { getProjectImages } from "@/data/projectImages";
import { PixelButton } from "@/components/ui/PixelButton";

interface MissionCardProps {
  project: Project;
  onOpen: (id: string) => void;
}

function CoverVisual({ cover, title, count, actionLabel }: { cover?: string; title: string; count: number; actionLabel?: string }) {
  return (
    <div className="relative aspect-video overflow-hidden border-[4px] border-surface-variant bg-surface-container-low transition-colors group-hover:border-primary group-focus-visible:border-primary">
      {cover ? (
        <img
          src={cover}
          alt={`${title} screenshot`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 [transition-timing-function:steps(5)] group-hover:scale-110"
        />
      ) : (
        <div className="no-signal absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-3 py-2 font-label-sm text-label-sm text-on-surface-variant cursor-blink">
            NO SIGNAL
          </span>
        </div>
      )}

      {count > 1 && (
        <span className="absolute right-2 top-2 bg-background/85 px-2 py-1 font-label-sm text-label-sm text-primary">
          {count} PICS
        </span>
      )}

      {actionLabel && (
        <>
          {/* one-shot scanline sweep on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 bg-primary/25 opacity-0 group-hover:opacity-100 group-hover:animate-[slideRight_0.7s_steps(10)_1]"
          />
          <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-primary px-3 py-2 font-label-sm text-label-sm text-on-primary transition-transform duration-200 [transition-timing-function:steps(3)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
            <span>▶ {actionLabel}</span>
          </span>
        </>
      )}
    </div>
  );
}

export function MissionCard({ project, onOpen }: MissionCardProps) {
  const images = getProjectImages(project.id);
  const cover = images[0];

  // A project gets its own detail page when it has screenshots or a feature list.
  // Otherwise the cover links straight to the live site (if there is one).
  const hasDetail = images.length > 0 || project.features.length > 0;
  const directLink = !hasDetail ? project.liveUrl : undefined;

  const actionLabel = hasDetail ? "ENTER MISSION" : directLink ? "OPEN LIVE SITE ↗" : undefined;

  const wrapperClass =
    "group block w-full text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60";

  let coverEl: ReactNode;
  const visual = (
    <CoverVisual cover={cover} title={project.title} count={images.length} actionLabel={actionLabel} />
  );

  if (hasDetail) {
    coverEl = (
      <button
        type="button"
        onClick={() => onOpen(project.id)}
        aria-label={`Open mission: ${project.title}`}
        className={wrapperClass}
      >
        {visual}
      </button>
    );
  } else if (directLink) {
    coverEl = (
      <a
        href={directLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title} live site (new tab)`}
        className={wrapperClass}
      >
        {visual}
      </a>
    );
  } else {
    coverEl = <div className="group block w-full">{visual}</div>;
  }

  return (
    <article className="relative bg-surface-container border-[8px] border-surface-variant p-1 shadow-[8px_8px_0_0_#020617] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#020617]">
      <div className="relative flex h-full flex-col border-[4px] border-primary bg-surface p-4">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <span className="mb-2 inline-block bg-surface-variant px-2 py-1 font-label-sm text-label-sm text-surface-tint">
              {`MSN-${String(project.missionNumber).padStart(3, "0")}`}
            </span>
            <h2 className="font-headline-md text-headline-md leading-relaxed text-primary">{project.title}</h2>
          </div>
          <span className="shrink-0 border-2 border-primary bg-primary/10 px-2 py-1 font-label-sm text-label-sm text-primary">
            CLEARED
          </span>
        </div>

        <div className="mb-4">{coverEl}</div>

        <div className="flex-1 space-y-4">
          <div>
            <p className="mb-1 font-label-sm text-label-sm text-on-surface-variant">ROLE</p>
            <p className="font-body-md text-body-md text-on-surface">{project.role}</p>
          </div>
          <div>
            <p className="mb-1 font-label-sm text-label-sm text-on-surface-variant">OBJECTIVE</p>
            <p className="font-body-md text-body-md text-on-surface">{project.purpose}</p>
          </div>
          <div>
            <p className="mb-2 font-label-sm text-label-sm text-on-surface-variant">EQUIPMENT</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="border-2 border-outline bg-surface-container-high px-2 py-1 font-label-sm text-label-sm text-on-surface"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {hasDetail && (
          <PixelButton
            variant="secondary"
            onClick={() => onOpen(project.id)}
            className="mt-4 self-start px-3 py-2 text-label-sm font-label-sm"
          >
            [ ENTER MISSION ]
          </PixelButton>
        )}
        {directLink && (
          <PixelButton
            variant="secondary"
            onClick={() => window.open(directLink, "_blank", "noopener,noreferrer")}
            className="mt-4 self-start px-3 py-2 text-label-sm font-label-sm"
          >
            [ OPEN LIVE SITE ↗ ]
          </PixelButton>
        )}
      </div>
    </article>
  );
}