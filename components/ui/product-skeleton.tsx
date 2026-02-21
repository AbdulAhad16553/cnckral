"use client";

import AnimatedSkeleton from "@/common/Skeletons/segments/AnimatedSkeleton";

const stagger = (ms: number) => ({ animationDelay: `${ms}ms` });

/**
 * Professional product detail skeleton matching ProductDetailContent layout.
 * Layout: breadcrumb → grid (7-col gallery + 5-col info) → description section.
 */
export function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5" aria-hidden>
        <AnimatedSkeleton className="h-4 w-12" style={stagger(0)} />
        <AnimatedSkeleton className="h-4 w-4 shrink-0 rounded" style={stagger(30)} />
        <AnimatedSkeleton className="h-4 w-16" style={stagger(60)} />
        <AnimatedSkeleton className="h-4 w-4 shrink-0 rounded" style={stagger(90)} />
        <AnimatedSkeleton className="h-4 w-24" style={stagger(120)} />
        <AnimatedSkeleton className="h-4 w-4 shrink-0 rounded" style={stagger(150)} />
        <AnimatedSkeleton className="h-4 w-40 max-w-[200px]" style={stagger(180)} />
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
        {/* Left: Gallery (7 cols) */}
        <div className="space-y-4 lg:col-span-7 lg:space-y-6">
          {/* Main image */}
          <div className="relative overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200/60">
            <AnimatedSkeleton
              className="aspect-square w-full rounded-2xl"
              style={stagger(50)}
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <AnimatedSkeleton
                key={i}
                className="h-20 w-20 shrink-0 rounded-xl"
                style={stagger(80 + i * 40)}
              />
            ))}
          </div>

          {/* Description section */}
          <div className="border-t border-neutral-200 pt-6">
            <AnimatedSkeleton className="mb-4 h-5 w-28" style={stagger(200)} />
            <div className="space-y-3">
              <AnimatedSkeleton className="h-4 w-full" style={stagger(240)} />
              <AnimatedSkeleton className="h-4 w-[95%]" style={stagger(280)} />
              <AnimatedSkeleton className="h-4 w-[88%]" style={stagger(320)} />
              <AnimatedSkeleton className="h-4 w-[70%]" style={stagger(360)} />
            </div>
          </div>
        </div>

        {/* Right: Product info (5 cols) - sticky area */}
        <div className="lg:col-span-5">
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <AnimatedSkeleton
                className="h-6 w-20 rounded-full"
                style={stagger(100)}
              />
              <AnimatedSkeleton
                className="h-6 w-24 rounded-full"
                style={stagger(130)}
              />
            </div>

            {/* Title & SKU */}
            <div>
              <AnimatedSkeleton
                className="mb-2 h-8 w-full max-w-md sm:h-9"
                style={stagger(150)}
              />
              <AnimatedSkeleton
                className="h-4 w-24 font-mono"
                style={stagger(180)}
              />
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-2">
              <AnimatedSkeleton className="h-9 w-32" style={stagger(210)} />
              <AnimatedSkeleton className="h-4 w-16" style={stagger(240)} />
            </div>

            {/* Separator */}
            <div className="h-px bg-neutral-200" />

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <AnimatedSkeleton className="h-4 w-16" style={stagger(260)} />
                <div className="flex items-center rounded-lg border border-neutral-200 bg-white">
                  <AnimatedSkeleton className="h-10 w-10 rounded-l-md" style={stagger(280)} />
                  <AnimatedSkeleton className="h-10 w-14" style={stagger(300)} />
                  <AnimatedSkeleton className="h-10 w-10 rounded-r-md" style={stagger(320)} />
                </div>
                <AnimatedSkeleton className="h-4 w-28" style={stagger(340)} />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <AnimatedSkeleton
                  className="h-12 w-full rounded-xl"
                  style={stagger(360)}
                />
                <AnimatedSkeleton
                  className="h-12 w-full rounded-xl"
                  style={stagger(390)}
                />
              </div>
            </div>

            {/* Specifications card */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
              <div className="border-b border-neutral-100 px-6 py-4">
                <AnimatedSkeleton className="h-5 w-32" style={stagger(420)} />
              </div>
              <div className="divide-y divide-neutral-100">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between gap-4 px-6 py-4"
                  >
                    <AnimatedSkeleton
                      className="h-4 w-24"
                      style={stagger(440 + i * 30)}
                    />
                    <AnimatedSkeleton
                      className="h-4 w-20"
                      style={stagger(450 + i * 30)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
