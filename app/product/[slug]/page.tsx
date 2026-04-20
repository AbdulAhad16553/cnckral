import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from "next";
import ProductDetailContent from './ProductDetailContent';
import { ProductSkeleton } from '@/components/ui/product-skeleton';
import { fetchProductBySlug } from '@/lib/product/fetchProductBySlug';
import Layout from '@/components/Layout';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://cnckral.com";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
      alternates: { canonical: `/product/${encodeURIComponent(decodedSlug)}` },
    };
  }

  const productName = product.item_name || product.name || decodedSlug;
  const productTags: string[] = Array.isArray((product as any).tags) ? (product as any).tags : [];
  const productDescription =
    product.description?.trim() ||
    `${productName} from CNC KRAL. Contact us for specifications, pricing, and availability in Pakistan.`;
  const canonicalPath = `/product/${encodeURIComponent(decodedSlug)}`;
  const imageUrl = product.image
    ? (product.image.startsWith("http") ? product.image : `${SITE_URL}${product.image}`)
    : `${SITE_URL}/cnc_kral.png`;

  return {
    title: productName,
    description: productDescription,
    keywords: [
      productName,
      product.item_group,
      ...productTags,
      "CNC KRAL",
      "CNC Pakistan",
      "Lahore",
    ].filter(Boolean),
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      title: productName,
      description: productDescription,
      url: `${SITE_URL}${canonicalPath}`,
      images: [{ url: imageUrl, alt: productName }],
    },
    twitter: {
      card: "summary_large_image",
      title: productName,
      description: productDescription,
      images: [imageUrl],
    },
  };
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