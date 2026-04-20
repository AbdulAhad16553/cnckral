export function parseErpTags(rawTags: unknown): string[] {
  if (!rawTags) return [];

  if (Array.isArray(rawTags)) {
    return rawTags
      .map((tag) => String(tag).trim())
      .filter(Boolean)
      .map((tag) => normalizeTag(tag));
  }

  if (typeof rawTags !== "string") return [];

  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => normalizeTag(tag));
}

function normalizeTag(tag: string): string {
  return tag.replace(/^#/, "").trim();
}
