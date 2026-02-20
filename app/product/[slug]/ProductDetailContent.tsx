
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ArrowLeft, Package, DollarSign, Tag, Info, X, ZoomIn, ShoppingCart, Plus, Minus, ChevronLeft, ChevronRight, FileImage, CheckCircle, Quote, MessageCircle, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import AttributeFilter from '@/common/AttributeFilter';
import { AddToCart } from '@/sub/cart/addToCart';
import { getErpnextImageUrl } from '@/lib/erpnextImageUtils';
import { motion } from "motion/react";
import ProductDescription from '@/components/ProductDescription';
import MachineProductGallery from '@/components/MachineProductGallery';
import QuotationDialog from '@/components/QuotationDialog';
import { ProductSkeleton } from '@/components/ui/product-skeleton';

interface Product {
  name: string;
  item_name: string;
  item_group: string;
  stock_uom: string;
  description?: string;
  price?: number;
  currency?: string;
  image?: string;
  custom_quotation_item?: number;
  stock?: {
    totalStock: number;
  };
  attachments?: Array<{
    name: string;
    file_name: string;
    file_url: string;
    attached_to_name: string;
    is_private: number;
  }>;
  variants?: Array<{
    name: string;
    item_name: string;
    price?: number;
    currency?: string;
    image?: string;
    stock?: {
      totalStock: number;
    };
    attributes?: Array<{
      attribute: string;
      attribute_value: string;
    }>;
  }>;
}

interface ProductDetailContentProps {
  slug: string;
  initialProduct?: Product | null;
}

