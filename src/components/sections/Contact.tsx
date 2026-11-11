import { Github, Linkedin, Mail, FileText, Swords, type LucideIcon } from "lucide-react";
import { SOCIAL_LINKS } from "@/data/social";
import { cn } from "@/lib/utils";

/**
 * The CV is picked up automatically: export it from Word as PDF and drop it into
 * src/assets/cv/ (any file name). Until a PDF exists the tile shows COMING SOON.
 * (A link in SOCIAL_LINKS.resumeUrl, e.g. Google Drive, also works as a fallback.)
 */
const cvFiles = import.meta.glob("../../assets/cv/*.pdf", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const CV_URL: string | undefined = Object.values(cvFiles)[0] ?? SOCIAL_LINKS.resumeUrl;
const CV_DOWNLOAD_NAME = "CV-Mochamad-Emil-Baruna-Amirudin.pdf";

const cvActionClass = cn(
  "border-2 border-primary bg-surface px-3 py-2 font-label-sm text-label-sm text-primary transition-colors",
  "hover:bg-primary hover:text-on-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60",
);

function CvTile({ url }: { url?: string }) {
  const ready = Boolean(url);
  return (
    <div
      className={cn(
        "relative flex w-full flex-wrap items-center justify-between gap-4 border-[4px] border-primary bg-surface-container-low p-4 shadow-[4px_4px_0_0_#7dd3fc] md:p-6",
        !ready && "opacity-40",
      )}
    >
      <div className="flex items-center gap-4">
        <FileText aria-hidden="true" className="h-6 w-6 shrink-0 text-primary" />
        <span className="font-headline-md text-headline-md text-on-surface-variant">CV</span>
      </div>
      {ready ? (
        <div className="flex gap-2">
          <a href={url} target="_blank" rel="noreferrer" className={cvActionClass}>
            VIEW
          </a>
          <a href={url} download={CV_DOWNLOAD_NAME} className={cvActionClass}>
            DOWNLOAD
          </a>
        </div>
      ) : (
        <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">COMING SOON</span>
      )}
    </div>
  );
}

interface ContactLinkDef {
  key: string;
  label: string;
  meta: string;
  icon: LucideIcon;
  href?: string;
}

export function Contact() {
  const links: ContactLinkDef[] = [
    { key: "github", label: "GITHUB", meta: "CODE REPOSITORY", icon: Github, href: SOCIAL_LINKS.github },
    { key: "linkedin", label: "LINKEDIN", meta: "PROFESSIONAL NETWORK", icon: Linkedin, href: SOCIAL_LINKS.linkedin },
    {
      key: "email",
      label: "EMAIL",
      meta: "DIRECT MESSAGE",
      icon: Mail,
      href: SOCIAL_LINKS.email ? `mailto:${SOCIAL_LINKS.email}` : undefined,
    },
  ];

  return (
    <div className="flex flex-col w-full gap-grid-gutter pb-8">
      <div className="border-[6px] md:border-[8px] border-primary bg-surface p-6 md:p-8 shadow-[8px_8px_0_0_#7dd3fc]">
        <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary uppercase">
          READY FOR THE NEXT MISSION?
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          Let's talk about what you're building.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-gutter">
        {links.map(({ key, label, meta, icon: Icon, href }) => {
          const disabled = !href;
          return (
            <a
              key={key}
              href={href}
              target={key !== "email" && href ? "_blank" : undefined}
              rel={key !== "email" && href ? "noreferrer" : undefined}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              className={cn(
                "group relative w-full border-[4px] border-primary bg-surface-container-low p-4 md:p-6 shadow-[4px_4px_0_0_#7dd3fc] transition-all flex items-center justify-between gap-4",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60",
                disabled
                  ? "opacity-40 pointer-events-none"
                  : "hover:bg-primary hover:shadow-none hover:translate-x-1 hover:translate-y-1",
              )}
            >
              <div className="flex items-center gap-4">
                <Icon aria-hidden="true" className="w-6 h-6 text-primary group-hover:text-on-primary shrink-0" />
                <span className="font-headline-md text-headline-md text-on-surface-variant group-hover:text-on-primary">
                  {label}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-primary uppercase hidden sm:inline">
                {disabled ? "COMING SOON" : meta}
              </span>
            </a>
          );
        })}
        <CvTile url={CV_URL} />
      </div>

      <div className="w-full flex justify-center mt-4">
        <a
          href={SOCIAL_LINKS.email ? `mailto:${SOCIAL_LINKS.email}` : undefined}
          aria-disabled={!SOCIAL_LINKS.email}
          tabIndex={SOCIAL_LINKS.email ? 0 : -1}
          className={cn(
            "relative border-[6px] md:border-[8px] border-error bg-surface-container-low px-8 py-6 md:px-12 md:py-8 shadow-[8px_8px_0_0_#7f1d1d] transition-all group flex items-center gap-3",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60",
            !SOCIAL_LINKS.email
              ? "opacity-40 pointer-events-none"
              : "hover:translate-x-2 hover:translate-y-2 hover:shadow-none",
          )}
        >
          <Swords aria-hidden="true" className="w-6 h-6 text-error shrink-0" />
          <span className="font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg text-error uppercase">
            Let's build something together
          </span>
        </a>
      </div>
    </div>
  );
}