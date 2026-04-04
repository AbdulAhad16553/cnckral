"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/** Search in gradient header on md+ screens */
export default function HeaderDesktopSearch() {
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
      className="hidden md:flex w-full max-w-xs items-center gap-2 rounded-lg bg-white/15 border border-white/25 px-3 py-1.5 text-sm text-white/95 focus-within:bg-white/20 transition-colors"
      role="search"
    >
      <Search className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      <input
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search…"
        className="min-w-0 flex-1 bg-transparent border-0 p-0 text-white placeholder:text-white/60 outline-none focus:ring-0"
        aria-label="Search products"
      />
    </form>
  );
}
