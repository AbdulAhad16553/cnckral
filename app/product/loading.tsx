import { ProductSkeleton } from "@/components/ui/product-skeleton";
import Layout from "@/components/Layout";

export default function ProductLoading() {
  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        <ProductSkeleton />
      </div>
    </Layout>
  );
}
