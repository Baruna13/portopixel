import { Github, Linkedin, Mail, FileText, Swords, type LucideIcon } from "lucide-react";
import { SOCIAL_LINKS } from "@/data/social";
import { cn } from "@/lib/utils";

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
    { key: "resume", label: "RESUME", meta: "CHARACTER SHEET", icon: FileText, href: SOCIAL_LINKS.resumeUrl },
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
              <span className="font-label-sm text-label-sm text-surface-variant group-hover:text-on-primary uppercase hidden sm:inline">
                {disabled ? "COMING SOON" : meta}
              </span>
            </a>
          );
        })}
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
