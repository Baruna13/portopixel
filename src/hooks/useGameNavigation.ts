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
  };

  return {
    hasStarted,
    start: () => setHasStarted(true),
    activePath,
    navigate,
    activeProjectId,
    openProject,
    closeProject,
  };
}