import { erpnextClient } from '@/lib/erpnext/erpnextClient';
import { attachProductStockFromErp } from '@/lib/product/attachProductStock';

export async function fetchProductBySlug(slug: string) {
  const itemCode = decodeURIComponent(slug);

  const [response, attachRes] = await Promise.all([
    erpnextClient.getFullProductDetails(itemCode),
    erpnextClient.getItemAttachments(itemCode).catch(() => ({ data: [] })),
  ]);

  if (!response.data) return null;

  const product = response.data;
  product.attachments = attachRes?.data ?? [];

  await attachProductStockFromErp(product, itemCode);

  return product;
}
