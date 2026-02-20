import { erpnextClient } from '@/lib/erpnext/erpnextClient';

export async function fetchProductBySlug(slug: string) {
  const itemCode = decodeURIComponent(slug);

  const [response, attachRes] = await Promise.all([
    erpnextClient.getFullProductDetails(itemCode),
    erpnextClient.getItemAttachments(itemCode).catch(() => ({ data: [] })),
  ]);

  if (!response.data) return null;

  const product = response.data;
  product.attachments = attachRes?.data ?? [];

  const isMachine =
    product.custom_quotation_item === 1 || product.custom_custom_quotation_item === 1;

  if (!isMachine) {
    try {
      const { data: stockData } = await erpnextClient.getItemStock(itemCode);
      if (stockData?.length) {
        product.stock = {
          totalStock: stockData.reduce((t: number, b: any) => t + (b.actual_qty || 0), 0),
          bins: stockData,
        };
      }
    } catch {
      /* no stock */
    }

    if (product.variants?.length) {
      product.variants = await Promise.all(
        product.variants.map(async (variant: any) => {
          try {
            const { data: d } = await erpnextClient.getItemStock(variant.name);
            const total = d?.reduce((t: number, b: any) => t + (b.actual_qty || 0), 0) ?? 0;
            return {
              ...variant,
              stock: d?.length ? { totalStock: total, bins: d } : null,
            };
          } catch {
            return { ...variant, stock: null };
          }
        })
      );
    }
  }

  return product;
}
