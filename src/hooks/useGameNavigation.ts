import { useEffect, useState } from "react";

export type NavPath = "profile" | "missions" | "inventory" | "trophies" | "contact";

export interface NavItem {
  path: NavPath;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: "profile", label: "PROFILE" },
  { path: "missions", label: "MISSIONS" },
  { path: "inventory", label: "INVENTORY" },
  { path: "trophies", label: "TROPHIES" },
  { path: "contact", label: "CONTACT" },
];

interface ProjectHistoryState {
  project?: string;
}

export function useGameNavigation(initial: NavPath = "profile") {
  const [hasStarted, setHasStarted] = useState(false);
  const [activePath, setActivePath] = useState<NavPath>(initial);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  // Open-world: true while the player is walking around the city map.
  const [inWorld, setInWorld] = useState(false);
  // The last building the player went into: they spawn at its door when they come back.
  const [lastEntered, setLastEntered] = useState<NavPath | null>(null);

  // Browser back/forward button closes / reopens the project detail page.
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const state = event.state as ProjectHistoryState | null;
      if (state?.project) {
        setActivePath("missions");
        setActiveProjectId(state.project);
      } else {
        setActiveProjectId(null);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openProject = (id: string) => {
    setActivePath("missions");
    setActiveProjectId(id);
    window.history.pushState({ project: id } satisfies ProjectHistoryState, "", `#missions/${id}`);
  };

  const closeProject = () => {
    const state = window.history.state as ProjectHistoryState | null;
    if (state?.project) {
      window.history.back(); // popstate handler clears the project
    } else {
      setActiveProjectId(null);
    }
  };

  const navigate = (path: NavPath) => {
    setActivePath(path);
    setActiveProjectId(null);
    setLastEntered(path);
  };

  const enterBuilding = (path: NavPath) => {
    setActivePath(path);
    setActiveProjectId(null);
    setLastEntered(path);
    setInWorld(false);
  };

  const returnToWorld = () => setInWorld(true);

  return {
    hasStarted,
    start: () => {
      setHasStarted(true);
      setInWorld(true);
    },
    activePath,
    navigate,
    activeProjectId,
    openProject,
    closeProject,
    inWorld,
    lastEntered,
    enterBuilding,
    returnToWorld,
  };
}