export default function ProductDetailContent({ slug, initialProduct }: ProductDetailContentProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct ?? null);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // New attribute filter state
  const [selectedAttributes, setSelectedAttributes] = useState<Array<{attribute: string, attribute_value: string}>>([]);
  
  // Image gallery states
  const [galleryImages, setGalleryImages] = useState<Array<{
    url: string;
    alt: string;
    type: 'main' | 'attachment';
  }>>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImagePreview, setShowImagePreview] = useState(false);
  
  // Cart functionality states
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Quotation dialog state
  const [showQuotationDialog, setShowQuotationDialog] = useState(false);
  // Added to cart confirmation dialog
  const [showAddedToCartDialog, setShowAddedToCartDialog] = useState(false);
  // Phone number dialog (machine page)
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);

  const MACHINE_CONTACT = {
    email: "krallaser@gmail.com",
    phone: "+923103339404",
    whatsapp: "https://wa.me/923103339404",
  };

  // Check if product is custom quotation item (ERPNext may use custom_quotation_item or custom_custom_quotation_item)
  const isCustomQuotationItem =
    (product as any)?.custom_quotation_item === 1 ||
    (product as any)?.custom_custom_quotation_item === 1;

  // Initialize gallery images from product data
  useEffect(() => {
    if (product) {
      const images: Array<{url: string, alt: string, type: 'main' | 'attachment'}> = [];
      
      // Add main product image if exists
      if (product.image) {
        images.push({
          url: getErpnextImageUrl(product.image),
          alt: product.item_name,
          type: 'main'
        });
      }
      
      // Add attachment images
      if (product.attachments && product.attachments.length > 0) {
        // Filter only image attachments and add to gallery
        const imageAttachments = product.attachments.filter(att => {
          const fileName = att.file_name.toLowerCase();
          return fileName.endsWith('.jpg') || 
                 fileName.endsWith('.jpeg') || 
                 fileName.endsWith('.png') || 
                 fileName.endsWith('.gif') ||
                 fileName.endsWith('.webp') ||
                 fileName.endsWith('.bmp') ||
                 fileName.endsWith('.svg');
        });
        
        imageAttachments.forEach((attachment, index) => {
          images.push({
            url: getErpnextImageUrl(attachment.file_url),
            alt: attachment.file_name || `Attachment ${index + 1}`,
            type: 'attachment'
          });
        });
      }
      
      setGalleryImages(images);
      setCurrentImageIndex(0);
    }
  }, [product]);

  // Auto-advance gallery every 2 seconds when multiple images (main area)
  useEffect(() => {
    if (galleryImages.length <= 1 || showImagePreview) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [galleryImages.length, showImagePreview]);

  // Auto-advance in lightbox every 2 seconds when multiple images
  useEffect(() => {
    if (!showImagePreview || galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [showImagePreview, galleryImages.length]);

  // Helper function to open image preview
  const openImagePreview = (index: number) => {
    setCurrentImageIndex(index);
    setShowImagePreview(true);
  };

  // Helper function to close image preview
  const closeImagePreview = () => {
    setShowImagePreview(false);
  };

  // Navigate to next image
  const nextImage = () => {
    if (galleryImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }
  };

  // Navigate to previous image
  const prevImage = () => {
    if (galleryImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  // Keyboard navigation for image preview
  useEffect(() => {
    if (!showImagePreview) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeImagePreview();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showImagePreview, currentImageIndex, galleryImages.length]);

  // Handle attribute changes from the new filter
  const handleAttributeChange = (attributes: Array<{attribute: string, attribute_value: string}>) => {
    setSelectedAttributes(attributes);
  };

  // Handle variation selection for custom quotation items
  const handleVariationClick = (variant: any) => {
    // For custom quotation items, always allow selection regardless of stock
    if (isCustomQuotationItem) {
      setSelectedVariation(variant);
      // For custom quotation items, show request quote dialog directly
      setShowQuotationDialog(true);
    } 
    // For non-custom items, only allow if in stock
    else if ((variant as any).stock && (variant as any).stock.totalStock > 0) {
      setSelectedVariation(variant);
      setShowAddToCart(true);
    }
  };

  // Handle adding simple product to cart
  const handleSimpleProductAddToCart = () => {
    if (product && !isTemplate && product.stock && product.stock.totalStock > 0) {
      const cartItem = {
        id: product.name,
        name: product.item_name,
        description: product.description || "",
        type: "item",
        basePrice: product.price || 0,
        salePrice: product.price || 0,
        category: product.item_group || "product",
        currency: product.currency || "PKR",
        bundleItems: [],
        quantity: quantity,
        image: product.image,
        sku: product.name,
        variationId: product.name,
        filterConds: [],
      };

      AddToCart(cartItem, quantity);
      setQuantity(1);
      setShowAddedToCartDialog(true);
    }
  };

  // Handle adding variation to cart
  const handleAddToCart = () => {
    if (selectedVariation && selectedVariation.stock && selectedVariation.stock.totalStock > 0) {
      const cartItem = {
        id: selectedVariation.name,
        name: selectedVariation.item_name,
        description: selectedVariation.description || product?.description || "",
        type: "item",
        basePrice: selectedVariation.price || 0,
        salePrice: selectedVariation.price || 0,
        category: product?.item_group || "product",
        currency: selectedVariation.currency || "PKR",
        bundleItems: [],
        quantity: quantity,
        image: selectedVariation.image || product?.image,
        sku: selectedVariation.name,
        variationId: selectedVariation.name,
        filterConds: [],
      };

      AddToCart(cartItem, quantity);
      setQuantity(1);
      setShowAddedToCartDialog(true);
    }
  };

  // Auto-hide added-to-cart dialog after 2.5s (smooth close via Dialog animation)
  useEffect(() => {
    if (!showAddedToCartDialog) return;
    const timer = setTimeout(() => setShowAddedToCartDialog(false), 2500);
    return () => clearTimeout(timer);
  }, [showAddedToCartDialog]);

  useEffect(() => {
    if (initialProduct) return; // Server already provided data
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/product/${slug}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch product');
        setProduct(data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, initialProduct]);

  const isTemplate = product?.variants && product?.variants.length > 0;
  const isSimpleProductInStock = product && !isTemplate && product.stock && product.stock.totalStock > 0;

  // Filter and sort variations
  const filteredVariations = useMemo(() => {
    if (!product?.variants) return [];
    
    if (selectedAttributes.length === 0) {
      return product.variants;
    }
    
    return product.variants.filter(variant => {
      return selectedAttributes.every(selectedAttr => {
        const matchingAttributes = variant.attributes?.filter((attr: any) => 
          attr.attribute === selectedAttr.attribute
        ) || [];
        
        return matchingAttributes.some((attr: any) => 
          attr.attribute_value === selectedAttr.attribute_value
        );
      });
    });
  }, [product?.variants, selectedAttributes]);

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="text-red-600 mb-4">
          <Package className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="text-gray-600 mb-4">
          <Package className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The requested product could not be found.</p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const currentImage = galleryImages[currentImageIndex];

  return (
    <div className={isCustomQuotationItem ? "min-h-screen bg-gradient-to-br from-sky-50 via-slate-100 to-sky-100/80" : ""}>
      {/* Machine page: floating left sidebar (HSG-style) */}
      {isCustomQuotationItem && (
        <div className="fixed left-0 top-1/2 z-40 -translate-y-1/2 flex flex-col gap-1 border-r border-slate-200/80 bg-white/90 shadow-lg py-2">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("quote-variations");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              else setShowQuotationDialog(true);
            }}
            className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-sky-50 transition-colors"
            title="Inquiry"
          >
            <FileImage className="h-5 w-5 text-slate-600" />
            <span className="text-[10px] font-medium text-slate-600">Inquiry</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("quote-variations");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              else setShowQuotationDialog(true);
            }}
            className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-sky-50 transition-colors"
            title="Variations"
          >
            <Tag className="h-5 w-5 text-slate-600" />
            <span className="text-[10px] font-medium text-slate-600">Variations</span>
          </button>
          <a
            href={MACHINE_CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-sky-50 transition-colors"
            title="WhatsApp"
          >
            <MessageCircle className="h-5 w-5 text-green-600" />
            <span className="text-[10px] font-medium text-slate-600">WhatsApp</span>
          </a>
          <a
            href={`mailto:${MACHINE_CONTACT.email}`}
            className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-sky-50 transition-colors"
            title="Email"
          >
            <Mail className="h-5 w-5 text-slate-600" />
            <span className="text-[10px] font-medium text-slate-600">Email</span>
          </a>
          <button
            type="button"
            onClick={() => setShowPhoneDialog(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-sky-50 transition-colors"
            title="Phone"
          >
            <Phone className="h-5 w-5 text-slate-600" />
            <span className="text-[10px] font-medium text-slate-600">Tel</span>
          </button>
        </div>
      )}

    <div className={`max-w-7xl mx-auto ${isCustomQuotationItem ? "pl-12 sm:pl-14" : ""}`}>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
        <Link href="/shop" className="hover:text-slate-900 transition-colors">Shop</Link>
        <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
        {product.item_group && (
          <>
            <Link href={`/shop?group=${encodeURIComponent(product.item_group)}`} className="hover:text-slate-900 transition-colors truncate max-w-[120px] sm:max-w-none">
              {product.item_group}
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
          </>
        )}
        <span className="text-slate-900 font-medium truncate" aria-current="page">{product.item_name}</span>
      </nav>

      {/* For quote items (machines): HSG-style = item name at top, then image preview */}
      {isCustomQuotationItem && (
        <div className="mb-5 space-y-3">
          {/* 1. Item name at top */}
          <div>
            <span className="inline-flex items-center rounded bg-blue-600/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700">
              Machine Detail
            </span>
            <h1 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
              {product.item_name}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              SKU: <span className="font-mono text-slate-600">{product.name}</span>
            </p>
          </div>

          {/* 2. Top image – single image, full width, come-in animation */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden"
          >
            {galleryImages.length > 0 ? (
              <div className="relative aspect-[21/9] w-full min-h-[180px] bg-slate-100">
                <Image
                  src={galleryImages[0].url}
                  alt={galleryImages[0].alt}
                  fill
                  className="object-cover cursor-zoom-in transition-transform hover:scale-[1.02]"
                  onClick={() => openImagePreview(0)}
                  sizes="100vw"
                  priority
                />
              </div>
            ) : (
              <div className="flex aspect-[21/9] min-h-[180px] w-full items-center justify-center bg-slate-100 text-slate-400">
                <Package className="h-12 w-12 opacity-50" />
                <span className="ml-2 text-sm">No image</span>
              </div>
            )}
          </motion.div>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-6 lg:gap-10 ${isCustomQuotationItem ? "lg:grid-cols-1" : "lg:grid-cols-12"}`}>
        {/* Main content: full-width for quote items (HSG-style), otherwise 7-col */}
        <div className={isCustomQuotationItem ? "w-full space-y-5" : "lg:col-span-7 space-y-8"}>
          {/* Main Image – only for non-quotation items (machines use top preview above) */}
          {!isCustomQuotationItem && (
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200/80 shadow-sm relative group">
            {galleryImages.length > 0 && currentImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt}
                  fill
                  className="object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]"
                  onClick={() => openImagePreview(currentImageIndex)}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 text-slate-800 rounded-full p-3 shadow-lg">
                    <ZoomIn className="h-6 w-6" />
                  </span>
                </div>
                {galleryImages.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Package className="h-20 w-20 mb-3 opacity-60" />
                <p className="text-sm font-medium">No image available</p>
              </div>
            )}
          </div>
          )}

          {/* Thumbnails – hidden for quotation items */}
          {!isCustomQuotationItem && galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 ${
                    currentImageIndex === index
                      ? 'border-[var(--primary-color)] ring-2 ring-[var(--primary-color)]/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  {image.type === 'attachment' && (
                    <div className="absolute top-1 left-1 rounded bg-black/50 p-0.5">
                      <FileImage className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Description / Machine gallery (HSG-style for all quotation items) */}
          <section className={isCustomQuotationItem ? "pt-0" : "pt-4 border-t border-slate-200"}>
            {isCustomQuotationItem ? (
              <>
                <MachineProductGallery
                  product={{
                    item_name: product.item_name,
                    description: product.description,
                    attachments: product.attachments,
                  }}
                  isMachine={true}
                />
                {/* Testimonial section for machine detail */}
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <Quote className="h-8 w-8 text-blue-600/25" aria-hidden />
                  <blockquote className="mt-1.5 text-slate-700 text-sm sm:text-base leading-relaxed">
                    &ldquo;We have been using their equipment for over three years. Outstanding reliability and excellent after-sales support. Highly recommend for industrial applications.&rdquo;
                  </blockquote>
                  <footer className="mt-3 flex flex-wrap items-center gap-x-3 text-xs sm:text-sm">
                    <span className="font-semibold text-slate-900">— Manufacturing Director</span>
                    <span className="text-slate-500">Leading Industrial Solutions</span>
                  </footer>
                </div>
              </>
            ) : (
              <ProductDescription description={product.description} />
            )}
          </section>
        </div>

        {/* Right: Sticky product info & actions (hidden for quote items – use hero + variations below) */}
        {!isCustomQuotationItem && (
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {isTemplate && (
                <Badge variant="outline" className="text-xs font-medium border-slate-300 text-slate-700">
                  <Tag className="h-3 w-3 mr-1" />
                  Template Product
                </Badge>
              )}
              {isCustomQuotationItem && (
                <Badge className="bg-blue-600/10 text-blue-700 border-blue-200 text-xs font-medium">
                  <Info className="h-3 w-3 mr-1" />
                  Request Quote
                </Badge>
              )}
              {!isTemplate && !isCustomQuotationItem && product.stock && product.stock.totalStock > 0 && (
                <Badge className="bg-emerald-600/10 text-emerald-700 border-emerald-200 text-xs font-medium">
                  In Stock: {product.stock.totalStock} {product.stock_uom}
                </Badge>
              )}
              {!isTemplate && !isCustomQuotationItem && product.stock && product.stock.totalStock === 0 && (
                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 text-xs font-medium">
                  Out of Stock
                </Badge>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-1">
                {product.item_name}
              </h1>
              <p className="text-slate-500 text-sm font-mono">SKU: {product.name}</p>
            </div>

            {/* Price */}
            {product.price != null && (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {product.currency} {Number(product.price).toLocaleString()}
                </span>
                <span className="text-slate-500 text-sm">per {product.stock_uom}</span>
              </div>
            )}

            <Separator className="bg-slate-200" />

          {/* Simple Product Add to Cart Section */}
          {!isTemplate && isSimpleProductInStock && !isCustomQuotationItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-l-md hover:bg-slate-100"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[52px] text-center font-medium tabular-nums">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-r-md hover:bg-slate-100"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= (product.stock?.totalStock || 0)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-slate-600">
                  Subtotal: <span className="font-semibold text-slate-900">{product.currency} {(product.price !== undefined ? (product.price * quantity).toLocaleString() : '—')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Variations */}
          {isTemplate && product.variants && product.variants.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Available Variations ({filteredVariations.length} of {product.variants.length})
                </h3>
              </div>

              {/* New Attribute Filter */}
              <AttributeFilter
                templateItemName={product.name}
                onAttributeChange={handleAttributeChange}
                selectedAttributes={selectedAttributes}
              />

              {/* Price List for Filtered Variations */}
              {selectedAttributes.length > 0 && filteredVariations.length > 0 ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                      {isCustomQuotationItem ? 'Configurations' : 'Available options'} ({filteredVariations.length})
                    </h3>
                    <div className="space-y-2">
                      {filteredVariations.map((variant) => {
                        const variantInStock = (variant as any).stock && (variant as any).stock.totalStock > 0;
                        const isSelectable = isCustomQuotationItem || variantInStock;
                        const isSelected = selectedVariation?.name === variant.name;
                        return (
                          <div
                            key={variant.name}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                              isSelectable
                                ? 'bg-white hover:shadow-sm cursor-pointer hover:border-slate-300'
                                : 'bg-slate-100/80 opacity-70 cursor-not-allowed'
                            } ${isSelected ? 'border-[var(--primary-color)] ring-1 ring-[var(--primary-color)]/20 shadow-sm' : 'border-slate-200'}`}
                            onClick={() => isSelectable && handleVariationClick(variant)}
                          >
                            <div className="flex-1 flex items-center space-x-3">
                              {variant.image && (
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden group cursor-pointer" onClick={(e) => {
                                  e.stopPropagation();
                                  // Add variant image to gallery for preview if not already there
                                  const variantImageUrl = getErpnextImageUrl(variant.image);
                                  const existingIndex = galleryImages.findIndex(img => img.url === variantImageUrl);
                                  if (existingIndex >= 0) {
                                    openImagePreview(existingIndex);
                                  }
                                }}>
                                  <Image
                                    src={getErpnextImageUrl(variant.image)}
                                    alt={variant.item_name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                    <ZoomIn className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                  </div>
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                                  {variant.item_name}
                                </h4>
                                <div className="text-xs text-gray-600">
                                  {variant.attributes?.map((attr, idx) => (
                                    <span key={idx}>
                                      {attr.attribute_value}
                                      {idx < (variant.attributes?.length || 0) - 1 ? ' • ' : ''}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {variant.price != null && (
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="font-semibold text-slate-900">
                                  {variant.currency} {Number(variant.price).toLocaleString()}
                                </span>
                                {isCustomQuotationItem ? (
                                  <Badge className="text-xs bg-blue-600/10 text-blue-700 border-blue-200">Quote</Badge>
                                ) : variantInStock ? (
                                  <Badge className="text-xs bg-emerald-600/10 text-emerald-700 border-emerald-200">{(variant as any).stock.totalStock} in stock</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs text-red-600 border-red-200">Out of stock</Badge>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {!isCustomQuotationItem && showAddToCart && selectedVariation && (
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-emerald-800 text-sm">Selected variation</h4>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => { setShowAddToCart(false); setSelectedVariation(null); }}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className="font-medium text-slate-900">{selectedVariation.item_name}</p>
                            <p className="text-xs text-slate-500 font-mono">SKU: {selectedVariation.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">{selectedVariation.currency} {selectedVariation.price != null ? Number(selectedVariation.price).toLocaleString() : '—'}</p>
                            <p className="text-xs text-emerald-700">{(selectedVariation as any).stock?.totalStock} in stock</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus className="h-4 w-4" /></Button>
                            <span className="px-3 py-1.5 min-w-[44px] text-center font-medium tabular-nums text-sm">{quantity}</span>
                            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(quantity + 1)} disabled={quantity >= ((selectedVariation as any).stock?.totalStock || 0)}><Plus className="h-4 w-4" /></Button>
                          </div>
                          <Button onClick={handleAddToCart} className="flex-1 min-w-[140px] bg-emerald-600 hover:bg-emerald-700 text-white">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                        </div>
                        <p className="text-sm text-slate-600">Subtotal: <span className="font-semibold">{selectedVariation.currency} {(selectedVariation.price != null ? selectedVariation.price * quantity : 0).toLocaleString()}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                  <Package className="h-10 w-10 mx-auto text-slate-400 mb-3" />
                  <p className="text-sm font-medium text-slate-700">Select options above to see {isCustomQuotationItem ? 'configurations' : 'prices'}.</p>
                </div>
              )}
            </div>
          )}

          {/* Primary actions */}
          <div className="space-y-3">
            {(isCustomQuotationItem || (!isTemplate && product.stock && product.stock.totalStock === 0)) && (
              <Button
                size="lg"
                className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white font-medium rounded-lg"
                onClick={() => setShowQuotationDialog(true)}
                disabled={isTemplate && isCustomQuotationItem && !selectedVariation}
              >
                Request Quote
              </Button>
            )}
            {!isTemplate && isSimpleProductInStock && !isCustomQuotationItem && (
              <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg" onClick={handleSimpleProductAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            )}
            <Button variant="outline" size="lg" className="w-full rounded-lg border-slate-300" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>

          {/* Specifications table */}
          <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <dl className="divide-y divide-slate-100 text-sm">
                <div className="flex justify-between gap-4 px-6 py-3">
                  <dt className="text-slate-500">Item code</dt>
                  <dd className="font-mono font-medium text-slate-900 text-right">{product.name}</dd>
                </div>
                <div className="flex justify-between gap-4 px-6 py-3">
                  <dt className="text-slate-500">Category</dt>
                  <dd className="font-medium text-slate-900 text-right">{product.item_group}</dd>
                </div>
                {!isTemplate && product.stock && !isCustomQuotationItem && (
                  <div className="flex justify-between gap-4 px-6 py-3">
                    <dt className="text-slate-500">Availability</dt>
                    <dd className={`font-medium text-right ${product.stock.totalStock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {product.stock.totalStock} {product.stock_uom}
                    </dd>
                  </div>
                )}
                {isTemplate && (
                  <div className="flex justify-between gap-4 px-6 py-3">
                    <dt className="text-slate-500">Variations</dt>
                    <dd className="font-medium text-slate-900 text-right">{product.variants?.length ?? 0} options</dd>
                  </div>
                )}
                {isCustomQuotationItem && (
                  <div className="flex justify-between gap-4 px-6 py-3">
                    <dt className="text-slate-500">Type</dt>
                    <dd className="font-medium text-blue-600 text-right">Custom quotation</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
          </div>
        </div>
        )}
      </div>

      {/* For quote items: Variations section below (if template) */}
      {isCustomQuotationItem && (
        <div className="mt-5 space-y-3">
          {isTemplate && product.variants && product.variants.length > 0 && (
            <Card id="quote-variations" className="rounded-lg border-slate-200 p-4 scroll-mt-24">
              <h3 className="mb-3 text-sm font-semibold">Select Configuration</h3>
              <AttributeFilter
                templateItemName={product.name}
                onAttributeChange={handleAttributeChange}
                selectedAttributes={selectedAttributes}
              />
              {selectedAttributes.length > 0 && filteredVariations.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {filteredVariations.map((variant) => {
                    const isSelected = selectedVariation?.name === variant.name;
                    return (
                      <div
                        key={variant.name}
                        onClick={() => handleVariationClick(variant)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected ? "border-blue-600 ring-2 ring-blue-600/20" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="font-medium">{variant.item_name}</span>
                        {variant.price != null && (
                          <span className="text-slate-600">{variant.currency} {Number(variant.price).toLocaleString()}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </Card>
          )}
        </div>
      )}

      {/* Phone number dialog (machine page) */}
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent className="sm:max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle>Contact Number</DialogTitle>
            <DialogDescription>Call us for inquiries about this product.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 py-4">
            <Phone className="h-8 w-8 text-slate-600" />
            <a href={`tel:${MACHINE_CONTACT.phone}`} className="text-xl font-semibold text-slate-900 hover:text-blue-600">
              {MACHINE_CONTACT.phone}
            </a>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPhoneDialog(false)}>Close</Button>
            <Button asChild><a href={`tel:${MACHINE_CONTACT.phone}`}>Call Now</a></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Image Preview Modal with Navigation */}
      {showImagePreview && galleryImages.length > 0 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeImagePreview}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-4">
              <div className="text-white">
                <h3 className="font-semibold">{galleryImages[currentImageIndex].alt}</h3>
                <p className="text-sm text-gray-300">
                  Image {currentImageIndex + 1} of {galleryImages.length}
                </p>
              </div>
              <button
                onClick={closeImagePreview}
                className="bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-all z-20"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Main Image Container */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
              {/* Previous Button */}
              {galleryImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 z-10 bg-black/50 text-white rounded-full p-3 hover:bg-black/75 transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              
              {/* Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={galleryImages[currentImageIndex].url}
                  alt={galleryImages[currentImageIndex].alt}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {/* Next Button */}
              {galleryImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 z-10 bg-black/50 text-white rounded-full p-3 hover:bg-black/75 transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>
            
            {/* Thumbnails Strip */}
            {galleryImages.length > 1 && (
              <div className="mt-4 px-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${
                        currentImageIndex === index 
                          ? 'border-blue-500 ring-2 ring-blue-300' 
                          : 'border-transparent hover:border-white'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                    >
                      <Image
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Keyboard navigation info */}
            <div className="text-center text-gray-400 text-xs mt-2">
              Use ← → arrow keys or click on thumbnails to navigate
            </div>
          </div>
        </div>
      )}
      
      {/* Added to cart confirmation dialog */}
      <Dialog open={showAddedToCartDialog} onOpenChange={setShowAddedToCartDialog}>
        <DialogContent className="sm:max-w-md rounded-xl border-slate-200 shadow-xl">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-slate-900 text-center">Added to cart</DialogTitle>
            <DialogDescription className="text-slate-600 text-center">
              The item has been added to your cart. You can continue shopping or view your cart.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-center mt-4">
            <Button variant="outline" className="rounded-lg" onClick={() => setShowAddedToCartDialog(false)}>
              Continue shopping
            </Button>
            <Button className="rounded-lg bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/cart">View cart</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quotation Dialog */}
      {product && (
        <QuotationDialog
          open={showQuotationDialog}
          onClose={() => setShowQuotationDialog(false)}
          product={product}
          selectedVariation={selectedVariation}
        />
      )}
    </div>
    </div>
  );
}