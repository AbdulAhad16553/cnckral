"use client";

import React from "react";
import ProductGridCardSkeleton from "../ProductGridCard";
import AnimatedSkeleton from "../segments/AnimatedSkeleton";

/**
 * Skeleton for the parts page.
 * Uses the same layout as the parts page: product grid with product cards
 * (aspect-square image, rating, name, price, stock).
 */
const PartsPageSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header – matches PaginatedProducts header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <AnimatedSkeleton className="h-8 w-32 mb-2" />
          <AnimatedSkeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Product grid – same columns as parts page grid view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <ProductGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default PartsPageSkeleton;
