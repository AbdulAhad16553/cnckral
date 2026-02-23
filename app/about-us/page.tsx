import type { Metadata } from "next";
import Hero from "@/modules/Hero";
import Layout from "@/components/Layout";
import AboutUsContent from "@/components/AboutUsContent";
import { getUrlWithScheme } from "@/lib/getUrlWithScheme";
import { headers } from "next/headers";
import { getAllCategories } from "@/hooks/getCategories";
import { getProducts } from "@/hooks/getProducts";

export const metadata: Metadata = {
  title: "About CNC KRAL | CNC Machinery & Precision Tooling Distributor",
  description:
    "CNC KRAL is a prominent industrial machinery and hardware distributor in Lahore, Pakistan, specializing in CNC solutions, wood routers, laser cutters, plasma cutters, and precision cutting tools.",
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
      <div className="container mx-auto px-4 py-8 bg-brand-tint/30 min-h-screen">
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
