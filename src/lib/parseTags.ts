export function parseTags(tags: string[] | string | undefined | null): string[] {
  if (!tags) return [];
  const raw = Array.isArray(tags) ? tags : tags.split(",");
  return raw
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && t !== "{}" && t !== "[]");
}
