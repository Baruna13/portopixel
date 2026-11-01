import type { Achievement } from "@/types";

/**
 * Two verified achievements exist. The 2 locked "coming soon" slots are
 * decorative placeholders for the trophy-cabinet UI pattern, per explicit
 * instruction — they carry no real content and must never be filled with
 * invented achievements.
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
  { id: "locked-1", status: "Locked", title: "???" },
  { id: "locked-2", status: "Locked", title: "???" },
];