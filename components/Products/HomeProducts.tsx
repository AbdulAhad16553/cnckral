"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProgressiveImage } from "@/components/ui/progressive-image";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import ProductImagePreview from "@/components/ProductImagePreview";
import { useBatchItemImages } from "@/hooks/useBatchItemImages";
import ProductSkeleton from "@/common/Skeletons/Products";
import { cn } from "@/lib/utils";
import {
  ProductCardMarketplacePrice,
  ProductCardReviewsRow,
} from "@/components/Products/ProductCardMarketplace";

interface HomeProductsProps {
  companyId: string;
  storeId: string;
  currentStock?: any[];
  storeCurrency: string;
  className?: string;
  initialProducts?: any[];
  /** Two-column feed cards + tighter UI on small screens (mobile home explore). */
  exploreMobile?: boolean;
  /** Max products to render (default 8). */
  productLimit?: number;
  sectionTitle?: string;
  sectionSubtitle?: string;
  /** Mobile home: reveal more rows while scrolling; then fetch next catalog pages */
  mobileInfiniteScroll?: boolean;
  mobileBatchSize?: number;
  /** Total products in ERP (from /api/products pagination) for knowing when to fetch more */
  catalogTotalProducts?: number;
  /** Page size when requesting additional pages (match server prefetch) */
  catalogFetchLimit?: number;
}

