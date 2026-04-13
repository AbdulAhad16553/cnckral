import { NextRequest } from "next/server";
import { GET as getProductsCatalog } from "../products/route";

/**
 * List all catalog items with `sale_price`, `base_price`, and `stock` (same payload as `/api/products`).
 * No slug — use `/api/product/[slug]` for a single item.
 *
 * Defaults: `page=1`, `limit=5000`, `mode=all` when omitted (override with query params).
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  const sp = url.searchParams;
  if (!sp.has("page")) sp.set("page", "1");
  if (!sp.has("limit")) sp.set("limit", "5000");
  if (!sp.has("mode")) sp.set("mode", "all");

  const inner = new NextRequest(url, {
    headers: request.headers,
  });
  return getProductsCatalog(inner);
}
