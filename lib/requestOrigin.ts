import { headers } from "next/headers";
import { getUrlWithScheme } from "@/lib/getUrlWithScheme";

const DEFAULT_HOST = process.env.NEXT_PUBLIC_SITE_HOST || "cnckral.com";

/** Resolve request host without throwing (avoids SSR crashes when Host is missing). */
export async function getRequestHost(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("host")?.trim();
    if (host) return host;
  } catch {
    // headers() can throw outside a request context
  }
  return DEFAULT_HOST;
}

export async function getRequestOrigin(): Promise<string> {
  return getUrlWithScheme(await getRequestHost());
}
