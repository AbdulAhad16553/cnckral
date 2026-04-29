import type { Metadata } from "next";
import Layout from "@/components/Layout";
import EnhancedShopContent from "@/modules/ShopContent/EnhancedShopContent";
import { getAllCategories } from "@/hooks/getCategories";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Shop CNC Products | CNC KRAL",
  description: "Browse CNC machines, routers, bits, and spare parts from CNC KRAL in Pakistan.",
  robots: {
    index: true,
    follow: true,
    noimageindex: true,
  },
};

export default async function ShopPage() {
  const storeId = "default-store";
  const companyId = "CNC KRAL";
  const storeCurrency = "PKR";

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
        />
        </div>
      </div>
    </Layout>
  );
}
