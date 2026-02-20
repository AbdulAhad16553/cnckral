import type { Metadata } from "next";
import Layout from "@/components/Layout";
import EnhancedShopContent from "@/modules/ShopContent/EnhancedShopContent";
import { headers } from "next/headers";
import { getUrlWithScheme } from "@/lib/getUrlWithScheme";
import { getAllCategories } from "@/hooks/getCategories";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Machines | Krallaser",
  description: "Browse all machines that can be requested as a quote.",
};

export default async function MachinePage() {
  const Headers = await headers();
  const host = Headers.get("host");
  if (!host) {
    throw new Error("Host header is missing or invalid");
  }

  const fullStoreUrl = getUrlWithScheme(host);

  const response = await fetch(`${fullStoreUrl}/api/fetchStore`, { cache: "no-store" });
  const data = await response.json();

  const storeId = data?.store?.stores[0].id;
  const companyId = data?.store?.stores[0].company_id;
  const storeCurrency = data?.store?.stores[0].store_detail?.currency
    ? data?.store?.stores[0].store_detail?.currency
    : "Rs.";

  const { categories } = await getAllCategories(storeId);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50">
        <div className="page-container py-8 lg:py-10">
          <EnhancedShopContent
            categories={categories}
            hideOnPage={true}
            storeCurrency={storeCurrency}
            necessary={{
              storeId,
              companyId,
            }}
            mode="machine"
          />
        </div>
      </div>
    </Layout>
  );
}

