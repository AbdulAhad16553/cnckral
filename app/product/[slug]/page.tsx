import { Suspense } from 'react';
import ProductDetailContent from './ProductDetailContent';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="py-16 text-center text-slate-500">Loading…</div>}>
          <ProductDetailContent slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}