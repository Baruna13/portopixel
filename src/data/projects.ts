import type { Project } from "@/types";

/**
 * Verified project data only. Every field here is sourced directly from
 * ARCHITECTURE.md §6–§10. Do NOT add stats, results, client names, user
 * counts, or repo/live URLs unless explicitly confirmed — leave the
 * optional fields unset instead.
 *
 * Trisis GYM Web and Trisis GYM Mobile are kept as two separate entries
 * per explicit instruction — do not merge them.
 */
export const PROJECTS: Project[] = [
  {
    id: "akseskota",
    missionNumber: 1,
    title: "AksesKota",
    role: "Backend Developer",
    status: "Completed",
    purpose:
      "An inclusive pedestrian navigation platform designed to help elderly people and people with disabilities discover safer routes for casual walks.",
    tech: ["Express.js", "TypeScript", "Prisma", "MySQL", "JWT", "Cloudinary"],
    features: [
      "Pedestrian route navigation",
      "Safer route recommendations",
      "Obstacle reporting",
      "Pedestrian path condition management",
      "Community verification",
      "Authentication and authorization",
    ],
    liveUrl: "https://akseskota.vercel.app",
  },
  {
    id: "re-food",
    missionNumber: 2,
    title: "RE-FOOD",
    role: "Fullstack Developer",
    status: "Completed",
    purpose:
      "A food donation platform designed to connect food donors with recipients and support food redistribution.",
    tech: ["Laravel", "React", "HTML", "CSS", "JavaScript"],
    features: [],
  },
  {
    id: "trisis-gym-web",
    missionNumber: 3,
    title: "Trisis GYM — Web Application",
    role: "Backend Developer",
    status: "Completed",
    purpose:
      "Member management and attendance system for a gym, built as a web application.",
    tech: ["Laravel", "PHP", "MySQL", "REST API"],
    features: [
      "Member management",
      "QR-based attendance",
      "Manual visit recording",
      "Attendance reports",
      "Visit reports",
      "Notifications",
    ],
  },
  {
    id: "trisis-gym-mobile",
    missionNumber: 4,
    title: "Trisis GYM — Mobile Application",
    role: "Backend Developer",
    status: "Completed",
    purpose:
      "Mobile companion application for gym member data, attendance, and visit management.",
    tech: ["React Native", "Laravel", "PHP", "MySQL", "REST API"],
    features: [
      "Member data",
      "Attendance",
      "Visit management",
      "Backend API integration",
      "Authentication",
    ],
  },
  {
    id: "perpustakaan",
    missionNumber: 5,
    title: "Perpustakaan",
    role: "Fullstack Developer",
    status: "Completed",
    purpose: "A library management system with a public site and admin dashboard.",
    tech: ["Laravel", "PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    features: [
      "Library management",
      "Member management",
      "Book data management",
      "Public library website",
      "Admin dashboard",
      "Database management",
    ],
  },
];
