import { AnimatePresence } from "framer-motion";
import { useGameNavigation } from "@/hooks/useGameNavigation";
import { PageShell } from "@/components/layout/PageShell";
import { GameTransition } from "@/components/game/GameTransition";
import { ScrollIntro } from "@/components/sections/ScrollIntro";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";

export default function App() {
  const { hasStarted, start, activePath, navigate } = useGameNavigation();

  if (!hasStarted) {
    // ScrollIntro renders the existing <Hero /> as its last scene.
    return <ScrollIntro onStart={start} />;
  }

  return (
    <PageShell activePath={activePath} onNavigate={navigate}>
      <AnimatePresence mode="wait">
        <GameTransition key={activePath}>
          {activePath === "profile" && <About />}
          {activePath === "missions" && <Projects />}
          {activePath === "inventory" && <Skills />}
          {activePath === "trophies" && <Achievements />}
          {activePath === "contact" && <Contact />}
        </GameTransition>
      </AnimatePresence>
    </PageShell>
  );
}