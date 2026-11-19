import type { Skill } from "@/types";

/**
 * Synced with the CV (Kemampuan) plus the tech named in the listed projects.
 * No proficiency levels or percentages: none were provided, and none must be invented.
 */
export const SKILLS: Skill[] = [
  // BACKEND
  { name: "Laravel", category: "BACKEND" },
  { name: "PHP", category: "BACKEND" },
  { name: "Node.js", category: "BACKEND" },
  { name: "Express.js", category: "BACKEND" },

  // FRONTEND
  { name: "React", category: "FRONTEND" },
  { name: "Next.js", category: "FRONTEND" },
  { name: "Flutter", category: "FRONTEND" },
  { name: "JavaScript", category: "FRONTEND" },
  { name: "TypeScript", category: "FRONTEND" },
  { name: "Tailwind CSS", category: "FRONTEND" },
  { name: "HTML", category: "FRONTEND" },
  { name: "CSS", category: "FRONTEND" },

  // DATABASE
  { name: "MySQL", category: "DATABASE" },
  { name: "PostgreSQL", category: "DATABASE" },
  { name: "MongoDB", category: "DATABASE" },
  { name: "Supabase", category: "DATABASE" },
  { name: "Prisma", category: "DATABASE" },

  // OTHER
  { name: "REST API", category: "OTHER" },
  { name: "Git", category: "OTHER" },
  { name: "GitHub", category: "OTHER" },
  { name: "Postman", category: "OTHER" },
  { name: "Vercel", category: "OTHER" },
  { name: "PHPUnit", category: "OTHER" },
  { name: "Figma", category: "OTHER" },
  { name: "Electron", category: "OTHER" },
  { name: "Google Maps API", category: "OTHER" },
  { name: "Leaflet.js", category: "OTHER" },
  { name: "Turf.js", category: "OTHER" },
  { name: "JWT", category: "OTHER" },
  { name: "Cloudinary", category: "OTHER" },
];
