import Hero from "@/modules/Hero";
import HomeProducts from "@/components/Products/HomeProducts";
import HeroAnimationWrapper from "@/components/HeroAnimationWrapper";
import AnimatedSection from "@/components/AnimatedSection";
import { CategoryStrip } from "@/components/CategoryStrip";
import { NeedHelpSection } from "@/components/NeedHelpSection";
import { ResourceLinks } from "@/components/ResourceLinks";
import { NewsletterSection } from "@/components/NewsletterSection";
import { headers } from "next/headers";
import { getUrlWithScheme } from "@/lib/getUrlWithScheme";
import Layout from "@/components/Layout";
import { getCategories } from "@/hooks/getCategories";
import { getStorePage } from "@/hooks/getStorePage";

export async function generateMetadata() {
  const Headers = await headers();
  const host = Headers.get("host");
  if (!host) {
    throw new Error("Host header is missing or invalid");
  }

  const fullStoreUrl = getUrlWithScheme(host);
  const response = await fetch(`${fullStoreUrl}/api/fetchStore`);
  const data = await response.json();

  const { page } = await getStorePage(data?.store?.stores[0].id, "home");

  return {
    title: page?.meta_title || "Items.pk",
    description: page?.meta_description || "Manage your online store, inventory, and sales all in one place",
    generator: data?.store?.stores?.[0]?.store_name,
    applicationName: data?.store?.stores?.[0]?.store_name,
    keywords: "",
    // metadataBase: ,
  };
}

