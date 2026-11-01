/**
 * Auto-discovers certificate images. Drop files into
 *
 *   src/assets/certificates/<achievement-id>/1.png
 *   src/assets/certificates/<achievement-id>/2.jpg   (optional extra pages)
 *
 * <achievement-id> must match `id` in data/achievements.ts. Files are sorted
 * by name (numeric aware); the first one is the preview on the trophy card.
 */
const modules = import.meta.glob("../assets/certificates/*/*.{png,jpg,jpeg,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function getCertificateImages(achievementId: string): string[] {
  return Object.entries(modules)
    .filter(([path]) => path.includes(`/certificates/${achievementId}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, url]) => url);
}