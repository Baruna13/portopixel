import { useEffect, useState } from "react";
import type { Project } from "@/types";
import { getProjectImages } from "@/data/projectImages";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelReveal } from "@/components/game/PixelReveal";

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const images = getProjectImages(project.id);
  const [active, setActive] = useState(0);
  const current = images[active];

  // Start at the top when the page opens.
  useEffect(() => {
    document.getElementById("main-content")?.scrollTo({ top: 0 });
  }, []);

  // Esc acts as the "B: BACK" button from the footer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <div className="flex w-full flex-col gap-grid-gutter pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PixelButton variant="ghost" onClick={onBack} className="px-4 py-2 text-label-sm font-label-sm">
          ◀ BACK TO MISSIONS
        </PixelButton>
        <span className="bg-surface-variant px-2 py-1 font-label-sm text-label-sm text-surface-tint">
          {`MSN-${String(project.missionNumber).padStart(3, "0")}`}
        </span>
      </div>

      <div className="border-b-[4px] border-primary pb-4">
        <h1 className="flex items-start gap-4 break-words font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg leading-relaxed text-primary">
          <span aria-hidden="true" className="inline-block animate-bounce text-secondary">
            ▶
          </span>
          {project.title}
        </h1>
      </div>

      {/* Gallery */}
      <div>
        <div className="relative aspect-video overflow-hidden border-[6px] border-primary bg-surface-container-low shadow-[8px_8px_0_0_#020617]">
          {current ? (
            <button
              type="button"
              onClick={images.length > 1 ? next : undefined}
              aria-label={images.length > 1 ? "Show next screenshot" : `${project.title} screenshot`}
              className={`block h-full w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60 ${
                images.length > 1 ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <img
                key={current}
                src={current}
                alt={`${project.title} screenshot ${active + 1} of ${images.length}`}
                className="h-full w-full object-cover"
              />
              <PixelReveal key={`reveal-${current}`} />
            </button>
          ) : (
            <div className="no-signal absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-3 py-2 font-label-sm text-label-sm text-on-surface-variant cursor-blink">
                NO SIGNAL — SCREENSHOTS COMING SOON
              </span>
            </div>
          )}

          {images.length > 1 && (
            <span className="pointer-events-none absolute bottom-2 left-2 bg-background/85 px-2 py-1 font-label-sm text-label-sm text-primary">
              {`IMG ${String(active + 1).padStart(2, "0")}/${String(images.length).padStart(2, "0")}  ·  CLICK = NEXT ▶`}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show screenshot ${i + 1}`}
                aria-current={i === active}
                className={`h-12 w-20 overflow-hidden border-4 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60 ${
                  i === active ? "border-primary" : "border-surface-variant opacity-60 hover:opacity-100 hover:border-secondary"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 gap-grid-gutter md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div>
            <p className="mb-2 font-label-sm text-label-sm text-on-surface-variant">OBJECTIVE</p>
            <p className="font-body-md text-body-md text-on-surface">{project.purpose}</p>
          </div>

          {project.features.length > 0 && (
            <div>
              <p className="mb-2 font-label-sm text-label-sm text-secondary">FEATURES</p>
              <ul className="space-y-2 font-body-md text-body-md text-on-surface">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1 text-secondary">
                      ▶
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="space-y-6 border-[4px] border-surface-variant bg-surface-container p-4">
          <div>
            <p className="mb-1 font-label-sm text-label-sm text-on-surface-variant">ROLE</p>
            <p className="font-body-md text-body-md text-on-surface">{project.role}</p>
          </div>
          <div>
            <p className="mb-1 font-label-sm text-label-sm text-on-surface-variant">STATUS</p>
            <p className="font-body-md text-body-md text-primary">
              {project.status === "Completed" ? "CLEARED" : project.status}
            </p>
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

          <div className="flex flex-col items-start gap-3">
            {project.liveUrl && (
              <PixelButton
                variant="primary"
                onClick={() => window.open(project.liveUrl, "_blank", "noopener,noreferrer")}
                className="px-3 py-2 text-label-sm font-label-sm"
              >
                VISIT LIVE SITE ↗
              </PixelButton>
            )}
            {project.repoUrl && (
              <PixelButton
                variant="secondary"
                onClick={() => window.open(project.repoUrl, "_blank", "noopener,noreferrer")}
                className="px-3 py-2 text-label-sm font-label-sm"
              >
                VIEW REPO ↗
              </PixelButton>
            )}
            {!project.liveUrl && !project.repoUrl && (
              <p className="font-label-sm text-label-sm text-on-surface-variant">NO PUBLIC LINKS YET</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}