import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Decode HTML entities for rendering (e.g. before dangerouslySetInnerHTML) */
export function decodeHtmlEntities(html: string | undefined): string {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/** Decode HTML entities and strip tags to get plain text (for card previews) */
export function stripHtmlForPreview(html: string | undefined, maxLength?: number): string {
  if (!html || typeof html !== "string") return "";
  const decoded = decodeHtmlEntities(html);
  const text = decoded.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (maxLength && text.length > maxLength) {
    return text.slice(0, maxLength).trim() + "…";
  }
  return text;
}
