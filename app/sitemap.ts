import type { MetadataRoute } from "next";
import { productService } from "@/lib/erpnext/services/productService";

const SITE_URL = "https://cnckral.com";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/parts",
  "/machine",
  "/category",
  "/about-us",
  "/contact",
  "/blog",
  "/privacy-policy",
  "/terms-conditions",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  try {
    const [products, categories] = await Promise.all([
      productService.getProducts({ disabled: 0 }),
      productService.getCategories(),
    ]);

    const productEntries: MetadataRoute.Sitemap = products.map((product) => {
      const slug = encodeURIComponent(product.item_code || product.name);
      return {
        url: `${SITE_URL}/product/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

    const categoryEntries: MetadataRoute.Sitemap = categories
      .filter((category) => Number(category.custom__is_website_item) !== 1)
      .filter((category) => !category.is_group)
      .map((category) => {
        const slug = category.name.toLowerCase().replace(/\s+/g, "-");
        return {
          url: `${SITE_URL}/category/${slug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        };
      });

    return [...staticEntries, ...productEntries, ...categoryEntries];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap entries:", error);
    return staticEntries;
  }
}
