import { erpnextClient } from '../erpnextClient';
import { productCache } from '@/lib/cache';

export interface ERPNextProduct {
  name: string;
  item_name: string;
  item_code: string;
  item_group: string;
  description?: string;
  stock_uom: string;
  standard_rate: number;
  image?: string;
  website_image?: string;
  has_variants: 0 | 1;
  variant_of?: string;
  disabled: 0 | 1;
  is_sales_item: 0 | 1;
  is_purchase_item: 0 | 1;
  is_stock_item: 0 | 1;
  custom_is_website_item?: 0 | 1;
  country_of_origin?: string;
  weight_per_unit?: number;
  shelf_life_in_days?: number;
  end_of_life?: string;
  min_order_qty?: number;
  safety_stock?: number;
  lead_time_days?: number;
  max_discount?: number;
  attributes?: Array<{
    attribute: string;
    numeric_values: 0 | 1;
    disabled: 0 | 1;
  }>;
}

export interface ERPNextItemGroup {
  name: string;
  item_group_name: string;
  parent_item_group?: string;
  is_group: 0 | 1;
  image?: string;
  custom__is_website_item?: 0 | 1;
}

export interface ERPNextStockBalance {
  item_code: string;
  warehouse: string;
  actual_qty: number;
  reserved_qty: number;
  projected_qty: number;
}

export interface ERPNextWarehouse {
  name: string;
  warehouse_name: string;
  warehouse_type: string;
  parent_warehouse?: string;
  company: string;
}

