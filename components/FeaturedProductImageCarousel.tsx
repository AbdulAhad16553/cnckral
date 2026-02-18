"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getOptimizedImageUrl, IMAGE_SIZES } from "@/lib/imageUtils";

const INTERVAL_MS = 4000;

interface FeaturedProductImageCarouselProps {
  images: Array<{ image_id: string }>;
  alt: string;
  className?: string;
}

export function FeaturedProductImageCarousel({
  images,
  alt,
  className = "",
}: FeaturedProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const list = images?.filter((img) => img?.image_id) ?? [];
  const hasMultiple = list.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [hasMultiple, list.length]);

  if (list.length === 0) {
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
      {list.map((img, i) => (
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
      {hasMultiple && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex gap-1">
          {list.map((_, i) => (
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
