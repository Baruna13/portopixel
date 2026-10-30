import { PROJECTS } from "@/data/projects";
import { MissionCard } from "@/components/game/MissionCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Projects() {
  return (
    <div className="flex flex-col w-full gap-grid-gutter pb-8">
      <SectionHeader title="ACTIVE MISSIONS" meta={`CURRENT ARCHIVE LOADED: ${PROJECTS.length} LOGS FOUND`} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-grid-gutter">
        {PROJECTS.map((project) => (
          <MissionCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
