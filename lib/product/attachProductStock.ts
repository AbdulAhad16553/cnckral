import { erpnextClient } from "@/lib/erpnext/erpnextClient";
import { aggregateBinsForItem } from "@/lib/product/binStock";

/**
 * Fills `product.stock` and each `variant.stock` using one batched Bin query (vs 1+N round-trips).
 */
export async function attachProductStockFromErp(product: any, itemCode: string): Promise<void> {
  const isMachine =
    product.custom_quotation_item === 1 || product.custom_custom_quotation_item === 1;
  if (isMachine) return;

  const variantCodes =
    product.variants?.length > 0
      ? (product.variants as any[]).map((v) => v.name).filter(Boolean)
      : [];
  const allCodes = [...new Set([itemCode, ...variantCodes])];
  if (allCodes.length === 0) return;

  try {
    const { data: binRows } = await erpnextClient.getItemStockBatch(allCodes);
    const rows = binRows ?? [];

    const mainStock = aggregateBinsForItem(rows, itemCode);
    if (mainStock) product.stock = mainStock;

    if (product.variants?.length) {
      product.variants = (product.variants as any[]).map((variant: any) => ({
        ...variant,
        stock: aggregateBinsForItem(rows, variant.name),
      }));
    }
  } catch {
    /* no stock */
  }
}
