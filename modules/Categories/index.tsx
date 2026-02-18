"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getOptimizedImageUrl, IMAGE_SIZES } from "@/lib/imageUtils";
import { FolderOpen } from "lucide-react";

interface CategoriesProps {
  subcat: boolean;
  categories: any;
  hideOnPage: boolean;
}

const Categories = ({ categories, hideOnPage, subcat }: CategoriesProps) => {
  return (
    <section className="mb-14">
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {categories?.length > 0 ? (
          categories.map((category: any) => (
            <motion.div
              key={category.id ?? category.slug ?? category.name ?? 'cat'}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                },
              }}
            >
              <Link
                href={`/category/${category.slug}`}
                className="group block"
              >
                <motion.div
                  className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200/80 hover:border-slate-300 hover:shadow-md aspect-[260/185] flex items-center justify-center p-4"
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Image
                    src={getOptimizedImageUrl(category?.image_id, IMAGE_SIZES.CATEGORY)}
                    alt={category?.name || "Category"}
                    width={260}
                    height={185}
                    style={{ objectFit: "contain" }}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </motion.div>
                <h3 className="mt-3 text-sm font-medium text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-2 text-center leading-snug">
                  {category.name}
                  {category.product_count && (
                    <span className="block text-xs text-slate-500 mt-1 font-normal">
                      {category.product_count} {category.product_count === 1 ? "item" : "items"}
                    </span>
                  )}
                </h3>
              </Link>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="col-span-full text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-slate-300 mb-4">
              <FolderOpen className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No categories available</h3>
            <p className="text-slate-500">Check back later for new categories!</p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Categories;