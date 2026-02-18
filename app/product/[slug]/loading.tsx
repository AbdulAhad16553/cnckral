import { ProductSkeleton } from "@/components/ui/product-skeleton";

export default function ProductSlugLoading() {
  return (
    <main className="min-h-screen bg-slate-50/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <ProductSkeleton />
      </div>
    </main>
  );
}
