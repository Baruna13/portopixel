import { AnimatePresence } from "framer-motion";
import { useGameNavigation } from "@/hooks/useGameNavigation";
import { PROJECTS } from "@/data/projects";
import { PageShell } from "@/components/layout/PageShell";
import { GameTransition } from "@/components/game/GameTransition";
import { ScrollIntro } from "@/components/sections/ScrollIntro";
import { World } from "@/components/sections/World";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { Skills } from "@/components/sections/Skills";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";

export default function App() {
  const {
    hasStarted,
    start,
    activePath,
    navigate,
    activeProjectId,
    openProject,
    closeProject,
    inWorld,
    lastEntered,
    enterBuilding,
    returnToWorld,
  } = useGameNavigation();

  if (!hasStarted) {
    // ScrollIntro renders the existing <Hero /> as its last scene.
    return <ScrollIntro onStart={start} />;
  }

  if (inWorld) {
    // Open-world hub: walk to a building to open that section.
    return <World spawnPath={lastEntered} onEnter={enterBuilding} />;
  }

  const activeProject = activeProjectId ? PROJECTS.find((p) => p.id === activeProjectId) : undefined;
  const transitionKey = activeProject ? `${activePath}:${activeProject.id}` : activePath;

  return (
    <PageShell activePath={activePath} onNavigate={navigate} onExitToMap={returnToWorld}>
      <AnimatePresence mode="wait">
        <GameTransition key={transitionKey}>
          {activePath === "profile" && <About />}
          {activePath === "missions" &&
            (activeProject ? (
              <ProjectDetail project={activeProject} onBack={closeProject} />
            ) : (
              <Projects onOpenProject={openProject} />
            ))}
          {activePath === "inventory" && <Skills />}
          {activePath === "trophies" && <Achievements />}
          {activePath === "contact" && <Contact />}
        </GameTransition>
      </AnimatePresence>
    </PageShell>
  );
}