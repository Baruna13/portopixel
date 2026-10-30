import type { Skill } from "@/types";

/**
 * Skills confirmed in ARCHITECTURE.md §16 only. No proficiency levels,
 * percentages, or "expert/master" labels — none were provided, and the
 * spec explicitly forbids inventing them.
 */
export const SKILLS: Skill[] = [
  // BACKEND
  { name: "Express.js", category: "BACKEND" },
  { name: "Laravel", category: "BACKEND" },
  { name: "Node.js", category: "BACKEND" },
  { name: "PHP", category: "BACKEND" },

  // FRONTEND
  { name: "React", category: "FRONTEND" },
  { name: "React Native", category: "FRONTEND" },
  { name: "HTML", category: "FRONTEND" },
  { name: "CSS", category: "FRONTEND" },
  { name: "JavaScript", category: "FRONTEND" },

  // DATABASE
  { name: "MySQL", category: "DATABASE" },
  { name: "Prisma", category: "DATABASE" },

  // OTHER
  { name: "REST API", category: "OTHER" },
  { name: "JWT", category: "OTHER" },
  { name: "Cloudinary", category: "OTHER" },
  { name: "Git", category: "OTHER" },
  { name: "GitHub", category: "OTHER" },
  { name: "Postman", category: "OTHER" },
];