const HomeProducts: React.FC<HomeProductsProps> = ({
  companyId,
  storeId,
  currentStock = [],
  storeCurrency,
  className = "",
  initialProducts = [],
  exploreMobile = false,
  productLimit = 8,
  sectionTitle = "Featured Products",
  sectionSubtitle,
  mobileInfiniteScroll = false,
  mobileBatchSize = 12,
  catalogTotalProducts = 0,
  catalogFetchLimit = 100,
}) => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [loading, setLoading] = useState(!(initialProducts && initialProducts.length > 0));
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(() =>
    mobileInfiniteScroll
      ? Math.min(mobileBatchSize, (initialProducts || []).length)
      : (initialProducts || []).length
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [remoteExhausted, setRemoteExhausted] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);
  const nextCatalogPageRef = useRef(2);
  const remoteExhaustedRef = useRef(false);
  const loadMoreRef = useRef<() => Promise<void>>(async () => {});
  const productsRef = useRef(products);
  const visibleCountRef = useRef(visibleCount);
  productsRef.current = products;
  visibleCountRef.current = visibleCount;
  remoteExhaustedRef.current = remoteExhausted;

  // Prefer image_url from /api/products for instant preview; batch only when missing
  const itemNames = React.useMemo(() => products.map(p => p.sku).filter(Boolean), [products]);
  const needsBatchImages = products.some((p: any) => !p.image_url);
  const {
    isLoading: isImageLoading,
    getImageUrl,
    hasImage,
  } = useBatchItemImages({
    itemNames,
    enabled: products.length > 0 && needsBatchImages,
  });

  // Use server-provided initialProducts; only fetch if empty (avoids duplicate API call)
  useEffect(() => {
    let isCancelled = false;
    const hasInitialData = initialProducts && initialProducts.length > 0;

    if (hasInitialData) {
      setProducts(initialProducts);
      setLoading(false);
      if (mobileInfiniteScroll) {
        setVisibleCount(Math.min(mobileBatchSize, initialProducts.length));
        nextCatalogPageRef.current = 2;
        setRemoteExhausted(false);
        remoteExhaustedRef.current = false;
      }
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/products?page=1&limit=8`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch products');
        const list = data.products || [];
        if (!isCancelled) {
          setProducts(mobileInfiniteScroll ? list : list.slice(0, 8));
          if (mobileInfiniteScroll) {
            setVisibleCount(Math.min(mobileBatchSize, list.length));
            nextCatalogPageRef.current = 2;
          }
        }
      } catch (err) {
        if (!isCancelled) setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => { isCancelled = true; };
  }, [initialProducts, mobileInfiniteScroll, mobileBatchSize]);

  const totalCatalog = catalogTotalProducts > 0 ? catalogTotalProducts : products.length;

  const productsToShow = useMemo(() => {
    if (mobileInfiniteScroll) {
      return products.slice(0, Math.min(visibleCount, products.length));
    }
    return products.slice(0, productLimit);
  }, [mobileInfiniteScroll, products, visibleCount, productLimit]);

  const loadMore = useCallback(async () => {
    if (!mobileInfiniteScroll || loadingMoreRef.current) return;

    const prods = productsRef.current;
    const vis = visibleCountRef.current;

    if (vis < prods.length) {
      setVisibleCount((v) => Math.min(v + mobileBatchSize, prods.length));
      return;
    }

    if (prods.length >= totalCatalog || remoteExhaustedRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const page = nextCatalogPageRef.current;
      const res = await fetch(
        `/api/products?page=${page}&limit=${catalogFetchLimit}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load more");

      const batch = Array.isArray(data.products) ? data.products : [];
      if (batch.length === 0) {
        setRemoteExhausted(true);
        remoteExhaustedRef.current = true;
        return;
      }

      const keys = new Set(prods.map((p: any) => p.sku || p.id));
      const extra = batch.filter((p: any) => !keys.has(p.sku || p.id));
      const merged = extra.length > 0 ? [...prods, ...extra] : prods;

      if (extra.length > 0) {
        setProducts(merged);
        productsRef.current = merged;
      } else {
        setRemoteExhausted(true);
        remoteExhaustedRef.current = true;
      }

      setVisibleCount((v) =>
        Math.min(v + mobileBatchSize, merged.length)
      );
      nextCatalogPageRef.current = page + 1;
    } catch {
      setRemoteExhausted(true);
      remoteExhaustedRef.current = true;
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [mobileInfiniteScroll, mobileBatchSize, catalogFetchLimit, totalCatalog]);

  loadMoreRef.current = loadMore;

  useEffect(() => {
    if (!mobileInfiniteScroll) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        void loadMoreRef.current();
      },
      { root: null, rootMargin: "280px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mobileInfiniteScroll, productsToShow.length, products.length]);

  // Calculate product stock
  const calculateProductStock = (product: any) => {
    if (product.type === "variable") {
      let totalStock = 0;
      product.product_variations?.forEach((variation: any) => {
        if (variation.stock && variation.stock.totalStock !== undefined) {
          totalStock += variation.stock.totalStock;
        } else {
          const variationStock = currentStock
            .filter((stock: any) => stock.sku === variation.sku)
            .reduce((sum: number, stock: any) => sum + (stock?.available_quantity || 0), 0);
          totalStock += variationStock;
        }
      });
      return totalStock;
    } else {
      if (product.stock && product.stock.totalStock !== undefined) {
        return product.stock.totalStock;
      }
      return currentStock
        .filter((stock: any) => stock.sku === product.sku)
        .reduce((sum: number, stock: any) => sum + (stock?.available_quantity || 0), 0);
    }
  };

  // Loading state – show skeleton instead of loader
  if (loading) {
    return (
      <div className={className}>
        <ProductSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        <div className="text-center py-16">
          <div className="text-red-400 mb-4">
            <ShoppingCart className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading products
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && products.length === 0) {
    return (
      <div className={className}>
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <ShoppingCart className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products available
          </h3>
          <p className="text-gray-600">Check back later for new products!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <motion.div
        className={cn(
          "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
          exploreMobile ? "hidden md:flex" : "max-md:hidden"
        )}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{sectionTitle}</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            {sectionSubtitle ??
              `Showing ${Math.min(products.length, productLimit)} of our best products`}
          </p>
        </div>
        <Link href="/parts">
          <Button className="text-white shadow-soft hover:shadow-soft-lg transition-all duration-250" style={{ backgroundColor: 'var(--primary-color)' }}>
            View All Products
          </Button>
        </Link>
      </motion.div>

      {/* Products Grid with stagger animation */}
      <motion.div
        className={cn(
          exploreMobile
            ? "max-md:columns-2 max-md:gap-x-2 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6"
            : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6"
        )}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.07,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {productsToShow.map((product: any, index: number) => {
          const imageUrl =
            product.image_url ||
            (needsBatchImages ? getImageUrl(product.sku) : "/placeholder.svg");
          const productHasImage =
            !!product.image_url || (needsBatchImages && hasImage(product.sku));

          const productStock = calculateProductStock(product);
          const isOutOfStock = product.type === "variable" ? false : productStock <= 0;
          const hasVariations = product.product_variations && product.product_variations.length > 0;
          
          // Create unique key
          const uniqueKey = `${product.id || product.sku || product.name}-${index}-${product.type || 'simple'}`;

          return (
            <motion.div
              key={uniqueKey}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                },
              }}
            >
            <motion.div
              whileHover={
                exploreMobile
                  ? undefined
                  : { y: -6, transition: { duration: 0.2 } }
              }
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={exploreMobile ? "mb-2 break-inside-avoid md:mb-0 md:break-inside-auto" : undefined}
            >
            <Card
              className={cn(
                "group overflow-hidden border border-neutral-100 bg-white transition-shadow duration-300",
                exploreMobile
                  ? "rounded-2xl shadow-[0_1px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] md:rounded-lg md:border-slate-200/80 md:shadow-card md:hover:shadow-card-hover"
                  : "rounded-xl border-slate-200/90 shadow-[0_1px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] sm:rounded-2xl"
              )}
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div
                  className={cn(
                    "relative aspect-square overflow-hidden",
                    exploreMobile && "max-md:rounded-t-2xl"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-2 left-2 z-10 flex max-w-[calc(100%-0.5rem)] flex-col gap-1",
                      exploreMobile && "max-md:top-1 max-md:left-1 max-md:scale-90 origin-top-left"
                    )}
                  >
                    {hasVariations && (
                      <Badge
                        variant="outline"
                        className="text-xs font-bold bg-blue-100 text-blue-800 border-blue-300"
                      >
                        {product.product_variations.length} variants
                      </Badge>
                    )}
                    {product.status === "on-sale" && !isOutOfStock && (
                      <Badge variant="sale" className="text-xs font-bold">
                        On Sale
                      </Badge>
                    )}
                    {isOutOfStock && !product.enable_quote_request && (
                      <Badge
                        variant="destructive"
                        className="text-xs font-bold"
                      >
                        Out of Stock
                      </Badge>
                    )}
                    {productStock > 0 &&
                      productStock <= 5 &&
                      product.status !== "on-sale" && (
                        <Badge
                          variant="outline"
                          className="text-xs font-bold bg-orange-100 text-orange-800 border-orange-300"
                        >
                          Low Stock
                        </Badge>
                      )}
                  </div>

                  <Link href={`/product/${encodeURIComponent(product.sku)}`}>
                    <ProductImagePreview
                      itemName={product.sku}
                      productName={product.name}
                      imageUrl={imageUrl}
                      hasImage={productHasImage}
                      isLoading={needsBatchImages ? isImageLoading : false}
                      width={400}
                      height={400}
                      className="w-full h-full"
                      showPreview={true}
                    />
                  </Link>

                  {/* Quick Actions */}
                  <div
                    className={cn(
                      "absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                      exploreMobile && "max-md:hidden"
                    )}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white hover:shadow-md"
                    >
                      <Heart className="h-4 w-4 text-gray-700 hover:text-red-500 transition-colors" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white hover:shadow-md"
                    >
                      <Eye className="h-4 w-4 text-gray-700 hover:text-blue-500 transition-colors" />
                    </Button>
                  </div>

                  {/* Bottom overlay reserved for future actions (Quick Add removed) */}
                </div>

                {/* Product Info */}
                <div
                  className={cn(
                    "space-y-3 p-4",
                    exploreMobile && "max-md:space-y-1 max-md:p-2"
                  )}
                >
                  {exploreMobile && index % 3 === 0 && (
                    <p className="md:hidden rounded-md bg-pink-50 px-2 py-1 text-[10px] font-semibold leading-tight text-pink-950">
                      Deals · Free shipping on orders Rs. 10,000+
                    </p>
                  )}

                  {/* Product Name */}
                  <Link href={`/product/${encodeURIComponent(product.sku)}`}>
                    <h3
                      className={cn(
                        "line-clamp-2 font-medium text-sm leading-snug text-neutral-900 transition-colors hover:text-[var(--primary-color)]",
                        exploreMobile &&
                          "max-md:text-[11px] max-md:font-normal max-md:leading-snug"
                      )}
                    >
                      {product.name}
                    </h3>
                  </Link>

                  <ProductCardReviewsRow
                    sku={product.sku || product.name || ""}
                    className={exploreMobile ? "hidden md:flex" : undefined}
                  />
                  {exploreMobile && (
                    <ProductCardReviewsRow
                      sku={product.sku || product.name || ""}
                      compact
                      className="md:hidden"
                    />
                  )}

                  {/* Price — marketplace promo row */}
                  <ProductCardMarketplacePrice
                    product={product}
                    storeCurrency={storeCurrency}
                    compact={exploreMobile ? true : false}
                  />
                  {hasVariations && (
                    <p
                      className={cn(
                        "text-xs text-neutral-500",
                        exploreMobile && "max-md:text-[10px]"
                      )}
                    >
                      {product.product_variations.length} options
                    </p>
                  )}

                  {/* Stock Information */}
                  <div
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      exploreMobile && "max-md:hidden"
                    )}
                  >
                    {productStock > 0 ? (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700 font-medium">
                          Available
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-700 font-medium">
                          Out of stock
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* View All — hidden on mobile home when infinite scroll is enabled */}
      {!mobileInfiniteScroll && (
        <div
          className={cn(
            "mt-8 flex justify-center",
            exploreMobile && "hidden md:flex"
          )}
        >
          <Link href="/parts">
            <Button size="lg" className="px-8 py-3 text-white shadow-soft hover:shadow-soft-lg transition-all duration-250 hover:-translate-y-0.5" style={{ backgroundColor: 'var(--primary-color)' }}>
              View All Products
            </Button>
          </Link>
        </div>
      )}

      {mobileInfiniteScroll && (
        <div
          ref={sentinelRef}
          className="mt-6 flex min-h-[52px] flex-col items-center justify-center gap-2 py-4"
          aria-hidden
        >
          {loadingMore && (
            <p className="text-sm text-slate-500">Loading more…</p>
          )}
          {!loadingMore &&
            products.length > 0 &&
            (remoteExhausted ||
              (products.length >= totalCatalog &&
                visibleCount >= products.length)) && (
              <p className="text-xs text-slate-400">You&apos;re all caught up</p>
            )}
        </div>
      )}
    </div>
  );
};

export default HomeProducts;
