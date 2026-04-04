"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderMobileSearchProps {
  className?: string;
}

/**
 * AliExpress-style pill search (mobile): opens `/shop?q=…`; results filter in the browser after the full catalog loads.
 */
export default function HeaderMobileSearch({ className }: HeaderMobileSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/shop?q=${encodeURIComponent(q)}`);
    else router.push("/shop");
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "md:hidden flex w-full min-w-0 items-stretch gap-0 rounded-full border border-neutral-900 bg-white pl-1.5 pr-1 py-1 shadow-sm transition-shadow focus-within:shadow-md",
        className
      )}
      role="search"
    >
      <button
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-900 active:bg-neutral-100"
        aria-label="Image search (coming soon)"
        onClick={() => router.push("/shop")}
      >
        <Camera className="h-5 w-5 stroke-[1.75]" aria-hidden />
      </button>
      <div
        className="my-2 w-px shrink-0 self-stretch bg-neutral-300"
        aria-hidden
      />
      <input
        type="search"
        name="q"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search parts, machines & tools…"
        className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none focus:ring-0"
        aria-label="Search catalog"
      />
      <button
        type="submit"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white active:bg-neutral-800"
        aria-label="Search"
      >
        <Search className="h-5 w-5" strokeWidth={2.25} aria-hidden />
      </button>
    </form>
  );
}
