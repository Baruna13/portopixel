import { useEffect, useState } from "react";
import { FileText, Gamepad2, Github, GraduationCap, Linkedin, Mail, MapPin } from "lucide-react";
import { PLAYER_PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import { ACHIEVEMENTS } from "@/data/achievements";
import { SOCIAL_LINKS } from "@/data/social";
import { FORMAL } from "@/data/formal";
import { CV_DOWNLOAD_NAME, CV_URL } from "@/data/cv";
import avatarSheetUrl from "@/assets/world/avatar-walk.png";
import backdropUrl from "@/assets/world/backdrop.png";
import { CityBackdrop } from "@/components/layout/CityBackdrop";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { AchievementsSection, EducationSection, ProjectsSection, SkillsSection } from "./FormalSections";
import { FOCUS, SectionTitle, Tag, btn } from "./ui";

/** Optional formal portrait: put a photo in src/assets/formal/ (any .jpg/.png/.webp). */
const portraitFiles = import.meta.glob("../../assets/formal/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const PORTRAIT: string | undefined = Object.values(portraitFiles)[0];

const NAV = [
  { id: "overview", label: "Profile" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;
const NAV_IDS = NAV.map((n) => n.id);

function useActiveSection() {
  const [active, setActive] = useState<string>(NAV_IDS[0]);
  useEffect(() => {
    const els = NAV_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return active;
}

/** The pixel avatar's standing frame, used when no formal portrait photo has been added. */
function PixelAvatar() {
  const scale = 5; // the sheet has 6 frames of 31x60; frame 0 is standing
  return (
    <div
      role="img"
      aria-label="Pixel-art avatar of Baruna"
      style={{
        width: 31 * scale,
        height: 60 * scale,
        backgroundImage: `url(${avatarSheetUrl})`,
        backgroundSize: `${31 * 6 * scale}px ${60 * scale}px`,
        backgroundPosition: "0 0",
        imageRendering: "pixelated",
      }}
    />
  );
}

const TILE =
  "group flex w-full items-center justify-between gap-4 border-[4px] border-primary bg-surface-container-low p-4 shadow-[4px_4px_0_0_#7dd3fc] transition-all hover:-translate-y-1 hover:bg-surface-variant md:p-5";

interface FormalPortfolioProps {
  onSwitchToGame: () => void;
}

export function FormalPortfolio({ onSwitchToGame }: FormalPortfolioProps) {
  const reduced = usePrefersReducedMotion();
  const active = useActiveSection();

  // The game's global CSS locks html/body overflow; this class restores normal page scrolling.
  useEffect(() => {
    document.documentElement.classList.add("formal-mode");
    document.body.style.overflow = "";
    return () => document.documentElement.classList.remove("formal-mode");
  }, []);

  const goTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });

  const award = ACHIEVEMENTS.find((a) => a.status === "Unlocked" && a.rank);
  const facts = [
    { label: "Projects", value: String(PROJECTS.length), sub: "Competition, client, course & personal" },
    { label: "Education", value: "D4 TRPL", sub: "IPB University · Semester 5" },
    ...(award ? [{ label: "Achievement", value: award.rank ?? "", sub: `${award.subtitle ?? award.title} · ${award.date ?? ""}` }] : []),
    { label: "Focus", value: "Full Stack", sub: "Web & mobile applications" },
  ];

  return (
    <div className="relative isolate min-h-screen bg-background font-inter text-on-surface antialiased">
      <CityBackdrop />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-background/80" />

      <div className="relative z-10">
        {/* ------------------------------------------------------------ header */}
        <header className="sticky top-0 z-50 border-b-[4px] border-primary bg-surface-container-high/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
            <button type="button" onClick={() => goTo("overview")} aria-label="Back to top" className={cn("flex min-w-0 items-center gap-3 text-left", FOCUS)}>
              <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full bg-error shadow-[0_0_8px_#f87171]" />
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-label-sm text-label-sm uppercase text-primary">Mochamad Emil Baruna Amirudin</span>
                <span className="truncate font-label-sm text-label-sm uppercase text-on-surface-variant">Software Engineer</span>
              </span>
            </button>

            <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => goTo(n.id)}
                  aria-current={active === n.id ? "true" : undefined}
                  className={cn(
                    "border-2 px-3 py-2 font-label-sm text-label-sm uppercase transition-colors",
                    FOCUS,
                    active === n.id
                      ? "border-primary bg-primary text-on-primary"
                      : "border-transparent text-on-surface-variant hover:text-primary",
                  )}
                >
                  {active === n.id ? "▶ " : ""}
                  {n.label}
                </button>
              ))}
            </nav>

            <button type="button" onClick={onSwitchToGame} className={cn(btn.secondary, "shrink-0 px-3 py-2")}>
              <Gamepad2 className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Game mode</span>
            </button>
          </div>

          {/* phones & tablets: scrollable section bar */}
          <nav aria-label="Sections" className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden [scrollbar-width:none]">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => goTo(n.id)}
                aria-current={active === n.id ? "true" : undefined}
                className={cn(
                  "shrink-0 border-2 px-3 py-2 font-label-sm text-label-sm uppercase transition-colors",
                  FOCUS,
                  active === n.id ? "border-primary bg-primary text-on-primary" : "border-outline-variant bg-surface-container text-on-surface-variant",
                )}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </header>

        <main>
          {/* --------------------------------------------------------- profile */}
          <section id="overview" className="scroll-mt-28">
            <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:py-14">
              <div className="flex flex-col gap-6 lg:col-span-7">
                <div className="flex flex-wrap gap-2">
                  <Tag tone="outline">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {PLAYER_PROFILE.location}
                  </Tag>
                  <Tag tone="outline">
                    <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                    IPB University · D4 TRPL
                  </Tag>
                </div>

                <div>
                  <p className="font-label-sm text-label-sm uppercase text-surface-tint">▶ Professional profile</p>
                  <h1 className="mt-4 font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg leading-relaxed text-primary [text-shadow:4px_4px_0_#082f49]">
                    MOCHAMAD EMIL BARUNA AMIRUDIN
                  </h1>
                  <p className="mt-4 font-label-sm text-label-sm uppercase text-secondary">{FORMAL.headline}</p>
                </div>

                <p className="max-w-2xl font-inter text-base leading-8 text-on-surface sm:text-lg">{FORMAL.summary}</p>

                {award && (
                  <div className="max-w-xl border-[4px] border-secondary bg-surface-container p-4 shadow-[4px_4px_0_0_#020617]">
                    <p className="font-label-sm text-label-sm uppercase text-secondary">★ Achievement unlocked</p>
                    <p className="mt-2 font-headline-md text-headline-md leading-relaxed text-primary">{award.rank}</p>
                    <p className="mt-1 font-inter text-sm leading-6 text-on-surface-variant">
                      {award.subtitle ?? award.title}, {award.title} · {award.date}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button type="button" onClick={() => goTo("projects")} className={btn.primary}>
                    View projects ▶
                  </button>
                  <button type="button" onClick={() => goTo("contact")} className={btn.secondary}>
                    Contact
                  </button>
                  {CV_URL && (
                    <a href={CV_URL} download={CV_DOWNLOAD_NAME} className={btn.secondary}>
                      Download CV
                    </a>
                  )}
                </div>
              </div>

              <div className="flex justify-center lg:col-span-5">
                <div className="w-full max-w-[400px] border-[8px] border-primary bg-surface-container p-1 shadow-[8px_8px_0_0_#020617]">
                  <div className="relative aspect-[4/5] overflow-hidden border-[4px] border-surface-variant bg-surface-container-lowest">
                    {PORTRAIT ? (
                      <img src={PORTRAIT} alt="Portrait of Mochamad Emil Baruna Amirudin" className="h-full w-full object-cover" />
                    ) : (
                      <>
                        <img src={backdropUrl} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover [image-rendering:pixelated]" />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-transparent to-background/70" />
                        <div className="absolute inset-x-0 bottom-16 flex justify-center">
                          <div className="-scale-x-100">
                            <PixelAvatar />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 border-2 border-primary bg-background/90 px-3 py-2 font-label-sm text-label-sm uppercase">
                      <span className="text-primary">▶ {PLAYER_PROFILE.location}</span>
                      <span className="text-secondary">2024 - Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* quick facts, all from the CV */}
            <ul className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-4 pb-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
              {facts.map((f) => (
                <li key={f.label} className="flex flex-col gap-3 border-[4px] border-surface-variant bg-surface-container-lowest p-4 shadow-[4px_4px_0_0_#020617]">
                  <span className="font-label-sm text-label-sm uppercase text-surface-tint">{f.label}</span>
                  <span className="font-headline-md text-headline-md leading-relaxed text-primary">{f.value}</span>
                  <span className="font-inter text-sm leading-5 text-on-surface-variant">{f.sub}</span>
                </li>
              ))}
            </ul>
          </section>

          <ProjectsSection />
          <SkillsSection />
          <EducationSection />
          <AchievementsSection />

          {/* ----------------------------------------------------------- contact */}
          <section id="contact" className="scroll-mt-28 py-12 md:py-16">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
              <SectionTitle title="CONTACT" meta="Interested in working together? The fastest way to reach me is by email." />
              <div className="grid gap-6 sm:grid-cols-2">
                {SOCIAL_LINKS.email && (
                  <a href={`mailto:${SOCIAL_LINKS.email}`} className={cn(TILE, FOCUS)}>
                    <span className="flex min-w-0 items-center gap-4">
                      <Mail className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block font-headline-md text-headline-md text-on-surface">EMAIL</span>
                        <span className="block truncate font-inter text-sm text-on-surface-variant">{SOCIAL_LINKS.email}</span>
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-secondary">↗</span>
                  </a>
                )}
                {SOCIAL_LINKS.github && (
                  <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className={cn(TILE, FOCUS)}>
                    <span className="flex min-w-0 items-center gap-4">
                      <Github className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block font-headline-md text-headline-md text-on-surface">GITHUB</span>
                        <span className="block truncate font-inter text-sm text-on-surface-variant">github.com/Baruna13</span>
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-secondary">↗</span>
                  </a>
                )}
                {SOCIAL_LINKS.linkedin && (
                  <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className={cn(TILE, FOCUS)}>
                    <span className="flex min-w-0 items-center gap-4">
                      <Linkedin className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block font-headline-md text-headline-md text-on-surface">LINKEDIN</span>
                        <span className="block font-inter text-sm text-on-surface-variant">Professional network</span>
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-secondary">↗</span>
                  </a>
                )}
                {CV_URL && (
                  <div className={cn(TILE, "flex-wrap hover:translate-y-0")}>
                    <span className="flex items-center gap-4">
                      <FileText className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                      <span className="block font-headline-md text-headline-md text-on-surface">CV</span>
                    </span>
                    <span className="flex gap-3">
                      <a href={CV_URL} target="_blank" rel="noreferrer" className={cn(btn.secondary, "px-3 py-2")}>
                        View
                      </a>
                      <a href={CV_URL} download={CV_DOWNLOAD_NAME} className={cn(btn.secondary, "px-3 py-2")}>
                        Download
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t-[4px] border-primary bg-surface-container-high/95">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
            <p className="font-label-sm text-label-sm uppercase text-on-surface-variant">© 2026 Mochamad Emil Baruna Amirudin</p>
            <button type="button" onClick={onSwitchToGame} className={btn.secondary}>
              ▶ Switch to game mode
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
