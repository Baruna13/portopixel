import { useState } from "react";

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

export function useGameNavigation(initial: NavPath = "profile") {
  const [hasStarted, setHasStarted] = useState(false);
  const [activePath, setActivePath] = useState<NavPath>(initial);

  return {
    hasStarted,
    start: () => setHasStarted(true),
    activePath,
    navigate: setActivePath,
  };
}
