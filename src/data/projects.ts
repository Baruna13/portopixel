import type { Project } from "@/types";

/**
 * Keep project details factual; only add metrics, outcomes, and links when
 * they are confirmed. Trisis GYM Web and Mobile are separate projects.
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
  {
    id: "riecharge",
    missionNumber: 6,
    title: "Rie.Charge — Juice E-commerce Website",
    role: "Backend Developer",
    status: "Completed",
    purpose:
      "An e-commerce website for browsing and ordering fresh juices, fitshots, and other healthy products.",
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
];
