import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ProductDetailContent from './ProductDetailContent';
import { ProductSkeleton } from '@/components/ui/product-skeleton';
import { fetchProductBySlug } from '@/lib/product/fetchProductBySlug';
import Layout from '@/components/Layout';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <Suspense fallback={<ProductSkeleton />}>
            <ProductDetailContentWithData slug={slug} />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}

async function ProductDetailContentWithData({ slug }: { slug: string }) {
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetailContent slug={slug} initialProduct={product} />;
}