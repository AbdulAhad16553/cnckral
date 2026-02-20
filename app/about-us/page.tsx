import type { Metadata } from "next";
import Hero from "@/modules/Hero";
import Layout from "@/components/Layout";
import AboutUsContent from "@/components/AboutUsContent";
import { getUrlWithScheme } from "@/lib/getUrlWithScheme";
import { headers } from "next/headers";
import { getAllCategories } from "@/hooks/getCategories";
import { getProducts } from "@/hooks/getProducts";

export const metadata: Metadata = {
  title: "About Kral Laser | Industrial Fiber Laser Cutting Machines",
  description:
    "Kral Laser provides advanced fiber laser cutting, marking, and industrial machinery in Pakistan. Based in Lahore. High-precision machines for 24/7 metal fabrication.",
};

export default async function AboutUsPage() {
  const Headers = await headers();
  const host = Headers.get("host");

  if (!host) {
    throw new Error("Host header is missing or invalid");
  }

  const fullStoreUrl = getUrlWithScheme(host);
  const response = await fetch(`${fullStoreUrl}/api/fetchStore`);
  const data = await response.json();
  const storeId = data?.store?.stores[0].id;

  const { categories } = await getAllCategories(storeId);
  const { products } = await getProducts(storeId);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Hero
          hideOnPage={true}
          content={{
            title: "About Us",
            heroImage: undefined,
          }}
          storeData={data?.store?.stores[0]}
          categories={categories}
          products={products}
        />
        <AboutUsContent />
      </div>
    </Layout>
  );
}
