"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type DrawerCategory = {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
};

interface MobileCategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  categories: DrawerCategory[];
}

/**
 * Full-screen drawer: each row links to `/category` or `/category/[slug]`.
 */
export default function MobileCategoryDrawer({
  open,
  onClose,
  categories,
}: MobileCategoryDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const sorted = categories
    .slice()
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  return (
    <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Close categories"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <h2 className="text-lg font-semibold text-neutral-900">Categories</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <Link
            href="/category"
            onClick={onClose}
            className="flex items-center justify-between border-b border-neutral-100 px-4 py-3.5 text-sm font-semibold text-[var(--primary-color,#0368E5)] active:bg-neutral-50"
          >
            View all categories
            <ChevronRight className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
          </Link>
          {sorted.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${encodeURIComponent(cat.slug)}`}
              onClick={onClose}
              className="flex items-center justify-between border-b border-neutral-100 px-4 py-3.5 text-left text-sm text-neutral-800 active:bg-neutral-50"
            >
              <span className="line-clamp-2 pr-2">{cat.name}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
