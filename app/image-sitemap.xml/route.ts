import { NextResponse } from "next/server";
import { productService } from "@/lib/erpnext/services/productService";
import { getErpnextImageUrl } from "@/lib/erpnextImageUtils";

const SITE_URL = "https://cnckral.com";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const products = await productService.getProducts({ disabled: 0 }, 5000, 0);

    const urls = products
      .map((product) => {
        const imagePath = product.website_image || product.image;
        if (!imagePath) return null;

        const itemCode = product.item_code || product.name;
        if (!itemCode) return null;

        const productUrl = `${SITE_URL}/product/${encodeURIComponent(itemCode)}`;
        const imageUrl = getErpnextImageUrl(imagePath);
        const title = product.item_name || itemCode;

        return `
  <url>
    <loc>${escapeXml(productUrl)}</loc>
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
      <image:caption>${escapeXml(title)}</image:caption>
    </image:image>
  </url>`;
      })
      .filter(Boolean)
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Failed to generate image sitemap:", error);
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"></urlset>`;
    return new NextResponse(fallbackXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
      status: 200,
    });
  }
}
