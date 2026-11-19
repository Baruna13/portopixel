import type { Achievement } from "@/types";

/**
 * Verified achievements only (TIC 9.0 and the Gemini certification are on the CV).
 * The locked "coming soon" slot is a decorative placeholder for the trophy-cabinet
 * UI pattern, per explicit instruction — it carries no real content and must
 * never be filled with an invented achievement.
 *
 * Certificate images: src/assets/certificates/<achievement-id>/1.png
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "closer-2025-semifinalist",
    status: "Unlocked",
    title: "Business Plan Competition",
    subtitle: "11th CLOSER 2025",
    organizer: "Badan Eksekutif Mahasiswa Telkom University",
    date: "October 2025",
    description: "Semifinalist. Theme: \"Empowering Digitalpreneurs: Navigating the Future of E-Commerce.\"",
  },
  {
    id: "tic-9-2026-harapan-1",
    status: "Unlocked",
    title: "Web Development Competition",
    subtitle: "TIC 9.0 2026",
    rank: "Juara Harapan 1",
    organizer: "Himpunan Mahasiswa Teknologi Informasi Universitas Jember (HIMATIF UNEJ)",
    date: "August 2026",
    description:
      "Technology Innovative Challenge 9.0, Web Development category, with AksesKota. Theme: \"Push the Impact: Web Innovation for Sustainable Development Goals.\"",
  },
  {
    id: "gemini-certified-university-student",
    status: "Unlocked",
    title: "Gemini Certified University Student",
    date: "2026 - 2029",
  },
  { id: "locked-1", status: "Locked", title: "???" },
];
