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
        <Suspense fallback={<ProductSkeleton />}>
          <ProductDetailContentWithData slug={slug} />
        </Suspense>
      </div>
    </Layout>
  );
}

async function ProductDetailContentWithData({ slug }: { slug: string }) {
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetailContent slug={slug} initialProduct={product} />;
}