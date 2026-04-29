import type { Metadata } from "next";
import Layout from "@/components/Layout";
import EnhancedShopContent from "@/modules/ShopContent/EnhancedShopContent";
import { getAllCategories } from "@/hooks/getCategories";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Parts & Accessories | CNC KRAL",
  description: "Browse all spare parts and accessories for your machines.",
};

export default async function PartsPage() {
  const storeId = "default-store";
  const companyId = "CNC KRAL";
  const storeCurrency = "PKR";
  const categoriesRes = await getAllCategories(storeId);
  const { categories } = categoriesRes;

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
            mode="parts"
          />
        </div>
      </div>
    </Layout>
  );
}

