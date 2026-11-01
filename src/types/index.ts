/**
 * Core content types for the portfolio.
 *
 * These types intentionally do NOT include fields for things the real
 * portfolio data doesn't have confirmed values for (e.g. metrics, user
 * counts, client names, proficiency scores, demo/live URLs). Do not add
 * such fields "for flexibility" — see ARCHITECTURE.md §6, §16, §28.
 */

export type ProjectRole =
  | "Backend Developer"
  | "Fullstack Developer";

export type ProjectStatus = "Completed";

/** A single technology/tool used on a project. Free text, no versioning claims. */
export type TechStack = string;

export interface Project {
  /** Stable identifier, kebab-case. Used for routing/keys, not displayed. */
  id: string;
  /** Sequential mission number for display, e.g. "MISSION 01". */
  missionNumber: number;
  title: string;
  role: ProjectRole;
  status: ProjectStatus;
  /** One or two sentence factual description of what the project is/does. */
  purpose: string;
  tech: TechStack[];
  /** Confirmed feature list only — no invented outcomes or impact claims. */
  features: string[];
  /**
   * Optional links. Omit entirely (do not set to a placeholder string)
   * when a real URL is not known — see ARCHITECTURE.md §6, §25.
   */
  repoUrl?: string;
  liveUrl?: string;
}

export type AchievementStatus = "Unlocked" | "Locked";

export interface Achievement {
  id: string;
  status: AchievementStatus;
  title: string;
  /** Only present for unlocked achievements with confirmed detail. */
  subtitle?: string;
  /** Result/placement as confirmed, e.g. "Semifinalist". Only for confirmed results. */
  rank?: string;
  organizer?: string;
  /** Human-readable date as confirmed (e.g. "October 2025"), not a Date object. */
  date?: string;
  description?: string;
}

export type SkillCategory = "BACKEND" | "FRONTEND" | "DATABASE" | "OTHER";

export interface Skill {
  name: string;
  category: SkillCategory;
}

/**
 * Social/contact links. Every field is optional and should be left
 * undefined (not a placeholder string) until a real value is supplied.
 * Components must render a sensible empty/disabled state when a field
 * is missing rather than falling back to a fake URL.
 */
export interface SocialLinks {
  github?: string;
  linkedin?: string;
  email?: string;
  resumeUrl?: string;
}

export interface PlayerProfile {
  name: string;
  class: string;
  roles: ProjectRole[];
  focus: string[];
  /** Optional — only set when explicitly confirmed. See ARCHITECTURE.md §25. */
  location?: string;
  /**
   * Optional portrait image, imported from src/assets/.
   * When unset, the UI falls back to a generic icon placeholder.
   */
  avatarUrl?: string;
}