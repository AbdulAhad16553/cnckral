import { cache } from "react";
import { erpnextClient } from '@/lib/erpnext/erpnextClient';
import { attachProductStockFromErp } from '@/lib/product/attachProductStock';
import { productCache } from '@/lib/cache';
import { parseErpTags } from '@/lib/erpnext/tags';

async function fetchProductBySlugUncached(slug: string) {
  const itemCode = decodeURIComponent(slug);
  const cacheKey = `product-detail:${itemCode}`;
  const cached = productCache.get(cacheKey);
  if (cached) return cached;

  const [response, attachRes] = await Promise.all([
    erpnextClient.getFullProductDetails(itemCode),
    erpnextClient.getItemAttachments(itemCode).catch(() => ({ data: [] })),
  ]);

  if (!response.data) return null;

  const product = response.data;
  product.attachments = attachRes?.data ?? [];
  product.tags = parseErpTags((product as any)._user_tags);

  await attachProductStockFromErp(product, itemCode);
  // Keep a short hot-cache for repeated PDP navigations.
  productCache.set(cacheKey, product, 2 * 60 * 1000);

  return product;
}

/** Dedupes ERP work when generateMetadata and the page both request the same slug in one render. */
export const fetchProductBySlug = cache(fetchProductBySlugUncached);
