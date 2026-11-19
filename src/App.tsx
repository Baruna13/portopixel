import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { music } from "@/lib/music";
import { useGameNavigation } from "@/hooks/useGameNavigation";
import { PROJECTS } from "@/data/projects";
import { PageShell } from "@/components/layout/PageShell";
import { GameTransition } from "@/components/game/GameTransition";
import { ScrollIntro } from "@/components/sections/ScrollIntro";
import { World } from "@/components/sections/World";
import { FormalPortfolio } from "@/components/formal/FormalPortfolio";
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

  // Which version of the portfolio is shown. "#formal" in the URL opens the formal version
  // directly, so that link can be shared with recruiters.
  const [siteMode, setSiteMode] = useState<"game" | "formal">(() =>
    window.location.hash === "#formal" ? "formal" : "game",
  );

  const goFormal = useCallback(() => {
    music.setSuspended(true); // the formal version is silent
    window.history.replaceState(null, "", "#formal");
    setSiteMode("formal");
    window.scrollTo(0, 0);
  }, []);

  const goGame = useCallback(() => {
    music.setSuspended(false);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setSiteMode("game");
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    music.setSuspended(siteMode === "formal");
  }, [siteMode]);

  // Browsers only allow audio after a user gesture: start the music on the first click / key press.
  useEffect(() => {
    const go = () => music.start();
    window.addEventListener("click", go);
    window.addEventListener("keydown", go);
    return () => {
      window.removeEventListener("click", go);
      window.removeEventListener("keydown", go);
    };
  }, []);

  if (siteMode === "formal") {
    return <FormalPortfolio onSwitchToGame={goGame} />;
  }

  if (!hasStarted) {
    // ScrollIntro renders the existing <Hero /> as its last scene.
    return <ScrollIntro onStart={start} onChooseFormal={goFormal} />;
  }

  if (inWorld) {
    // Open-world hub: walk to a building to open that section.
    return <World spawnPath={lastEntered} onEnter={enterBuilding} onSwitchToFormal={goFormal} />;
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
          {activePath === "inventory" && <Skills onOpenProject={openProject} />}
          {activePath === "trophies" && <Achievements />}
          {activePath === "contact" && <Contact />}
        </GameTransition>
      </AnimatePresence>
    </PageShell>
  );
}
