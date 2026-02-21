"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import AnimatedSkeleton from "../segments/AnimatedSkeleton";

/**
 * Skeleton for a single machine card.
 * Matches the machine card layout: tall image on top, quotation layout with
 * left (title, meta, description) and right (price, stock) sections.
 */
const MachineCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border border-slate-200 rounded-xl">
      {/* Image at top – tall frame, same as machine card */}
      <div className="w-full h-64 sm:h-80 bg-slate-50 border-b overflow-hidden flex items-center justify-center">
        <AnimatedSkeleton className="w-full h-full rounded-none" />
      </div>

      {/* Professional quotation layout – same structure as machine card */}
      <div className="p-6 sm:p-7 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Left: title, meta, description */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <AnimatedSkeleton className="h-6 w-3/4 sm:w-2/3 max-w-md" />
              <AnimatedSkeleton className="h-3 w-24" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <AnimatedSkeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <AnimatedSkeleton className="h-4 w-full" />
            <AnimatedSkeleton className="h-4 w-5/6" />
            <AnimatedSkeleton className="h-4 w-4/5" />
          </div>
        </div>

        {/* Right: price, stock */}
        <div className="flex flex-col items-end gap-3 min-w-[220px] shrink-0">
          <div className="space-y-2 text-right">
            <AnimatedSkeleton className="h-3 w-24 ml-auto" />
            <AnimatedSkeleton className="h-6 w-28 ml-auto" />
          </div>
          <div className="flex items-center gap-2">
            <AnimatedSkeleton className="h-3 w-3 rounded-full" />
            <AnimatedSkeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MachineCardSkeleton;