export default async function Home() {
  const Headers = await headers();
  const host = Headers.get("host");
  if (!host) {
    throw new Error("Host header is missing or invalid");
  }

  const fullStoreUrl = getUrlWithScheme(host);

  const response = await fetch(`${fullStoreUrl}/api/fetchStore`, { next: { revalidate: 300 } });
  const data = await response.json();
  const storeId = data?.store?.stores[0].id;
  const companyId = data?.store?.stores[0].company_id;

  const storeCurrency = data?.store?.stores[0].store_detail?.currency
    ? data?.store?.stores[0].store_detail?.currency
    : "Rs.";

  const { categories } = await getCategories(storeId);
  const { page } = await getStorePage(storeId, "home");

  const normalizeImagePath = (path?: string | null) => {
    if (!path) return undefined;
    const withoutDomain = path.replace(/^https?:\/\/[^/]+/i, "");
    if (withoutDomain.startsWith("/files/")) return withoutDomain;
    return `/files/${withoutDomain.replace(/^\/?files?\//i, "")}`;
  };

  const normalizeImages = (images: any[] | undefined) => {
    if (!images || images.length === 0) return [];
    return images.map((img, idx) => ({
      ...img,
      image_id: normalizeImagePath(img?.image_id || img?.image || img) || img,
      position: img?.position || (idx === 0 ? "featured" : idx + 1),
    }));
  };

  const buildVariations = (product: any) => {
    const variants =
      product?.product_variations ||
      product?.variants ||
      [];
    if (!variants || variants.length === 0) return [];

    return variants.map((variant: any) => {
      const vPrice =
        Number(variant.sale_price) ||
        Number(variant.base_price) ||
        Number(variant.price) ||
        Number(variant.standard_rate) ||
        0;
      return {
        ...variant,
        id: variant.id || variant.name,
        sku: variant.sku || variant.name,
        name: variant.item_name || variant.name,
        base_price: vPrice,
        sale_price: vPrice,
        price: vPrice,
        standard_rate: vPrice,
      };
    });
  };

  const buildFeaturedProductPayload = (product: any) => {
    const product_variations = buildVariations(product);
    const variationPrices = product_variations
      .map((v: any) => Number(v.base_price) || 0)
      .filter((p: number) => p > 0);
    const maxVariationPrice =
      variationPrices.length > 0 ? Math.max(...variationPrices) : 0;

    const basePrice =
      maxVariationPrice ||
      Number(product?.price) ||
      Number(product?.standard_rate) ||
      Number(product?.base_price) ||
      Number(product?.sale_price) ||
      0;

    let product_images =
      normalizeImages(product?.product_images) ||
      [];
    if (product_images.length === 0 && (product?.website_image || product?.image)) {
      const singlePath = normalizeImagePath(product.website_image || product.image);
      if (singlePath) {
        product_images = [{ image_id: singlePath, position: "featured" }];
      }
    }

    return {
      ...product,
      id: product?.id || product?.name,
      name: product?.item_name || product?.name,
      short_description: product?.short_description || product?.description,
      description: product?.description,
      slug: product?.slug || product?.item_code || product?.name,
      sku: product?.sku || product?.item_code || product?.name,
      base_price: basePrice,
      sale_price: basePrice,
      currency: product?.currency || storeCurrency,
      product_variations,
      product_images,
    };
  };

  // Fetch products and pick a random one each request
  const limit = 12;
  let featuredProduct = null;
  const homeProducts: any[] = [];

  try {
    const firstResponse = await fetch(
      `${fullStoreUrl}/api/products?page=1&limit=${limit}`,
      { next: { revalidate: 60 } }
    );

    if (firstResponse.ok) {
      const firstData = await firstResponse.json();
      const products = firstData.products || [];
      const normalizedProducts = products.map(buildFeaturedProductPayload);
      homeProducts.push(...normalizedProducts.slice(0, 8));
      const totalProducts =
        firstData.pagination?.totalProducts || products.length || 0;

      const randomIndex = totalProducts > 0 ? Math.floor(Math.random() * totalProducts) : 0;
      const targetPage = Math.max(1, Math.floor(randomIndex / limit) + 1);
      const targetIndex = randomIndex % limit;

      if (targetPage === 1 || totalProducts <= products.length) {
        const chosen = normalizedProducts[Math.min(targetIndex, normalizedProducts.length - 1)];
        if (chosen) {
          featuredProduct = chosen;
        }
      } else {
        // Fetch the target page to pick that product
        const pageResponse = await fetch(
          `${fullStoreUrl}/api/products?page=${targetPage}&limit=${limit}`,
          { next: { revalidate: 60 } }
        );
        if (pageResponse.ok) {
          const pageData = await pageResponse.json();
          const pageProducts = pageData.products || [];
          const normalizedPageProducts = pageProducts.map(buildFeaturedProductPayload);
          const chosen = normalizedPageProducts[Math.min(targetIndex, normalizedPageProducts.length - 1)];
          if (chosen) {
            featuredProduct = chosen;
          }
          // Only fill home products if we didn't get any from the first page
          if (homeProducts.length === 0) {
            homeProducts.push(...normalizedPageProducts.slice(0, 8));
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching random hero product:", error);
  }

  // Fallback to empty product if nothing found
  if (!featuredProduct) {
    featuredProduct = {
      id: "no-product",
      name: "No Product Available",
      short_description: "Products will appear here once added.",
      description: "Products will appear here once added.",
      slug: "no-product",
      sku: "no-product",
      base_price: 0,
      sale_price: 0,
      currency: storeCurrency,
      product_variations: [],
      product_images: [],
    };
  }
  // Ensure we always have something to show in the products grid
  const initialHomeProducts =
    homeProducts.length > 0 ? homeProducts : featuredProduct ? [featuredProduct] : [];

  return (
    <Layout>
      <HeroAnimationWrapper>
        <Hero
          content={{
            title: "Laser Technology That Defines Excellence",
            content: "At Kral Laser, we combine cutting-edge technology with unmatched craftsmanship to deliver precise, flawless laser cutting for metal, wood, acrylic, and more.",
            heroImage: undefined,
          }}
          storeData={data?.store?.stores[0]}
          categories={categories}
          products={featuredProduct ? [featuredProduct] : []}
          hideOnPage={false}
        />
      </HeroAnimationWrapper>

      {/* Category strip - CNC Tooling Shop style */}
      <div className="bg-white page-container py-12 lg:py-14">
        <AnimatedSection delay={0.05}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
          </div>
          <CategoryStrip categories={categories || []} />
        </AnimatedSection>
      </div>

      {/* Need help + Resource links */}
      <div className="bg-slate-50/50 page-container py-12 lg:py-14">
        <AnimatedSection delay={0.08}>
          <NeedHelpSection />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Resources</h2>
            <ResourceLinks />
          </div>
        </AnimatedSection>
      </div>

      {/* Featured Products */}
      <div className="bg-white page-container py-12 lg:py-14">
        <AnimatedSection delay={0.12}>
          <HomeProducts
            companyId={companyId}
            storeId={storeId}
            storeCurrency={storeCurrency}
            initialProducts={initialHomeProducts}
            className="w-full"
          />
        </AnimatedSection>
      </div>

      {/* Newsletter */}
      <div className="page-container py-12 lg:py-14">
        <NewsletterSection />
      </div>
    </Layout>
  );
}
