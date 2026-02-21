"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSkeleton from "../segments/AnimatedSkeleton";

/**
 * Skeleton for a single product card in grid view.
 * Matches the grid product card layout: aspect-square image, badges area,
 * rating, name, price, stock.
 */
const ProductGridCardSkeleton = () => {
  return (
    <Card className="overflow-hidden group">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            <AnimatedSkeleton className="h-5 w-16 rounded-full" />
          </div>
          <AnimatedSkeleton className="w-full h-full rounded-none" />
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <AnimatedSkeleton key={i} className="h-3 w-3 rounded" />
              ))}
            </div>
            <AnimatedSkeleton className="h-3 w-8" />
          </div>

          {/* Product Name */}
          <AnimatedSkeleton className="h-4 w-full" />
          <AnimatedSkeleton className="h-4 w-4/5" />

          {/* Price */}
          <AnimatedSkeleton className="h-6 w-24" />

          {/* Stock */}
          <div className="flex items-center gap-2">
            <AnimatedSkeleton className="h-2 w-2 rounded-full" />
            <AnimatedSkeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductGridCardSkeleton;