export class ProductService {
  // Get all products with optional filters
  async getProducts(filters?: {
    item_name?: string;
    item_code?: string;
    item_group?: string;
    disabled?: 0 | 1;
    custom_quotation_item?: 0 | 1; // 1 = machines only, 0 = parts only
  }, limit?: number, offset?: number): Promise<ERPNextProduct[]> {
    try {
      const cacheKey = 'erpnext-detailed-products';

      // Try to reuse previously fetched detailed products from in-memory cache
      let allItems: any[] | null = productCache.get(cacheKey);

      if (!allItems) {
        // Get all items (both templates and single items) using getDetailedProducts
        const response = await erpnextClient.getDetailedProducts();
        allItems = (response.data || []).filter(
          (item: any) => Number(item.custom_is_website_item) !== 1
        );

        // Cache the full detailed product list for faster subsequent requests
        // 30 minutes TTL to balance freshness vs. performance
        productCache.set(cacheKey, allItems, 30 * 60 * 1000);
      }

      console.log('🔍 ProductService - All items from getDetailedProducts (after cache):', allItems.length, 'items');
      
      // Filter to show ONLY template products (has_variants = 1) and single products (has_variants = 0 AND variant_of is null/empty)
      // This excludes individual variations of template products
      let filteredItems = allItems.filter(item => {
        // Show template products (has_variants = 1)
        if (item.has_variants === 1) {
          return true;
        }
        // Show single products (has_variants = 0 AND no variant_of)
        if (item.has_variants === 0 && (!item.variant_of || item.variant_of === '')) {
          return true;
        }
        // Hide individual variations (has_variants = 0 AND has variant_of)
        return false;
      });
      
      console.log('🔍 ProductService - After filtering template/single products:', filteredItems.length, 'items');
      
      // Apply additional filters if provided
      if (filters) {
        filteredItems = filteredItems.filter(item => {
          if (filters.disabled !== undefined && item.disabled !== filters.disabled) {
            return false;
          }
          if (filters.custom_quotation_item !== undefined) {
            const q = item.custom_quotation_item ?? item.custom_custom_quotation_item ?? 0;
            const isMachine = q === 1 || q === "1" || q === true || q === "Yes";
            if (filters.custom_quotation_item === 1 && !isMachine) return false;
            if (filters.custom_quotation_item === 0 && isMachine) return false;
          }
          if (filters.item_group && item.item_group !== filters.item_group) {
            return false;
          }
          if (filters.item_name && !item.item_name?.toLowerCase().includes(filters.item_name.toLowerCase())) {
            return false;
          }
          if (filters.item_code && item.item_code !== filters.item_code) {
            return false;
          }
          return true;
        });
      }
      
      // Apply limit and offset
      const startIndex = offset || 0;
      const endIndex = limit ? startIndex + limit : filteredItems.length;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);
      
      console.log('🔍 ProductService - Final filtered and paginated products:', paginatedItems.length);
      console.log('🔍 ProductService - Sample items:', paginatedItems.slice(0, 3).map(item => ({
        name: item.item_name,
        isTemplate: item.has_variants,
        variants: item.variants?.length || 0
      })));
      
      return paginatedItems;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get a single product by item code
  async getProduct(itemCode: string): Promise<ERPNextProduct> {
    try {
      const response = await erpnextClient.getProduct(itemCode);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Get product categories (Item Groups)
  async getCategories(): Promise<ERPNextItemGroup[]> {
    try {
      const response = await erpnextClient.getItemGroups();
      const categories = response.data || [];
      console.log('🔍 ProductService - Categories fetched:', categories.length, 'categories');
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get stock balance for products
  async getStockBalance(filters?: {
    item_code?: string;
    warehouse?: string;
  }): Promise<ERPNextStockBalance[]> {
    try {
      const response = await erpnextClient.getStockBalance(filters);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching stock balance:', error);
      throw error;
    }
  }

  // Get warehouses
  async getWarehouses(): Promise<ERPNextWarehouse[]> {
    try {
      const response = await erpnextClient.getWarehouses();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      throw error;
    }
  }

  // Search products by keyword
  async searchProducts(keyword: string, limit: number = 8): Promise<ERPNextProduct[]> {
    try {
      const filters = {
        item_name: `%${keyword}%`,
        disabled: 0 as 0 | 1
      };
      return await this.getProducts(filters, limit);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(categoryName: string, limit?: number): Promise<ERPNextProduct[]> {
    try {
      const filters = {
        item_group: categoryName,
        disabled: 0 as 0 | 1
      };
      return await this.getProducts(filters, limit);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  // Get featured products (you can customize this based on your ERPNext setup)
  async getFeaturedProducts(limit: number = 8): Promise<ERPNextProduct[]> {
    try {
      const filters = {
        disabled: 0 as 0 | 1
      };
      return await this.getProducts(filters, limit);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  /**
   * Get product catalog context for AI chat. Returns products matching keywords in item_name or description.
   * Used to give the AI accurate product info when answering questions about parts/machines.
   */
  async getProductsForChatContext(userMessage: string, maxProducts = 25): Promise<string> {
    try {
      const products = await this.getProducts({ disabled: 0 }, 500, 0);
      if (!products || products.length === 0) return "";

      const keywords = userMessage
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 2 && !/^(what|how|which|the|a|an|is|are|do|does|can|have|has|about|for|with|your|this|that|you)$/.test(w));

      const stripHtml = (html: string | undefined): string => {
        if (!html || typeof html !== "string") return "";
        return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      };

      let matched = products;
      if (keywords.length > 0) {
        matched = products.filter((p) => {
          const name = (p.item_name || "").toLowerCase();
          const desc = stripHtml(p.description || "").toLowerCase();
          const code = (p.item_code || p.name || "").toLowerCase();
          const group = (p.item_group || "").toLowerCase();
          const text = `${name} ${desc} ${code} ${group}`;
          return keywords.some((k) => text.includes(k));
        });
      }

      const toInclude = matched.length > 0 ? matched.slice(0, maxProducts) : products.slice(0, Math.min(15, products.length));

      return toInclude
        .map((p) => {
          const isMachine = p.custom_quotation_item === 1 || (p as any).custom_custom_quotation_item === 1;
          const type = isMachine ? "Machine" : "Part";
          const desc = stripHtml(p.description || "").slice(0, 600);
          return `[${type}] ${p.item_name || p.name} (Item: ${p.item_code || p.name}, Category: ${p.item_group || "N/A"})${desc ? `\nDescription: ${desc}` : ""}`;
        })
        .join("\n\n");
    } catch (error) {
      console.error("Error building chat product context:", error);
      return "";
    }
  }
}

// Export singleton instance
export const productService = new ProductService();
export default productService;
