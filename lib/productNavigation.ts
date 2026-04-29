"use client";

export const getProductSlug = (product: any): string =>
  encodeURIComponent(product?.sku || product?.id || product?.name || "");

const previewKey = (slug: string) => `product-preview:${slug}`;

export const buildProductPreview = (product: any) => {
  const itemCode = product?.sku || product?.id || product?.name;
  return {
    name: itemCode,
    item_name: product?.name || itemCode,
    item_group: product?.item_group || "",
    stock_uom: product?.stock_uom || "Nos",
    description: product?.detailed_desc || product?.short_description || "",
    price: Number(product?.sale_price ?? product?.base_price ?? 0),
    currency: product?.currency || "PKR",
    image: product?.product_images?.[0]?.image_id || undefined,
    custom_quotation_item: product?.custom_quotation_item,
    stock: product?.stock || null,
    tags: Array.isArray(product?.tags) ? product.tags : [],
    variants: Array.isArray(product?.product_variations)
      ? product.product_variations.map((v: any) => ({
          name: v?.sku || v?.id || v?.name,
          item_name: v?.name || v?.item_name || v?.sku || "",
          price: Number(v?.sale_price ?? v?.base_price ?? 0),
          currency: product?.currency || "PKR",
          image: v?.image || undefined,
          stock: v?.stock || null,
          attributes: Array.isArray(v?.attributes) ? v.attributes : [],
        }))
      : [],
  };
};

export const saveProductPreview = (slug: string, product: any) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(previewKey(slug), JSON.stringify(buildProductPreview(product)));
  } catch {}
};

export const getSavedProductPreview = (slug: string) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(previewKey(slug));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const warmProductNavigation = (router: any, product: any) => {
  const slug = getProductSlug(product);
  if (!slug) return;
  saveProductPreview(slug, product);
  try {
    router?.prefetch?.(`/product/${slug}`);
  } catch {}
  fetch(`/api/product/${slug}`, { cache: "force-cache" }).catch(() => undefined);
};

