"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  Mail,
  Phone,
  ChevronDown,
  Heart,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Cart from "@/components/Cart";
import Account from "@/modules/Account";
import { getCategories } from "@/hooks/getCategories";
import { productService } from "@/lib/erpnext/services/productService";
import { getOptimizedImageUrl, IMAGE_SIZES } from "@/lib/imageUtils";
import { formatPrice, getEffectivePrice } from "@/lib/currencyUtils";
interface StoreData {
  store_name?: string;
  store_detail?: {
    tagline?: string;
    header_logo_id?: string;
    primary_color?: string;
    currency?: string;
  };
  id?: string;
  company_id?: string;
  company_logo?: string;
  store_contact_detail?: {
    phone?: string;
    email?: string;
  };
}

const Header = ({ storeData }: { storeData: StoreData }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; slug: string }>
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // Extract store data
  const storeName = storeData?.store_name || "Your Store";
  const tagline = storeData?.store_detail?.tagline;
  const headerLogoId = storeData?.store_detail?.header_logo_id;
  const companyLogo = storeData?.company_logo;
  const primaryColor = storeData?.store_detail?.primary_color || "#3B82F6";
  const storeId = storeData?.id;
  const companyId = storeData?.company_id;
  const storeCurrency = storeData?.store_detail?.currency || "Rs.";
  // Contact fallbacks
  const topBarPhone = "+923103339404";
  const topBarEmail = "cnckral@gmail.com";

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search products state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Search products effect
  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearchLoading(true);
      try {
        const results = await productService.searchProducts(debouncedSearchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    };

    searchProducts();
  }, [debouncedSearchTerm]);

  const fetchCategories = useCallback(async () => {
    if (!storeId) return;

    setIsLoadingCategories(true);
    try {
      const { categories: fetchedCategories } = await getCategories(storeId);
      setCategories(fetchedCategories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [storeId]);

  // Fetch categories when component mounts
  useEffect(() => {
    if (storeId) {
      fetchCategories();
    }
  }, [storeId, fetchCategories]);

  // Improved hover behavior for categories dropdown
  const handleCategoryMouseEnter = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    setIsCategoryMenuOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setIsCategoryMenuOpen(false);
    }, 150); // 150ms delay before closing
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearchDropdownOpen(value.length >= 2);
    setSelectedSearchIndex(-1);
  };

  // Handle search result click
  const handleSearchResultClick = (slug: string) => {
    router.push(`/product/${slug}`);
    setSearchTerm("");
    setIsSearchDropdownOpen(false);
    setSelectedSearchIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchDropdownOpen || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSearchIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSearchIndex((prev) =>
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (
          selectedSearchIndex >= 0 &&
          selectedSearchIndex < searchResults.length
        ) {
          handleSearchResultClick(searchResults[selectedSearchIndex].slug);
        }
        break;
      case "Escape":
        setIsSearchDropdownOpen(false);
        setSelectedSearchIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node) &&
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }

      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (categoryTimeoutRef.current) {
        clearTimeout(categoryTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Top Bar - International style */}
      <div className="gradient-blue-grey text-slate-300 py-2 text-sm hidden md:block border-b border-white/20">
        <div className="page-container flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href={`tel:${topBarPhone}`} className="hover:text-white transition-colors flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              <span>{topBarPhone}</span>
            </a>
            <a href={`mailto:${topBarEmail}`} className="hover:text-white transition-colors flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span>{topBarEmail}</span>
            </a>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Free shipping on orders over Rs. 10,000</span>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="gradient-blue-grey border-b border-white/20 sticky top-0 z-50 shadow-sm">
        <div className="page-container">
          {/* Main Header Content */}
          <div className="flex items-center justify-between gap-6 py-4">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex-shrink-0 group">
                <div className="flex items-center ">
                  <Image
                    src="/HORIZONTAL Logo CNC KRAL.png"
                    alt={`${storeName} Logo`}
                    width={90}
                    height={60}
                    className="transition-transform duration-300 group-hover:scale-105 object-contain brightness-0 invert"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className="text-white/90 hover:text-white font-medium transition-colors"
              >
                Home
              </Link>
              <div className="relative group">
                <button
                  ref={categoryButtonRef}
                  className="flex items-center space-x-1 text-white/90 hover:text-white font-medium transition-colors"
                  onMouseEnter={handleCategoryMouseEnter}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isCategoryMenuOpen && (
                  <div
                    ref={categoryMenuRef}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-soft-lg border border-slate-200 py-2 z-50"
                    onMouseEnter={handleCategoryMouseEnter}
                    onMouseLeave={handleCategoryMouseLeave}
                  >
                    <div className="px-4 py-2">
                      <Link
                        href="/category"
                        className="block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors font-medium text-slate-700"
                      >
                        All Categories
                      </Link>
                      <Link
                        href="/shop"
                        className="block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors font-medium text-slate-700"
                      >
                        Shop All
                      </Link>
                      {categories.length > 0 && (
                        <>
                          <div className="border-t border-slate-200 my-2"></div>
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/category/${category.slug}`}
                              className="block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-slate-700"
                              onClick={() => setIsCategoryMenuOpen(false)}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </>
                      )}
                      {isLoadingCategories && (
                        <div className="px-3 py-2 text-sm text-slate-500">
                          Loading categories...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/shop"
                className="text-white/90 hover:text-white font-medium transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/about-us"
                className="text-white/90 hover:text-white font-medium transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-white/90 hover:text-white font-medium transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Search Section */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative" ref={searchDropdownRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-2 focus:ring-white/20 rounded-lg transition-all"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() =>
                    searchTerm.length >= 2 && setIsSearchDropdownOpen(true)
                  }
                  aria-expanded={isSearchDropdownOpen}
                  aria-haspopup="listbox"
                  role="combobox"
                  aria-autocomplete="list"
                />

                {/* Search Dropdown */}
                {isSearchDropdownOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-soft-lg border border-slate-200 z-50 max-h-96 overflow-y-auto"
                    role="listbox"
                    aria-label="Search results"
                  >
                    {isSearchLoading ? (
                      <div className="p-4 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                        <p className="text-sm text-slate-500 mt-2">
                          Searching...
                        </p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map(
                          (
                            product: {
                              id: string;
                              name: string;
                              short_description?: string;
                              slug: string;
                              base_price: number;
                              sale_price?: number;
                              currency: string;
                              status: string;
                              product_images: Array<{
                                id: string;
                                image_id: string;
                                position: string;
                              }>;
                            },
                            index: number
                          ) => {
                            const featuredImage = product?.product_images?.find(
                              (image) => image.position === "featured"
                            );
                            const isSelected = index === selectedSearchIndex;

                            return (
                              <div
                                key={product.id}
                                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                                  isSelected
                                    ? "bg-slate-100 border-l-4 border-slate-900"
                                    : "hover:bg-slate-50"
                                }`}
                                onClick={() =>
                                  handleSearchResultClick(product.slug)
                                }
                                role="option"
                                aria-selected={isSelected}
                              >
                                <div className="w-12 h-12 flex-shrink-0">
                                  <Image
                                    src={getOptimizedImageUrl(
                                      featuredImage?.image_id,
                                      IMAGE_SIZES.PRODUCT_CARD
                                    )}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm text-slate-900 truncate">
                                    {product.name}
                                  </h4>
                                  {product.short_description && (
                                    <p className="text-xs text-slate-500 truncate">
                                      {product.short_description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : debouncedSearchTerm.length >= 2 ? (
                      <div className="p-4 text-center">
                        <Search className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                        <p className="text-sm text-slate-500">
                          No products found
                        </p>
                        <p className="text-xs text-slate-400">
                          Try different keywords
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Contact quick info visible on md+ */}
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                {/* <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{topBarPhone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{topBarEmail}</span>
                </div> */}
              </div>
              {/* Search Icon for Mobile */}
              <button
                className="md:hidden p-2 text-white/90 hover:text-white transition-colors duration-200"
                onClick={() => setIsSearchVisible(true)}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-white/90 hover:text-white transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-3">
              <Link
  href="/wishlist"
  className="
    relative p-2
    text-white/90
    transition-all duration-300 
    hover:text-red-300 
    hover:scale-110 
    active:scale-95
    group
  "
>
  {/* Glow on Hover */}
  <span
    className="
      absolute inset-0 
      rounded-full 
      opacity-0 group-hover:opacity-100 
      bg-red-400/20 
      blur-xl 
      transition-opacity duration-300
    "
  ></span>

  {/* Heart Icon */}
  <Heart
    className="
      w-6 h-6 relative z-10 
      transition-all duration-300
      group-hover:fill-red-300 group-hover:text-red-300 
      group-hover:animate-pulse
    "
  />
</Link>

                <Cart />
                {storeId && companyId && (
                  <Account storeId={storeId} companyId={companyId} />
                )}
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden border-t border-slate-200 bg-slate-50">
            <div className="page-container py-4">
              <nav className="space-y-1">
                <Link
                  href="/"
                  className="block py-2.5 px-3 text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/category"
                  className="block py-2.5 px-3 text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
                >
                  Categories
                </Link>
                <Link
                  href="/shop"
                  className="block py-2.5 px-3 text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
                >
                  Shop
                </Link>
                <Link
                  href="/about-us"
                  className="block py-2.5 px-3 text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block py-2.5 px-3 text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
                >
                  Contact
                </Link>
              </nav>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-3">
                  <Link
                    href="/wishlist"
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <Heart className="w-5 h-5" />
                  </Link>
                  <Cart />
                  {storeId && companyId && (
                    <Account storeId={storeId} companyId={companyId} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Search Section */}
      {isSearchVisible && (
        <div
          id="mobile-search"
          className="fixed top-0 left-0 w-full h-full bg-white z-50 p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Search Products</h2>
            <button onClick={() => setIsSearchVisible(false)}>
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for products..."
              className="w-full mb-4"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              autoFocus
              aria-expanded={isSearchDropdownOpen}
              aria-haspopup="listbox"
              role="combobox"
              aria-autocomplete="list"
            />

            {/* Mobile Search Results */}
            {isSearchDropdownOpen && (
              <div
                className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
                role="listbox"
                aria-label="Search results"
              >
                {isSearchLoading ? (
                  <div className="p-4 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map(
                      (
                        product: {
                          id: string;
                          name: string;
                          short_description?: string;
                          slug: string;
                          base_price: number;
                          sale_price?: number;
                          currency: string;
                          status: string;
                          product_images: Array<{
                            id: string;
                            image_id: string;
                            position: string;
                          }>;
                        },
                        index: number
                      ) => {
                        const featuredImage = product?.product_images?.find(
                          (image) => image.position === "featured"
                        );
                        const effectivePrice = getEffectivePrice(product);
                        const isSelected = index === selectedSearchIndex;

                        return (
                          <div
                            key={product.id}
                            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-blue-50 border-l-4 border-blue-500"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() =>
                              handleSearchResultClick(product.slug)
                            }
                            role="option"
                            aria-selected={isSelected}
                          >
                            <div className="w-12 h-12 flex-shrink-0">
                              <Image
                                src={getOptimizedImageUrl(
                                  featuredImage?.image_id,
                                  IMAGE_SIZES.PRODUCT_CARD
                                )}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-900 truncate">
                                {product.name}
                              </h4>
                              {product.short_description && (
                                <p className="text-xs text-gray-500 truncate">
                                  {product.short_description}
                                </p>
                              )}
                              <p className="text-sm font-semibold text-primary">
                                {formatPrice(
                                  effectivePrice,
                                  product.currency || storeCurrency
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : debouncedSearchTerm.length >= 2 ? (
                  <div className="p-4 text-center">
                    <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">No products found</p>
                    <p className="text-xs text-gray-400">
                      Try different keywords
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
