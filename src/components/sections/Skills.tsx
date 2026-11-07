import { useEffect, useMemo, useState } from "react";
import { SKILLS } from "@/data/skills";
import { PROJECTS } from "@/data/projects";
import { InventoryItem } from "@/components/game/InventoryItem";
import { PixelReveal } from "@/components/game/PixelReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PixelCard } from "@/components/ui/PixelCard";
import { cn } from "@/lib/utils";
import type { Skill, SkillCategory } from "@/types";

const CATEGORIES: SkillCategory[] = ["FRONTEND", "BACKEND", "DATABASE", "OTHER"];

// Purely visual accent per category.
const CATEGORY_COLOR: Record<SkillCategory, string> = {
  FRONTEND: "#7dd3fc",
  BACKEND: "#86efac",
  DATABASE: "#fcd34d",
  OTHER: "#c4b5fd",
};

const missionsUsing = (skill: Skill) =>
  PROJECTS.filter((p) => p.tech.some((t) => t.toLowerCase() === skill.name.toLowerCase()));

interface SkillsProps {
  /** Lets a mission chip in the inspector jump straight to that mission's page. */
  onOpenProject?: (id: string) => void;
}

export function Skills({ onOpenProject }: SkillsProps) {
  const [category, setCategory] = useState<SkillCategory>("BACKEND");
  const [selected, setSelected] = useState<Skill | null>(() => SKILLS.find((s) => s.category === "BACKEND") ?? null);

  const filtered = useMemo(() => SKILLS.filter((s) => s.category === category), [category]);
  const usage = useMemo(() => Object.fromEntries(SKILLS.map((s) => [s.name, missionsUsing(s).length])), []);

  const chooseCategory = (cat: SkillCategory) => {
    setCategory(cat);
    setSelected(SKILLS.find((s) => s.category === cat) ?? null); // never show an empty inspector
  };

  // ◀ ▶ browse items inside the current category.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (filtered.length < 2) return;
      const idx = Math.max(0, filtered.findIndex((s) => s.name === selected?.name));
      const next = (idx + (e.key === "ArrowRight" ? 1 : -1) + filtered.length) % filtered.length;
      setSelected(filtered[next]);
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, selected]);

  const used = selected ? missionsUsing(selected) : [];
  const slot = selected ? filtered.findIndex((s) => s.name === selected.name) + 1 : 0;

  return (
    <div className="flex w-full flex-col gap-grid-gutter">
      <SectionHeader title="INVENTORY" meta={`ITEMS CATALOGUED: ${SKILLS.length}`} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:w-3/5">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Skill category">
            {CATEGORIES.map((cat) => {
              const active = cat === category;
              const count = SKILLS.filter((s) => s.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => chooseCategory(cat)}
                  className={cn(
                    "min-w-[110px] flex-1 border-4 px-2 py-2 font-label-sm text-label-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60",
                    active
                      ? "border-primary bg-primary text-on-primary"
                      : "border-outline-variant bg-surface-container-high text-primary hover:border-primary",
                  )}
                >
                  {cat} <span className={active ? "opacity-70" : "text-on-surface-variant"}>{String(count).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>

          <PixelCard>
            {filtered.length === 0 ? (
              <p className="py-8 text-center font-body-md text-body-md text-on-surface-variant">
                No items in this category yet.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                  {filtered.map((skill, i) => (
                    <InventoryItem
                      key={skill.name}
                      skill={skill}
                      slot={i + 1}
                      usedIn={usage[skill.name] ?? 0}
                      color={CATEGORY_COLOR[skill.category]}
                      selected={selected?.name === skill.name}
                      onSelect={setSelected}
                    />
                  ))}
                </div>
                <p className="mt-4 font-label-sm text-label-sm text-on-surface-variant">
                  ◀ ▶ BROWSE ITEMS · ×N = USED IN N MISSIONS
                </p>
              </>
            )}
          </PixelCard>
        </div>

        <div className="w-full lg:w-2/5">
          <PixelCard className="min-h-[260px]">
            {selected ? (
              <div key={selected.name} className="relative flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="border-2 px-2 py-1 font-label-sm text-label-sm text-on-primary"
                    style={{ backgroundColor: CATEGORY_COLOR[selected.category], borderColor: CATEGORY_COLOR[selected.category] }}
                  >
                    {selected.category}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    SLOT {String(slot).padStart(2, "0")}/{String(filtered.length).padStart(2, "0")}
                  </span>
                </div>

                <h2 className="break-words font-headline-lg text-headline-lg text-primary">{selected.name}</h2>

                <div>
                  <p className="mb-2 font-label-sm text-label-sm text-on-surface-variant">
                    EQUIPPED IN {used.length} {used.length === 1 ? "MISSION" : "MISSIONS"}
                  </p>
                  {used.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {used.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            disabled={!onOpenProject}
                            onClick={() => onOpenProject?.(p.id)}
                            className="w-full border-2 border-outline bg-surface-container-high px-3 py-2 text-left font-label-sm text-label-sm text-on-surface transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60 disabled:cursor-default disabled:hover:border-outline disabled:hover:text-on-surface"
                          >
                            ▶ {`MSN-${String(p.missionNumber).padStart(3, "0")}`} {p.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-body-md text-body-md text-on-surface-variant">Not tagged in any mission yet.</p>
                  )}
                </div>

                <PixelReveal cols={12} rows={7} duration={0.4} />
              </div>
            ) : (
              <p className="py-16 text-center font-body-md text-body-md text-on-surface-variant">
                Select an item to inspect it.
              </p>
            )}
          </PixelCard>
        </div>
      </div>
    </div>
  );
}