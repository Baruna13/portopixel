import type { PlayerProfile } from "@/types";

// 1. Drop your photo file into src/assets/ (e.g. src/assets/profile-photo.jpg).
// 2. Uncomment the import below and point it at your filename.
// 3. Add `avatarUrl: profilePhoto,` to PLAYER_PROFILE below.
import profilePhoto from "@/assets/pic.jpeg";

/**
 * `location` is intentionally omitted. The Stitch export displayed
 * "IPB University" in this slot, but that value was not present anywhere
 * in ARCHITECTURE.md and was not explicitly confirmed as real — per
 * instruction, unverified personal information is dropped rather than
 * carried forward. Add it back here (and only here) once confirmed.
 */
export const PLAYER_PROFILE: PlayerProfile = {
  name: "MOCHAMAD EMIL BARUNA AMIRUDIN",
  class: "Software Engineer",
  roles: ["Backend Developer", "Fullstack Developer"],
  focus: ["Backend Development", "REST API", "Database", "Fullstack Web Development"],
  avatarUrl: profilePhoto,
};
