"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryStripProps {
  categories: Array<{ name: string; slug: string; product_count?: number }>;
  className?: string;
}

export function CategoryStrip({ categories, className = "" }: CategoryStripProps) {
  return (
    <section className={className}>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.05 },
          },
        }}
      >
        {categories?.map((cat, i) => (
          <motion.div key={cat.slug} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
            <Link
              href={`/category/${cat.slug}`}
              className="block py-3 px-4 rounded-lg border border-slate-200 bg-white hover:border-[var(--primary-color)]/30 hover:shadow-md hover:shadow-[var(--primary-color)]/5 hover:bg-[var(--primary-color)]/[0.02] transition-all duration-200 group"
            >
              <span className="text-slate-800 font-medium group-hover:text-[var(--primary-color)] transition-colors">
                {cat.name}
              </span>
              {cat.product_count != null && cat.product_count > 0 && (
                <span className="text-slate-500 text-sm ml-1">({cat.product_count})</span>
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Link href="/shop">
          <Button
            size="lg"
            variant="outline"
            className="border-[var(--secondary-color)]/40 text-slate-700 hover:bg-[var(--primary-color)]/5 hover:border-[var(--primary-color)]/40 hover:text-[var(--primary-color)] px-8"
          >
            Explore Products
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
