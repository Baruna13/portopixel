import { SOCIAL_LINKS } from "@/data/social";

/**
 * The CV is picked up automatically: export it as PDF and drop it into src/assets/cv/
 * (any file name). A link in SOCIAL_LINKS.resumeUrl is used as a fallback.
 */
const cvFiles = import.meta.glob("../assets/cv/*.pdf", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const CV_URL: string | undefined = Object.values(cvFiles)[0] ?? SOCIAL_LINKS.resumeUrl;
export const CV_DOWNLOAD_NAME = "CV-Mochamad-Emil-Baruna-Amirudin.pdf";
