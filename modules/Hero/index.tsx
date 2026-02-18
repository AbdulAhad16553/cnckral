import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { HeroImageCarousel } from "@/components/HeroImageCarousel";
import { FeaturedProductImageCarousel } from "@/components/FeaturedProductImageCarousel";

interface HeroProps {
  content: {
    title?: string;
    content?: string;
    heroImage?: string;
  };
  storeData: any;
  categories: any[];
  products: any[];
  hideOnPage: boolean;
}

const Hero = async ({
  content,
  storeData,
  products,
  hideOnPage,
}: HeroProps) => {
  const storeName =  "CNC KRAL";

  const featuredProduct = Array.isArray(products) && products.length > 0 ? products[0] : null;
  const productImages = (() => {
    const imgs = featuredProduct?.product_images ?? [];
    if (imgs.length === 0) return [];
    const featured = imgs.find((img: any) => img?.position === "featured");
    const rest = imgs.filter((img: any) => img?.position !== "featured");
    return featured ? [featured, ...rest] : imgs;
  })();

  const infoCards = [
    {
      title: "CNC Tool Holder & Collet Maintenance",
      href: "/contact",
      description: "Keep your tools performing at peak",
    },
    {
      title: "Why are my CNC bits breaking?",
      href: "/contact",
      description: "Expert troubleshooting guide",
    },
  ];

  return (
    <section className="relative w-full bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="page-container py-16 lg:py-24">
        {/* Auto-moving hero image carousel */}
        <div className="mb-12 max-w-5xl mx-auto">
          <HeroImageCarousel />
        </div>
        {/* Welcome hero - CNC Tooling Shop style */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Welcome to the {storeName}
          </h1>
          {!hideOnPage && (
            <Link href="/shop">
              <Button
                size="lg"
                className="group px-8 py-6 text-base font-semibold text-white gradient-blue hover:opacity-95 transition-opacity"
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          )}
        </div>

        {/* Featured product ellipse card */}
        {featuredProduct && featuredProduct.id !== "no-product" && (
          <div className="flex justify-center mb-12">
            <Link
              href={`/product/${encodeURIComponent(featuredProduct.sku || featuredProduct.slug || featuredProduct.id)}`}
              className="group"
            >
              <div className="relative flex items-center gap-6 sm:gap-8 px-5 sm:px-8 py-4 sm:py-5 rounded-full bg-white/90 shadow-xl border border-slate-200/70 backdrop-blur-md max-w-3xl">
                {/* Product images carousel */}
                <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-100 border border-slate-200 transition-transform duration-300 group-hover:scale-105">
                  <FeaturedProductImageCarousel
                    images={productImages}
                    alt={featuredProduct.name || "Featured product"}
                    className="w-full h-full"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold tracking-wide uppercase text-[#21B9FF] mb-1">
                    Featured Product
                  </p>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 line-clamp-1">
                    {featuredProduct.name}
                  </h2>
                  {featuredProduct.short_description && (
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 line-clamp-2">
                      {featuredProduct.short_description}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="hidden sm:flex flex-col items-end justify-center">
                  <span className="text-[11px] font-medium text-slate-500 mb-1">
                    Explore details
                  </span>
                  <div className="inline-flex items-center gap-1 text-sm font-semibold text-[#21B9FF] group-hover:text-[#1593cc] transition-colors">
                    View Product
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Info cards - CNC Tooling Shop style */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {infoCards.map((card, i) => (
            <Link
              key={i}
              href={card.href}
              className="group flex items-center justify-between p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <Wrench className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-[#21B9FF] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-500">{card.description}</p>
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-[#21B9FF] transition-colors">
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
