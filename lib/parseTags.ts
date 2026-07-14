export function parseTags(tags: string[] | string | undefined | null): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => t.trim()).filter(Boolean);
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}
