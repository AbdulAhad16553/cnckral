"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  ChevronDown,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Cart from "@/components/Cart";
import Account from "@/modules/Account";
import { getCategories } from "@/hooks/getCategories";
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
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; slug: string }>
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract store data
  const storeName = storeData?.store_name || "Your Store";
  const tagline = storeData?.store_detail?.tagline;
  const headerLogoId = storeData?.store_detail?.header_logo_id;
  const companyLogo = storeData?.company_logo;
  const primaryColor = storeData?.store_detail?.primary_color || "#E60001";
  const storeId = storeData?.id;
  const companyId = storeData?.company_id;
  const storeCurrency = storeData?.store_detail?.currency || "Rs.";
  // Contact fallbacks
  const topBarPhone = "+923103339404";
  const topBarEmail = "cnckral@gmail.com";

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 py-3 sm:py-4">
            {/* Logo + Mobile Actions */}
            <div className="flex items-center justify-between">
              <Link href="/" className="flex-shrink-0 group">
                <Image
                  src="/krallogo.svg"
                  alt={`${storeName} Logo`}
                  width={90}
                  height={60}
                  className="h-10 w-auto sm:h-12 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              {/* Mobile: wishlist, cart, account - shown on small screens */}
              <div className="flex sm:hidden items-center space-x-2">
                <Link href="/wishlist" className="p-2 text-white/90 hover:text-white transition-colors">
                  <Heart className="w-5 h-5" />
                </Link>
                <Cart />
                {storeId && companyId && (
                  <Account storeId={storeId} companyId={companyId} />
                )}
              </div>
            </div>

            {/* Navigation - visible on all screens, scrollable on mobile */}
            <nav className="flex items-center gap-1 sm:gap-4 lg:gap-8 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 py-1 sm:py-0 min-w-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              <Link
                href="/"
                className="flex-shrink-0 text-white/90 hover:text-white font-medium transition-colors text-sm sm:text-base py-1.5"
              >
                Home
              </Link>
              <div className="relative group flex-shrink-0">
                <button
                  ref={categoryButtonRef}
                  className="flex items-center space-x-1 text-white/90 hover:text-white font-medium transition-colors text-sm sm:text-base py-1.5"
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
                        href="/machine"
                        className="block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors font-medium text-slate-700"
                      >
                        Machines
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
                href="/machine"
                className="flex-shrink-0 text-white/90 hover:text-white font-medium transition-colors text-sm sm:text-base py-1.5"
              >
                Machines
              </Link>
              <Link
                href="/parts"
                className="flex-shrink-0 text-white/90 hover:text-white font-medium transition-colors text-sm sm:text-base py-1.5"
              >
                Parts
              </Link>
              <Link
                href="/about-us"
                className="flex-shrink-0 text-white/90 hover:text-white font-medium transition-colors text-sm sm:text-base py-1.5"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="flex-shrink-0 text-white/90 hover:text-white font-medium transition-colors text-sm sm:text-base py-1.5"
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Right Side Actions - hidden on mobile (shown above) */}
            <div className="hidden sm:flex items-center space-x-3 flex-shrink-0">
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
      </header>

    </>
  );
};

export default Header;
