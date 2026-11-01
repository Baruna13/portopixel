/**
 * Auto-discovers project screenshots. No code changes needed to add images:
 * just drop files into  src/assets/projects/<project-id>/
 *
 *   src/assets/projects/akseskota/1.png   <- first file = cover image
 *   src/assets/projects/akseskota/2.png
 *   src/assets/projects/re-food/1.jpg
 *
 * <project-id> must match `id` in data/projects.ts. Files are sorted by name
 * (1, 2, 10 — numeric aware). Supported: png, jpg, jpeg, webp, gif.
 */
const modules = import.meta.glob("../assets/projects/*/*.{png,jpg,jpeg,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function getProjectImages(projectId: string): string[] {
  return Object.entries(modules)
    .filter(([path]) => path.includes(`/projects/${projectId}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, url]) => url);
}