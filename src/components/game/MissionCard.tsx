import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/types";

interface MissionCardProps {
  project: Project;
}

export function MissionCard({ project }: MissionCardProps) {
  const [open, setOpen] = useState(false);
  const detailId = useId();

  return (
    <article className="relative bg-surface-container border-[8px] border-surface-variant p-1 shadow-[8px_8px_0_0_#020617] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#020617]">
      <div className="border-[4px] border-primary p-4 h-full flex flex-col bg-surface relative">
        <div className="flex justify-between items-start mb-4 gap-2">
          <div>
            <span className="font-label-sm text-label-sm text-surface-tint bg-surface-variant px-2 py-1 mb-2 inline-block">
              {`MSN-${String(project.missionNumber).padStart(3, "0")}`}
            </span>
            <h2 className="font-headline-md text-headline-md text-primary leading-relaxed">{project.title}</h2>
          </div>
          <div className="flex items-center gap-2 bg-inverse-surface px-2 py-1 border-2 border-primary shrink-0">
            <span className="font-label-sm text-label-sm text-background">CLEAR</span>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">ROLE</p>
            <p className="font-body-md text-body-md text-on-surface">{project.role}</p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">OBJECTIVE</p>
            <p className="font-body-md text-body-md text-on-surface">{project.purpose}</p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">EQUIPMENT</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-label-sm text-label-sm text-on-surface bg-surface-container-high border-2 border-outline px-2 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {project.features.length > 0 && (
          <>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={detailId}
              onClick={() => setOpen((o) => !o)}
              className="mt-4 self-start font-label-sm text-label-sm text-secondary border-2 border-secondary px-3 py-2 hover:bg-secondary hover:text-on-secondary transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60"
            >
              {open ? "[ HIDE MISSION LOG ]" : "[ VIEW MISSION ]"}
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={detailId}
                  key="detail"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 border-t-[4px] border-surface-variant pt-4">
                    <p className="font-label-sm text-label-sm text-secondary mb-2">FEATURES</p>
                    <ul className="font-body-md text-body-md text-on-surface space-y-2">
                      {project.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <span aria-hidden="true" className="text-secondary mt-1">
                            ▶
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </article>
  );
}
