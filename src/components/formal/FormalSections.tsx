import { useState } from "react";
import { PROJECTS } from "@/data/projects";
import { ACHIEVEMENTS } from "@/data/achievements";
import { FORMAL } from "@/data/formal";
import { getProjectImages } from "@/data/projectImages";
import { getCertificateImages } from "@/data/certificateImages";
import type { Project } from "@/types";
import { Lightbox } from "./Lightbox";
import { Chip, FOCUS, SectionTitle, Tag, btn } from "./ui";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ projects */

function ProjectCard({ project, featured }: { project: Project; featured: boolean }) {
  const [open, setOpen] = useState(false);
  const [viewer, setViewer] = useState(false);
  const images = getProjectImages(project.id);
  const cover = images[0];
  const number = String(project.missionNumber).padStart(2, "0");
  const detailsId = `project-details-${project.id}`;

  const coverFrame = cn(
    "relative block aspect-video w-full overflow-hidden border-b-[4px] border-primary bg-surface-container-lowest",
    featured && "md:aspect-auto md:min-h-full md:border-b-0 md:border-r-[4px]",
  );

  return (
    <article
      className={cn(
        "flex flex-col border-[4px] border-primary bg-surface-container shadow-[8px_8px_0_0_#020617] transition-transform duration-200 [transition-timing-function:steps(3)] hover:-translate-y-1",
        featured && "md:col-span-2 md:grid md:grid-cols-2",
      )}
    >
      {cover ? (
        <button
          type="button"
          onClick={() => setViewer(true)}
          aria-label={`View ${project.title} screenshots`}
          className={cn("group", coverFrame, FOCUS)}
        >
          <img
            src={cover}
            alt={`${project.title} screenshot`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 [transition-timing-function:steps(5)] group-hover:scale-110"
          />
          <span className="absolute right-2 top-2 bg-background/85 px-2 py-1 font-label-sm text-label-sm text-primary">
            ▣ {images.length} {images.length === 1 ? "PHOTO" : "PHOTOS"}
          </span>
        </button>
      ) : (
        <div className={cn("no-signal flex items-center justify-center", coverFrame)} aria-hidden="true">
          <span className="bg-background px-3 py-2 font-label-sm text-label-sm uppercase text-on-surface-variant">Preview coming soon</span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Tag>Project {number}</Tag>
          <Tag tone="outline">{project.role}</Tag>
        </div>

        <div>
          <h3 className="font-headline-md text-headline-md leading-relaxed text-primary">{project.title}</h3>
          <p className="mt-3 font-inter text-base leading-7 text-on-surface">{project.purpose}</p>
        </div>

        <ul className="flex flex-wrap gap-2" aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t}>
              <Chip>{t}</Chip>
            </li>
          ))}
        </ul>

        {project.features.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={detailsId}
              className={cn("font-label-sm text-label-sm uppercase text-primary hover:text-secondary", FOCUS)}
            >
              {open ? "▼ Hide details" : "▶ Show details"}
            </button>
            {open && (
              <ul id={detailsId} className="mt-3 flex flex-col gap-2">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 font-inter text-[15px] leading-6 text-on-surface">
                    <span aria-hidden="true" className="mt-0.5 text-secondary">
                      ▶
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-auto flex flex-wrap gap-3 pt-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className={btn.primary}>
                Live site ↗
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className={btn.secondary}>
                Source ↗
              </a>
            )}
          </div>
        )}
      </div>

      {viewer && <Lightbox images={images} title={project.title} onClose={() => setViewer(false)} />}
    </article>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-28 py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionTitle title="PROJECTS" meta="Competition, client, course, and personal projects. Open “Show details” on a card for the full feature list." />
        <div className="grid gap-8 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- skills */

// Purely visual accent per group (same idea as the game's Inventory).
const GROUP_COLOR = { frontend: "#7dd3fc", backend: "#86efac", design: "#c4b5fd", tools: "#fcd34d" } as const;

