import type { SocialLinks } from "@/types";

/**
 * Real values from the CV. LinkedIn is left undefined on purpose: the CV only
 * has the display name, not the profile URL. Add the full URL
 * (https://www.linkedin.com/in/...) and the tile turns on by itself.
 */
export const SOCIAL_LINKS: SocialLinks = {
  github: "https://github.com/Baruna13",
  linkedin: "https://www.linkedin.com/in/mochamad-emil-baruna/",
  email: "mochamademilbaruna@gmail.com",
  resumeUrl: undefined, // the CV PDF in src/assets/cv/ is picked up automatically
};
