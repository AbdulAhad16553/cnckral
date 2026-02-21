"use client";

import React from "react";
import MachineCardSkeleton from "../MachineCard";
import AnimatedSkeleton from "../segments/AnimatedSkeleton";

/**
 * Skeleton for the machine page.
 * Uses the same layout as the machine page: single column, list view with
 * machine cards (tall image on top, quotation layout).
 */
const MachinePageSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header – matches PaginatedProducts header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <AnimatedSkeleton className="h-8 w-32 mb-2" />
          <AnimatedSkeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Machine cards – list layout (single column) same as machine page */}
      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <MachineCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default MachinePageSkeleton;
