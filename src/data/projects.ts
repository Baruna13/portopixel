import type { Project } from "@/types";

/**
 * Kept in line with the CV. Do NOT add stats, results, client names, user
 * counts, or repo/live URLs unless explicitly confirmed — leave the optional
 * fields unset instead.
 *
 * Screenshots go in src/assets/projects/<id>/ (1.png, 2.png, ...).
 */
export const PROJECTS: Project[] = [
  {
    id: "akseskota",
    missionNumber: 1,
    title: "AksesKota",
    role: "Backend Developer",
    status: "Completed",
    purpose:
      "A web platform that helps people with disabilities and elderly people travel comfortably through information about the condition of the roads they will pass. Won Juara Harapan 1 (Web Development) at TIC 9.0 2026.",
    tech: ["Node.js", "Express.js", "TypeScript", "Prisma", "MySQL", "JWT", "Cloudinary"],
    features: [
      "Pedestrian route navigation",
      "Safer route recommendations",
      "Obstacle reporting",
      "Pedestrian path condition management",
      "Community verification",
      "Authentication and authorization",
    ],
    liveUrl: "https://akseskota.vercel.app/",
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
    id: "trisis-gym",
    missionNumber: 3,
    title: "Trisis GYM",
    role: "Fullstack Developer",
    status: "Completed",
    purpose:
      "A desktop application for scanner-based attendance and membership management, built for a client in 2025.",
    tech: ["Electron", "PHP"],
    features: [
      "Scanner-based attendance system",
      "Membership management",
      "Data stored locally on the client's computer, with no database server",
      "Replaces handwritten attendance books with a digital system",
    ],
  },
  {
    id: "perpustakaan",
    missionNumber: 4,
    title: "Sistem Informasi Perpustakaan",
    role: "Fullstack Developer",
    status: "Completed",
    purpose: "A web-based library information system for Pondok Pesantren DDI ABRAD, built in 2026.",
    tech: ["Laravel", "PHP", "MySQL"],
    features: [
      "Member data management",
      "Book borrowing and returns",
      "Fine calculation",
      "Reports",
    ],
  },
  {
    id: "re-food",
    missionNumber: 5,
    title: "RE-FOOD",
    role: "Fullstack Developer",
    status: "Completed",
    purpose:
      "A food donation distribution platform that connects food donors with recipients, built as a 2026 semester project.",
    tech: ["Flutter", "Laravel", "MongoDB", "Google Maps API", "REST API"],
    features: ["Food donation distribution", "Live volunteer tracking with the Google Maps API", "REST API"],
  },
  {
    id: "sig-zonasi",
    missionNumber: 6,
    title: "SIG Zonasi Radius Rumah-Sekolah",
    role: "Project Manager",
    status: "Completed",
    purpose:
      "A Web GIS that verifies school zoning (PPDB) based on the distance from a student's home to the school, built for a Geographic Information Systems course in 2026.",
    tech: ["Leaflet.js", "Turf.js"],
    features: [
      "Led a team of 5 using Agile Scrum",
      "Planned three sprints and monitored progress",
      "Managed communication and prototype demos with the lecturer as project sponsor",
      "Drafted the Project Charter with the team: scope, budget, and roles",
    ],
  },
  {
    id: "digilib",
    missionNumber: 7,
    title: "DigiLib — School Digital Library",
    role: "Fullstack Developer",
    status: "Completed",
    purpose:
      "A school library web app covering catalog, membership, borrowing and returns, automatic fines, reservations, and reports. Personal project, 2026.",
    tech: ["React", "Express.js", "Supabase", "PostgreSQL", "Vercel"],
    features: [
      "Role-based access for admin, librarian, and member",
      "Google OAuth sign-in",
      "Atomic borrowing transactions with PostgreSQL functions to prevent stock race conditions",
      "Page-flip e-book reader",
      "QR member cards with camera scanning",
      "Excel and PDF report export",
      "Automated email reminders",
    ],
  },
];
