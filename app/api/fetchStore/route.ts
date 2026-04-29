import { NextResponse, NextRequest } from "next/server";
import { erpnextClient } from "@/lib/erpnext/erpnextClient";

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

// ---- Fetch Template Items using ERPNext client (safe JSON filters) ----
async function getTemplateItems(limit = 100) {
  let templates: any[] = [];
  let start = 0;

  while (true) {
    const { data } = await erpnextClient.getList<any>(
      "Item",
      { has_variants: 1 },
      ["name", "item_name", "item_group", "stock_uom", "image"],
      limit,
      start
    );

    const page = data || [];
    if (page.length === 0) break;

    templates = templates.concat(page);
    start += limit;
  }

  return templates;
}

// ---- Fetch Variant Items for a Template using ERPNext client ----
async function getVariantsForTemplate(templateName: string) {
  const { data } = await erpnextClient.getList<any>(
    "Item",
    { variant_of: templateName },
    ["name", "item_name", "variant_of", "attributes", "image"],
    200,
    0
  );
  return data || [];
}

// ---- API Route ----
export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Get all template items
    const templates = await getTemplateItems();

    // 2️⃣ Get variants (with images)
    const templatesWithVariants = await Promise.all(
      templates.map(async (template) => {
        const variants = await getVariantsForTemplate(template.name);
        return {
          ...template,
          variants,
        };
      })
    );

    return NextResponse.json({
      success: true,
      total_templates: templatesWithVariants.length,
      templates: templatesWithVariants,
      ...getFallbackStorePayload(),
    });
  } catch (error: any) {
    console.error(
      "❌ Error fetching products with images:",
      error.response?.data || error.message
    );

    // Even on failure, keep the legacy store shape so pages don't break
    return NextResponse.json({
      success: false,
      error: "Failed to fetch template items with images",
      templates: [],
      total_templates: 0,
      ...getFallbackStorePayload(),
    });
  }
}
