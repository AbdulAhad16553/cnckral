"use client";

import { FormEvent, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { emitHomeCatalogSearchQuery } from "@/lib/catalogSearchBridge";

const DEBOUNCE_MS = 280;

interface HeaderMobileSearchProps {
  className?: string;
}

/**
 * Mobile: on home (`/`), typing updates `/?q=…` on a short debounce so the catalog filters live.
 * On other routes, submit still navigates to home with the query.
 */
export default function HeaderMobileSearch({ className }: HeaderMobileSearchProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const qFromUrl = (searchParams.get("q") || "").trim();
  const isHome = pathname === "/";

  const [value, setValue] = useState("");

  useEffect(() => {
    if (!isHome) return;
    setValue(qFromUrl);
  }, [isHome, qFromUrl]);

  const applyQueryToUrl = useCallback(
    (raw: string, scroll: boolean) => {
      const q = raw.trim();
      const opts = scroll ? undefined : { scroll: false as const };
      if (q) {
        router.replace(`/?q=${encodeURIComponent(q)}`, opts);
      } else {
        router.replace("/", opts);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!isHome) return;
    const t = setTimeout(() => {
      const next = value.trim();
      if (next === qFromUrl) return;
      applyQueryToUrl(value, false);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value, isHome, qFromUrl, applyQueryToUrl]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isHome) {
      applyQueryToUrl(value, false);
      return;
    }
    const q = value.trim();
    if (q) router.push(`/?q=${encodeURIComponent(q)}`);
    else router.push("/");
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "md:hidden flex w-full min-w-0 items-stretch gap-0 rounded-full border border-neutral-900 bg-white pl-3 pr-0.5 py-1 shadow-sm transition-shadow focus-within:shadow-md",
        className
      )}
      role="search"
    >
      <input
        type="search"
        name="q"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          if (isHome) emitHomeCatalogSearchQuery(v);
        }}
        placeholder="Search parts, machines & tools…"
        className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none focus:ring-0"
        aria-label="Search catalog"
      />
      <button
        type="submit"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent text-neutral-900 hover:bg-neutral-100/80 active:bg-neutral-100"
        aria-label="Search"
      >
        <Search className="h-5 w-5" strokeWidth={2.25} aria-hidden />
      </button>
    </form>
  );
}
