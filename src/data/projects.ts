import type { Project } from "@/types";

/**
 * Project data kept in line with the CV. Do NOT add stats, results, client
 * names, user counts, or repo/live URLs unless explicitly confirmed — leave
 * the optional fields unset instead.
 *
 * Trisis GYM is ONE entry: the finished version is the Electron app.
 * Screenshots go in src/assets/projects/<id>/ (e.g. .../trisis-gym/1.png).
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
  },
  {
    id: "riecharge",
    missionNumber: 2,
    title: "Rie.Charge — Juice E-commerce Website",
    role: "Backend Developer",
    status: "Completed",
    purpose: "An e-commerce website for browsing and ordering fresh juices, fitshots, and other healthy products.",
    tech: ["Laravel", "PHP", "MySQL", "REST API"],
    features: [
      "Product catalog with category filters",
      "Product descriptions and pricing",
      "Shopping cart",
      "Next-day delivery date information",
      "Featured products and bundle offers",
    ],
    liveUrl: "https://riecharge.infinityfreeapp.com/index.php",
  },
  {
    id: "re-food",
    missionNumber: 3,
    title: "RE-FOOD",
    role: "Fullstack Developer",
    status: "Completed",
    purpose: "A food donation platform designed to connect food donors with recipients and support food redistribution.",
    tech: ["Flutter", "Laravel", "MongoDB", "Google Maps API", "REST API"],
    features: ["Food donation distribution", "Live tracking of volunteers"],
  },
  {
    id: "trisis-gym",
    missionNumber: 4,
    title: "Trisis GYM",
    role: "Developer",
    status: "Completed",
    purpose: "A desktop application for gym member management and attendance, built for a client.",
    tech: ["Electron", "PHP"],
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
    id: "perpustakaan",
    missionNumber: 5,
    title: "Perpustakaan",
    role: "Fullstack Developer",
    status: "Completed",
    purpose:
      "A library book-lending information system for Pondok Pesantren Darud Da'wah Wal Irsyad (DDI) Mangkoso.",
    tech: ["Laravel", "PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    features: [
      "Member data management",
      "Book borrowing and returns",
      "Fines",
      "Reports",
      "Public library website",
      "Admin dashboard",
    ],
  },
];