import { useMemo, useState } from "react";
import { SKILLS } from "@/data/skills";
import { InventoryItem } from "@/components/game/InventoryItem";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import type { Skill, SkillCategory } from "@/types";

const CATEGORIES: SkillCategory[] = ["FRONTEND", "BACKEND", "DATABASE", "OTHER"];

export function Skills() {
  const [category, setCategory] = useState<SkillCategory>("BACKEND");
  const [selected, setSelected] = useState<Skill | null>(null);

  const filtered = useMemo(() => SKILLS.filter((s) => s.category === category), [category]);

  return (
    <div className="flex flex-col w-full gap-grid-gutter">
      <SectionHeader title="INVENTORY" meta={`ITEMS CATALOGUED: ${SKILLS.length}`} />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col w-full lg:w-3/5 gap-4">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Skill category">
            {CATEGORIES.map((cat) => (
              <PixelButton
                key={cat}
                role="tab"
                aria-selected={cat === category}
                variant={cat === category ? "primary" : "secondary"}
                onClick={() => {
                  setCategory(cat);
                  setSelected(null);
                }}
                className="flex-1 min-w-[110px] py-2 text-body-md font-body-md"
              >
                {cat}
              </PixelButton>
            ))}
          </div>

          <PixelCard>
            {filtered.length === 0 ? (
              <p className="font-body-md text-body-md text-on-surface-variant text-center py-8">
                No items in this category yet.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {filtered.map((skill) => (
                  <InventoryItem
                    key={skill.name}
                    skill={skill}
                    selected={selected?.name === skill.name}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            )}
          </PixelCard>
        </div>

        <div className="w-full lg:w-2/5">
          <PixelCard className="flex flex-col items-center text-center min-h-[220px] justify-center">
            {selected ? (
              <>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-2">{selected.name}</h2>
                <span className="px-2 py-1 font-label-sm text-label-sm border-2 bg-primary text-on-primary border-on-primary">
                  {selected.category}
                </span>
              </>
            ) : (
              <p className="font-body-md text-body-md text-on-surface-variant">Select an item to inspect it.</p>
            )}
          </PixelCard>
        </div>
      </div>
    </div>
  );
}
