"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getOptimizedImageUrl, IMAGE_SIZES } from "@/lib/imageUtils";

const INTERVAL_MS = 4000;

function erpImagePathFromUrl(url: string): string | null {
  const t = url.trim();
  if (!t) return null;
  if (t.startsWith("/files/") || t.startsWith("/private/")) return t;
  try {
    const u = new URL(t);
    return u.pathname || null;
  } catch {
    return null;
  }
}

interface FeaturedProductImageCarouselProps {
  images: Array<{ image_id?: string }>;
  alt: string;
  className?: string;
  /** When images array is empty, fetch product image by item code (SKU) from API */
  itemCode?: string;
  /** Full image URL from /api/products — shown immediately, avoids batch fetch */
  imageUrl?: string;
}

export function FeaturedProductImageCarousel({
  images,
  alt,
  className = "",
  itemCode,
  imageUrl,
}: FeaturedProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fallbackImagePath, setFallbackImagePath] = useState<string | null>(null);

  const listFromProps = images?.filter((img) => img?.image_id && String(img.image_id).trim()) ?? [];
  const pathFromCatalog = imageUrl ? erpImagePathFromUrl(imageUrl) : null;
  const listFromImageUrl =
    listFromProps.length === 0 &&
    pathFromCatalog &&
    (pathFromCatalog.startsWith("/files/") || pathFromCatalog.startsWith("/private/"))
      ? [{ image_id: pathFromCatalog }]
      : [];
  const list = listFromProps.length > 0 ? listFromProps : listFromImageUrl;
  const hasMultiple = list.length > 1;

  // Fallback: when no images from props or catalog URL, fetch by item code (SKU)
  useEffect(() => {
    if (list.length > 0 || !itemCode || imageUrl) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/batch-item-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemNames: [itemCode] }),
        });
        const data = await res.json();
        const first = data?.imageResults?.[0];
        if (!cancelled && first?.success && first?.has_image && first?.image) {
          setFallbackImagePath(first.image);
        }
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, [list.length, itemCode, imageUrl]);

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [hasMultiple, list.length]);

  // Use fallback image when no images from props
  const effectiveList = list.length > 0
    ? list
    : fallbackImagePath
      ? [{ image_id: fallbackImagePath }]
      : [];

  if (effectiveList.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-xs text-slate-400 bg-slate-100 ${className}`}
      >
        No image
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-full ${className}`}>
      {effectiveList.map((img, i) => (
        <div
          key={img.image_id || i}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            i === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={getOptimizedImageUrl(img.image_id, {
              ...IMAGE_SIZES.THUMB_LARGE,
              width: 224,
              height: 224,
            })}
            alt={i === 0 ? alt : `${alt} - image ${i + 1}`}
            fill
            sizes="224px"
            className="object-cover"
          />
        </div>
      ))}
      {effectiveList.length > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex gap-1">
          {effectiveList.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "bg-slate-600 w-3"
                  : "bg-slate-300 w-1 hover:bg-slate-400"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
