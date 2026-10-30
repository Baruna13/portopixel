import type { Achievement } from "@/types";

/**
 * Only one verified achievement exists (ARCHITECTURE.md §11). The 3 locked
 * "coming soon" slots are decorative placeholders for the trophy-cabinet
 * UI pattern, per explicit instruction — they carry no real content and
 * must never be filled with invented achievements.
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
  { id: "locked-1", status: "Locked", title: "???" },
  { id: "locked-2", status: "Locked", title: "???" },
  { id: "locked-3", status: "Locked", title: "???" },
];
