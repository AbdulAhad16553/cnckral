"use client";

import React from "react";
import AnimatedSkeleton from "../segments/AnimatedSkeleton";

const stagger = (ms: number) => ({ animationDelay: `${ms}ms` });

/**
 * Professional page detail skeleton for content pages (about, privacy, terms, etc.).
 * Matches layout: Hero-like header + content prose blocks.
 */
const PageDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero / Page header area */}
      <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-white">
        <div className="px-6 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSkeleton
              className="mx-auto mb-4 h-10 w-48 sm:h-12 sm:w-64"
              style={stagger(0)}
            />
            <AnimatedSkeleton
              className="mx-auto h-5 w-72 max-w-full"
              style={stagger(50)}
            />
          </div>
        </div>
      </section>

      {/* Content area - prose blocks */}
      <div className="mx-auto max-w-3xl">
        <div className="space-y-8">
          {/* Paragraph blocks */}
          {[1, 2, 3, 4, 5].map((block) => (
            <div key={block} className="space-y-3">
              {block % 2 === 0 ? (
                <>
                  <AnimatedSkeleton
                    className="h-5 w-40"
                    style={stagger(80 + block * 60)}
                  />
                  <AnimatedSkeleton
                    className="h-4 w-full"
                    style={stagger(100 + block * 60)}
                  />
                  <AnimatedSkeleton
                    className="h-4 w-[95%]"
                    style={stagger(120 + block * 60)}
                  />
                  <AnimatedSkeleton
                    className="h-4 w-[88%]"
                    style={stagger(140 + block * 60)}
                  />
                </>
              ) : (
                <>
                  <AnimatedSkeleton
                    className="h-4 w-full"
                    style={stagger(80 + block * 60)}
                  />
                  <AnimatedSkeleton
                    className="h-4 w-[96%]"
                    style={stagger(100 + block * 60)}
                  />
                  <AnimatedSkeleton
                    className="h-4 w-[75%]"
                    style={stagger(120 + block * 60)}
                  />
                </>
              )}
            </div>
          ))}

          {/* List-like block */}
          <div className="space-y-4 pt-4">
            <AnimatedSkeleton
              className="h-5 w-36"
              style={stagger(400)}
            />
            <ul className="space-y-2 pl-5">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <AnimatedSkeleton
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={stagger(430 + i * 40)}
                  />
                  <AnimatedSkeleton
                    className="h-4 flex-1"
                    style={stagger(440 + i * 40)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Final paragraph */}
          <div className="space-y-3 pt-4">
            <AnimatedSkeleton
              className="h-4 w-full"
              style={stagger(600)}
            />
            <AnimatedSkeleton
              className="h-4 w-[90%]"
              style={stagger(640)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDetailSkeleton;