export function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-28 py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionTitle title="SKILLS" meta="Languages, frameworks, databases, and tools I work with." />
        <div className="grid gap-8 md:grid-cols-2">
          {FORMAL.skillGroups.map((g) => (
            <div key={g.key} className="border-[4px] border-surface-variant bg-surface-container shadow-[8px_8px_0_0_#020617]">
              <div className="h-1.5" style={{ backgroundColor: GROUP_COLOR[g.key] }} aria-hidden="true" />
              <div className="p-5 sm:p-6">
                <h3 className="mb-4 font-headline-md text-headline-md leading-relaxed text-primary">{g.title}</h3>
                <ul className="flex flex-wrap gap-3">
                  {g.items.map((item) => (
                    <li key={item}>
                      <span className="inline-block border-4 border-outline-variant bg-surface-variant px-3 py-2 font-label-sm text-label-sm text-primary transition-colors hover:border-primary">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-[4px] border-surface-variant bg-surface-container-lowest p-4">
          <span className="font-label-sm text-label-sm uppercase text-surface-tint">Soft skills</span>
          {FORMAL.softSkills.map((s) => (
            <Tag key={s} tone="outline">
              {s}
            </Tag>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- education */

export function EducationSection() {
  const e = FORMAL.education;
  return (
    <section id="education" className="scroll-mt-28 py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionTitle title="EDUCATION" meta="Academic background." />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="border-[4px] border-primary bg-surface-container p-5 shadow-[8px_8px_0_0_#020617] sm:p-8 lg:col-span-2">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Tag tone="solid">{e.period}</Tag>
              <Tag>{e.unit}</Tag>
            </div>
            <h3 className="font-headline-md text-headline-md leading-relaxed text-primary">{e.school}</h3>
            <p className="mt-3 font-inter text-base leading-7 text-on-surface">{e.program}</p>
            <p className="mb-3 mt-6 font-label-sm text-label-sm uppercase text-surface-tint">Relevant courses</p>
            <ul className="flex flex-wrap gap-2">
              {e.courses.map((c) => (
                <li key={c}>
                  <Chip>{c}</Chip>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between gap-6 border-[4px] border-secondary bg-surface-container-lowest p-5 shadow-[8px_8px_0_0_#020617] sm:p-8">
            <p className="font-label-sm text-label-sm uppercase text-secondary">▶ Currently</p>
            <p className="font-headline-md text-headline-md leading-relaxed text-on-surface">Semester 5, focusing on Full Stack Development</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- achievements */

function AchievementCard({ id, title, subtitle, rank, organizer, date, description }: (typeof ACHIEVEMENTS)[number]) {
  const [viewer, setViewer] = useState(false);
  const images = getCertificateImages(id);
  const preview = images[0];

  return (
    <article className="flex flex-col gap-4 border-[4px] border-primary bg-surface-container p-5 shadow-[8px_8px_0_0_#020617] sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone="solid">Unlocked</Tag>
        {date && <Tag>{date}</Tag>}
        {rank && <Tag tone="gold">{rank}</Tag>}
      </div>

      {preview && (
        <button
          type="button"
          onClick={() => setViewer(true)}
          aria-label={`View ${title} certificate`}
          className={cn("group relative block aspect-[4/3] w-full overflow-hidden border-[4px] border-surface-variant bg-surface-container-lowest hover:border-primary", FOCUS)}
        >
          <img src={preview} alt={`${title} certificate`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-300 [transition-timing-function:steps(5)] group-hover:scale-110" />
          <span className="absolute bottom-2 left-2 bg-background/85 px-2 py-1 font-label-sm text-label-sm text-primary">▶ View certificate</span>
        </button>
      )}

      <div>
        <h3 className="font-headline-md text-headline-md leading-relaxed text-primary">{title}</h3>
        {subtitle && <p className="mt-2 font-label-sm text-label-sm uppercase text-on-surface-variant">{subtitle}</p>}
      </div>

      {description && <p className="font-inter text-base leading-7 text-on-surface">{description}</p>}
      {organizer && (
        <p className="font-inter text-sm leading-6 text-on-surface-variant">
          Organizer: <span className="text-on-surface">{organizer}</span>
        </p>
      )}

      {viewer && <Lightbox images={images} title={title} onClose={() => setViewer(false)} />}
    </article>
  );
}

export function AchievementsSection() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.status === "Unlocked");
  return (
    <section id="achievements" className="scroll-mt-28 py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionTitle title="ACHIEVEMENTS" meta="Competitions and certifications." />
        <div className="grid gap-8 md:grid-cols-2">
          {unlocked.map((a) => (
            <AchievementCard key={a.id} {...a} />
          ))}
        </div>
      </div>
    </section>
  );
}
