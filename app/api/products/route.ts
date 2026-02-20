import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/lib/erpnext/services/productService';
import { erpnextClient } from '@/lib/erpnext/erpnextClient';
import { productCache } from '@/lib/cache';
import { trackPaginationPerformance, trackPaginationCacheHit, trackPaginationCacheMiss } from '@/lib/paginationPerformance';
import { getErpnextImageUrl } from '@/lib/erpnextImageUtils';

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const mode = searchParams.get('mode') || 'all'; // machine | parts | all
    const offset = (page - 1) * limit;

    const quoteFilter = mode === 'machine' ? 1 : mode === 'parts' ? 0 : undefined;
    
    const cacheKey = `products-page-${page}-limit-${limit}-mode-${mode}`;
    const cachedProducts = productCache.get(cacheKey);
    
    if (cachedProducts) {
      const loadTime = Date.now() - startTime;
      trackPaginationPerformance(loadTime, true);
      trackPaginationCacheHit();
      return NextResponse.json({ 
        products: cachedProducts.products,
        pagination: cachedProducts.pagination,
        cached: true,
        loadTime
      });
    }

    const filters: { disabled: 0 | 1; custom_quotation_item?: 0 | 1 } = { disabled: 0 };
    if (quoteFilter !== undefined) filters.custom_quotation_item = quoteFilter as 0 | 1;
    
    const products = await productService.getProducts(filters, limit, offset);
    
    const productCodes = products.map(p => p.name);
    const variantCodes = products.flatMap(p => 
      p.has_variants && (p as any).variants 
        ? (p as any).variants.map((v: any) => v.name)
        : []
    );
    const allItemCodes = [...new Set([...productCodes, ...variantCodes])];

    // 1 API call for ALL prices (instead of N)
    const { data: pricesData } = await erpnextClient.getItemPricesBatch(allItemCodes);
    const priceMap = new Map<string, { price_list_rate: number; currency: string }>();
    (pricesData || []).forEach((p: any) => {
      const code = p.item_code ?? p.name;
      if (code && !priceMap.has(code))
        priceMap.set(code, { price_list_rate: p.price_list_rate ?? 0, currency: p.currency || 'PKR' });
    });

    let stockMap = new Map<string, { totalStock: number; bins: any[] } | null>();
    if (allItemCodes.length > 0) {
      try {
        const { data: binsData } = await erpnextClient.getItemStockBatch(allItemCodes);
        const binsByItem = new Map<string, any[]>();
        (binsData || []).forEach((b: any) => {
          const code = b.item_code ?? b.name;
          if (code) {
            if (!binsByItem.has(code)) binsByItem.set(code, []);
            binsByItem.get(code)!.push(b);
          }
        });
        allItemCodes.forEach(code => {
          const bins = binsByItem.get(code);
          stockMap.set(code, bins?.length
            ? { totalStock: bins.reduce((t: number, x: any) => t + (x.actual_qty || 0), 0), bins }
            : null);
        });
      } catch {
        allItemCodes.forEach(code => stockMap.set(code, null));
      }
    }

    // Transform ERPNext products to match frontend interface
    const transformedProducts = products.map((product, index) => {
      // Use ERPNext custom field "custom_quotation_item" as the source
      const rawEnableQuote =
        (product as any).custom_quotation_item ??
        (product as any).custom_custom_quotation_item ??
        0;
      const enableQuoteRequest =
        rawEnableQuote === true ||
        rawEnableQuote === "1" ||
        rawEnableQuote === 1 ||
        rawEnableQuote === "Yes";
      // Get price from lookup map (O(1) access)
      const priceData = priceMap.get(product.name) || { price_list_rate: product.standard_rate || 0, currency: 'PKR' };
      const itemPrice = Number(priceData.price_list_rate) || 0;
      const currency = priceData.currency || 'PKR';

      // Get stock information from lookup map (O(1) access)
      const stockInfo = stockMap.get(product.name) || null;
      
      // Handle variations (using lookup maps for O(1) access)
      let variations = [];
      if (product.has_variants && (product as any).variants) {
        variations = (product as any).variants.map((variant: any) => {
          // Get variant price from lookup map
          const variantPriceData = priceMap.get(variant.name) || { price_list_rate: variant.price || variant.standard_rate || 0, currency: 'PKR' };
          const variantPrice = Number(variantPriceData.price_list_rate) || 0;

          // Get variant stock from lookup map
          const variantStockInfo = stockMap.get(variant.name) || null;
          
          return {
            id: variant.name,
            sale_price: variantPrice,
            base_price: variantPrice,
            sku: variant.name,
            name: variant.item_name,
            image: variant.image,
            stock: variantStockInfo
          };
        });
      }
      
      // For variable products, calculate price range from variations
      let displayPrice = itemPrice;
      let priceRange = null;
      
      if (product.has_variants && variations.length > 0) {
        // Calculate price range from variations
        const variationPrices = variations
          .map((v: any) => v.sale_price || v.base_price || 0)
          .filter((price: number) => price > 0);
          
        if (variationPrices.length > 0) {
          const minPrice = Math.min(...variationPrices);
          const maxPrice = Math.max(...variationPrices);
          priceRange = { min: minPrice, max: maxPrice };
          displayPrice = minPrice; // Use minimum price as the main display price
        }

        // Fallback: if no price range yet but a variation has price, use it
        if (!priceRange) {
          const pricedVariation = variations.find(
            (v: any) => Number(v.sale_price || v.base_price || 0) > 0
          );
          if (pricedVariation) {
            const fallbackPrice = Number(pricedVariation.sale_price || pricedVariation.base_price || 0);
            displayPrice = fallbackPrice;
            priceRange = { min: fallbackPrice, max: fallbackPrice };
          }
        }
      }

      const imagePath = product.website_image || product.image;
      return {
        id: product.name,
        name: product.item_name,
        short_description: product.description,
        detailed_desc: product.description,
        item_group: product.item_group,
        type: product.has_variants ? 'variable' : 'simple',
        currency: currency,
        base_price: displayPrice,
        status: product.disabled ? 'inactive' : 'active',
        sale_price: displayPrice,
        sku: product.item_code || product.name || `item-${index}`,
        slug: (product.item_code || product.name || `item-${index}`).toLowerCase().replace(/\s+/g, '-'),
        custom_quotation_item: rawEnableQuote,
        enable_quote_request: enableQuoteRequest,
        product_images: imagePath ? [{
          id: `img-${index}`,
          image_id: imagePath,
          position: 1
        }] : [],
        image_url: imagePath ? getErpnextImageUrl(imagePath) : undefined,
        product_variations: variations,
        stock: stockInfo,
        ...(priceRange && { price_range: priceRange })
      };
    });

    const totalCountCacheKey = `products-total-count-${mode}`;
    let totalProducts = productCache.get(totalCountCacheKey);
    if (!totalProducts) {
      const allFiltered = await productService.getProducts(filters, 5000, 0);
      totalProducts = allFiltered;
      productCache.set(totalCountCacheKey, totalProducts, 30 * 60 * 1000);
    }
    const totalPages = Math.ceil(totalProducts.length / limit);
    
    // Create pagination info
    const pagination = {
      currentPage: page,
      totalPages,
      totalProducts: totalProducts.length,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit,
      offset
    };

    // Cache the transformed products with pagination
    const cacheData = {
      products: transformedProducts,
      pagination
    };
    productCache.set(cacheKey, cacheData, 30 * 60 * 1000); // 30 minutes

    const loadTime = Date.now() - startTime;
    console.log(`✅ Products page ${page} loaded in ${loadTime}ms (${transformedProducts.length} items)`);
    
    // Track performance metrics
    trackPaginationPerformance(loadTime, false);
    trackPaginationCacheMiss();
    
    // Debug: Check for duplicate products in API response
    const productIds = transformedProducts.map(p => p.id || p.sku || p.name);
    const uniqueIds = new Set(productIds);
    if (productIds.length !== uniqueIds.size) {
      console.log(`⚠️ Duplicate products detected in API response:`);
      console.log(`📊 Total products: ${transformedProducts.length}`);
      console.log(`🔍 Unique products: ${uniqueIds.size}`);
      
      // Find and log duplicates
      const duplicates = productIds.filter((id, index) => productIds.indexOf(id) !== index);
      console.log(`🔍 Duplicate IDs:`, [...new Set(duplicates)]);
    }
    
    // Debug: Log products with variations to check pricing
    const productsWithVariations = transformedProducts.filter(p => p.type === 'variable' && p.product_variations?.length > 0);
    if (productsWithVariations.length > 0) {
      console.log(`🔍 Found ${productsWithVariations.length} products with variations:`);
      productsWithVariations.slice(0, 3).forEach(product => {
        console.log(`  - ${product.name}: ${product.product_variations.length} variations, base_price: ${product.base_price}, price_range:`, product.price_range);
        product.product_variations.slice(0, 2).forEach((variation: any) => {
          console.log(`    * ${variation.name}: base_price: ${variation.base_price}, sale_price: ${variation.sale_price}`);
        });
      });
    }

    return NextResponse.json({ 
      products: transformedProducts,
      pagination,
      cached: false,
      loadTime,
      performance: {
        totalProducts: transformedProducts.length,
        batchOperations: allItemCodes.length,
        cacheHit: false
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
