"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const PREFIX = "listing-scroll:v1:";

export function listingScrollStorageKey(): string | null {
  if (typeof window === "undefined") return null;
  return `${PREFIX}${window.location.pathname}${window.location.search}`;
}

/** Call on product card click (not hover) so browser back restores list scroll. */
export function saveListingScrollPosition(): void {
  const key = listingScrollStorageKey();
  if (!key) return;
  try {
    sessionStorage.setItem(key, String(window.scrollY));
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * @param filterKey Optional signature when list content changes without a pathname change
 * (e.g. shop category/search). Resets one-shot restore so a new scroll position can be saved.
 */
export function useRestoreListingScroll(ready: boolean, filterKey: string = ""): void {
  const pathname = usePathname();
  const restoredRef = useRef(false);
  const contextRef = useRef("");

  const context = `${pathname}::${filterKey}`;
  useEffect(() => {
    if (contextRef.current !== context) {
      contextRef.current = context;
      restoredRef.current = false;
    }
  }, [context]);

  useEffect(() => {
    if (!ready || restoredRef.current || typeof window === "undefined") return;

    const key = `${PREFIX}${window.location.pathname}${window.location.search}`;
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(key);
    } catch {
      return;
    }
    if (raw == null) return;

    const targetY = Number(raw);
    if (!Number.isFinite(targetY) || targetY <= 0) {
      try {
        sessionStorage.removeItem(key);
      } catch {
        /* ignore */
      }
      return;
    }

    restoredRef.current = true;

    let cleared = false;
    const clearKey = () => {
      if (cleared) return;
      cleared = true;
      try {
        sessionStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    };

    const maxScrollY = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const applyScroll = () => {
      const y = Math.min(targetY, maxScrollY());
      window.scrollTo({ top: y, left: 0, behavior: "auto" });
    };

    applyScroll();

    const ro = new ResizeObserver(() => {
      const maxY = maxScrollY();
      if (maxY >= targetY - 4) {
        window.scrollTo({
          top: Math.min(targetY, maxY),
          left: 0,
          behavior: "auto",
        });
        clearKey();
      }
    });

    ro.observe(document.documentElement);

    const timeout = window.setTimeout(() => {
      ro.disconnect();
      applyScroll();
      clearKey();
    }, 4500);

    return () => {
      window.clearTimeout(timeout);
      ro.disconnect();
    };
  }, [ready, pathname, filterKey]);
}
