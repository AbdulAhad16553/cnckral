"use client";

import React, { useEffect, useState, useRef } from "react";
import PriceRangeFilter from "../../common/PriceRangeFilter";
import Categories from "../Categories";
import ProductImagePreview from "@/components/ProductImagePreview";
import { useBatchItemImages } from "@/hooks/useBatchItemImages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, SortAsc, Wrench, Shield } from "lucide-react";
import Link from "next/link";

interface NecessaryProps {
    storeId: string;
    companyId: string;
}

interface CategoriesContentProps {
    catProducts: any;
    catName: string;
    catSubCats: any;
    currentStock?: any[];
    storeCurrency: string;
    necessary: NecessaryProps;
}

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';

const CategoriesContent = ({
    catProducts,
    catName,
    catSubCats,
    currentStock = [],
    storeCurrency,
    necessary,
}: CategoriesContentProps) => {

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [showFilters, setShowFilters] = useState(false);
    const userChangedPrice = useRef(false);

    // Initialize price range from catProducts
    useEffect(() => {
        if (catProducts && catProducts.length > 0 && !userChangedPrice.current) {
            const prices = catProducts.flatMap((product: any) => {
                const prices: number[] = [];
                // Get price from main product
                if (product.sale_price) prices.push(product.sale_price);
                if (product.base_price) prices.push(product.base_price);
                // Get prices from variations if they exist
                if (product.product_variations) {
                    product.product_variations.forEach((variation: any) => {
                        if (variation.sale_price) prices.push(variation.sale_price);
                        if (variation.base_price) prices.push(variation.base_price);
                    });
                }
                return prices;
            }).filter((price: number) => price > 0);
            
            const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
            setPriceRange([0, maxPrice]);
        }
    }, [catProducts]);

    const handlePriceRangeChange = (newRange: [number, number]) => {
        userChangedPrice.current = true;
        setPriceRange(newRange);
    };

    const sortProducts = (products: any[], sortOption: SortOption) => {
        if (!products || products.length === 0) return products;
        
        const sortedProducts = [...products];
        
        switch (sortOption) {
            case 'name-asc':
                return sortedProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            case 'name-desc':
                return sortedProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
            case 'price-asc':
                return sortedProducts.sort((a, b) => {
                    const priceA = a.sale_price || a.base_price || 0;
                    const priceB = b.sale_price || b.base_price || 0;
                    return priceA - priceB;
                });
            case 'price-desc':
                return sortedProducts.sort((a, b) => {
                    const priceA = a.sale_price || a.base_price || 0;
                    const priceB = b.sale_price || b.base_price || 0;
                    return priceB - priceA;
                });
            case 'newest':
                return sortedProducts.sort((a, b) => {
                    const dateA = a.created_at || a.creation || 0;
                    const dateB = b.created_at || b.creation || 0;
                    return new Date(dateB).getTime() - new Date(dateA).getTime();
                });
            default:
                return sortedProducts;
        }
    };

    // Filter products by price range
    const filterByPriceRange = (products: any[]) => {
        if (!products || products.length === 0) return products;
        if (priceRange[0] === 0 && priceRange[1] === 0) return products;
        
        return products.filter((product: any) => {
            const productPrice = product.sale_price || product.base_price || 0;
            // For variable products, check if any variation is in range
            if (product.product_variations && product.product_variations.length > 0) {
                return product.product_variations.some((variation: any) => {
                    const variationPrice = variation.sale_price || variation.base_price || 0;
                    return variationPrice >= priceRange[0] && variationPrice <= priceRange[1];
                });
            }
            return productPrice >= priceRange[0] && productPrice <= priceRange[1];
        });
    };

    // Use catProducts directly (already fetched on server)
    const filteredProducts = filterByPriceRange(catProducts || []);
    const sortedProducts = sortProducts(filteredProducts, sortBy);
    const hasProducts = sortedProducts.length > 0;
    const hasSubCategories = catSubCats && catSubCats.length > 0;
    const showPriceFilter = !hasSubCategories && hasProducts;

    // Batch image loading for CNC-style product grid
    const itemNames = React.useMemo(() => sortedProducts?.map((p: any) => p.sku).filter(Boolean) || [], [sortedProducts]);
    const { isLoading: isImageLoading, getImageUrl, hasImage } = useBatchItemImages({
        itemNames,
        enabled: hasProducts && !hasSubCategories
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb - CNC-STEP style */}
            <nav className="mb-4">
                <p className="text-sm text-slate-500">
                    You are here:{" "}
                    <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
                    <span className="mx-1">»</span>
                    <Link href="/category" className="text-slate-600 hover:text-slate-900 transition-colors">Categories</Link>
                    <span className="mx-1">»</span>
                    <span className="text-slate-900 font-medium">{catName || "Category"}</span>
                </p>
            </nav>

            {/* Page Title with separator - CNC-STEP style */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {catName || "Category"} – {hasSubCategories ? "Sub-Categories" : "Products"}
            </h1>
            <div className="h-px bg-slate-200 mb-8" />

            {/* Intro paragraph - CNC-STEP style */}
            <div className="mb-10 max-w-4xl">
                <p className="text-slate-700 leading-relaxed">
                    {hasSubCategories ? (
                        <>Browse our <strong>{catName}</strong> sub-categories. Select a category to explore products.</>
                    ) : (
                        <>
                            Our shop with accessories, parts, and tools. You will find a wide range of products in this category. 
                            Whether for milling, engraving, or general machining—all parts are matched for top quality and reliability.
                        </>
                    )}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar - Filters */}
                {showPriceFilter && (
                    <div className="lg:col-span-3 xl:col-span-2">
                        <Card className="sticky top-4 border-slate-200">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <Filter className="h-4 w-4 text-slate-600" />
                                    Filters
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <PriceRangeFilter 
                                    priceRange={priceRange} 
                                    onPriceRangeChange={handlePriceRangeChange}
                                    currency={storeCurrency}
                                />
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Content */}
                <div className={showPriceFilter ? "lg:col-span-9 xl:col-span-10" : "lg:col-span-12"}>
                    {hasSubCategories ? (
                        <Categories subcat={true} categories={catSubCats} hideOnPage={true} />
                    ) : hasProducts ? (
                        <>
                            {/* Sort bar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                                <span className="text-sm text-slate-600">
                                    {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
                                </span>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-9 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="name-asc">Name A–Z</option>
                                        <option value="name-desc">Name Z–A</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                    </select>
                                    <SortAsc className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* CNC-STEP style product grid - clean image + title cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
                                {sortedProducts.map((product: any) => {
                                    const imageUrl = getImageUrl(product.sku);
                                    const productHasImage = hasImage(product.sku);
                                    const productSlug = product.slug || product.sku || product.name;
                                    return (
                                        <Link
                                            key={product.id || product.sku}
                                            href={`/product/${encodeURIComponent(productSlug)}`}
                                            className="group block"
                                        >
                                            <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200 aspect-[260/185] flex items-center justify-center p-4">
                                                <ProductImagePreview
                                                    itemName={product.sku}
                                                    productName={product.name}
                                                    imageUrl={imageUrl}
                                                    hasImage={productHasImage}
                                                    isLoading={isImageLoading}
                                                    width={260}
                                                    height={185}
                                                    className="w-full h-full object-contain"
                                                    showPreview={false}
                                                />
                                            </div>
                                            <h3 className="mt-3 text-sm font-medium text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-2 text-center leading-snug">
                                                {product.name}
                                            </h3>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* CNC-STEP style info section */}
                            <div className="bg-slate-50 rounded-xl p-8 md:p-10 border border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Wrench className="h-5 w-5 text-slate-600" />
                                    Perfectly matched accessories
                                </h2>
                                <h3 className="text-base font-semibold text-slate-800 mb-3">High-quality parts</h3>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    All parts and tools in our range are precisely matched for performance and durability. 
                                    We work with high-quality materials to ensure long-term reliability for your CNC machining applications.
                                </p>
                                <h3 className="text-base font-semibold text-slate-800 mb-3">Wide selection</h3>
                                <p className="text-slate-600 leading-relaxed flex items-start gap-2">
                                    <Shield className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                                    From milling cutters to clamping tools, controls, and accessories—we offer everything 
                                    you need to expand and complement the versatility of your machines.
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-300 mb-4">
                                <Filter className="h-16 w-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                {catProducts && catProducts.length > 0
                                    ? "No products match your current filters. Try adjusting your price range."
                                    : "This category doesn't have any products yet. Check back later for new products."}
                            </p>
                            {catProducts && catProducts.length > 0 && (
                                <Button
                                    variant="outline"
                                    className="border-slate-300"
                                    onClick={() => {
                                        const allPrices = catProducts.flatMap((product: any) => {
                                            const prs: number[] = [];
                                            if (product.sale_price) prs.push(product.sale_price);
                                            if (product.base_price) prs.push(product.base_price);
                                            if (product.product_variations) {
                                                product.product_variations.forEach((v: any) => {
                                                    if (v.sale_price) prs.push(v.sale_price);
                                                    if (v.base_price) prs.push(v.base_price);
                                                });
                                            }
                                            return prs;
                                        }).filter((p: number) => p > 0);
                                        const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;
                                        setPriceRange([0, maxPrice]);
                                        userChangedPrice.current = false;
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoriesContent;
