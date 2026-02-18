import { Suspense } from 'react';
import ProductDetailContent from './ProductDetailContent';
import { ProductSkeleton } from '@/components/ui/product-skeleton';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  return (
    <main className="min-h-screen bg-slate-50/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Suspense fallback={<ProductSkeleton />}>
          <ProductDetailContent slug={slug} />
        </Suspense>
      </div>
    </main>
  );
}