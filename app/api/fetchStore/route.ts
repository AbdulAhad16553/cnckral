import { NextResponse, NextRequest } from "next/server";
import { GET as getProductsCatalog } from "../products/route";

// Minimal store shape to keep existing pages working while using ERPNext
const getFallbackStorePayload = () => {
  return {
    store: {
      stores: [
        {
          id: "default-store",
          store_name: "CNC KRAL",
          company_id: "CNC KRAL",
          store_detail: {
            currency: "PKR",
          },
          store_contact_detail: {
            phone: "",
          },
          store_components: [],
        },
      ],
    },
  };
};

const CACHE_TTL_MS = 10 * 60 * 1000;
let cachedLight: { expiresAt: number; payload: any } | null = null;
let cachedCatalog: { expiresAt: number; payload: any } | null = null;
let inFlightCatalog: Promise<any> | null = null;

async function buildCatalogPayload(req: NextRequest) {
  if (!inFlightCatalog) {
    inFlightCatalog = (async () => {
      const url = req.nextUrl.clone();
      url.pathname = "/api/products";
      url.search = "";
      url.searchParams.set("page", "1");
      url.searchParams.set("limit", "5000");
      url.searchParams.set("mode", "all");
      const inner = new NextRequest(url, { headers: req.headers });
      const catalogRes = await getProductsCatalog(inner);
      const catalogJson = await catalogRes.json();
      const products = Array.isArray(catalogJson?.products) ? catalogJson.products : [];

      const templatesWithVariants = products
        .filter((p: any) => {
          if (!p) return false;
          if (p.type === "variable") return true;
          if (p.type !== "simple") return false;
          const parentOfVariant =
            p.variant_of || p.parent_template || p.template || p._template?.variant_of;
          return !parentOfVariant;
        })
        .map((p: any) => ({
          ...p,
          product_variations: Array.isArray(p.product_variations) ? p.product_variations : [],
        }));

      return {
        success: true,
        total_templates: templatesWithVariants.length,
        total_items: templatesWithVariants.length,
        templates: templatesWithVariants,
        ...getFallbackStorePayload(),
      };
    })().finally(() => {
      inFlightCatalog = null;
    });
  }

  return inFlightCatalog;
}

/**
 * GET /api/fetchStore
 * - Default: lightweight store metadata only (fast TTFB for page shells)
 * - ?includeTemplates=1: full product template catalog (used by getStoreProducts)
 */
export async function GET(req: NextRequest) {
  try {
    const includeTemplates =
      req.nextUrl.searchParams.get("includeTemplates") === "1" ||
      req.nextUrl.searchParams.get("catalog") === "1";

    const now = Date.now();
    const cacheHeaders = {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
    };

    if (!includeTemplates) {
      if (cachedLight && cachedLight.expiresAt > now) {
        return NextResponse.json(cachedLight.payload, { headers: cacheHeaders });
      }

      const payload = {
        success: true,
        total_templates: 0,
        total_items: 0,
        templates: [],
        ...getFallbackStorePayload(),
      };
      cachedLight = { expiresAt: now + CACHE_TTL_MS, payload };
      return NextResponse.json(payload, { headers: cacheHeaders });
    }

    if (cachedCatalog && cachedCatalog.expiresAt > now) {
      return NextResponse.json(cachedCatalog.payload, { headers: cacheHeaders });
    }

    const payload = await buildCatalogPayload(req);
    cachedCatalog = { expiresAt: now + CACHE_TTL_MS, payload };

    return NextResponse.json(payload, { headers: cacheHeaders });
  } catch (error: any) {
    inFlightCatalog = null;
    console.error(
      "❌ Error fetching products with images:",
      error.response?.data || error.message
    );

    return NextResponse.json({
      success: false,
      error: "Failed to fetch template items with images",
      templates: [],
      total_templates: 0,
      ...getFallbackStorePayload(),
    });
  }
}
