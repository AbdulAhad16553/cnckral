import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

interface BundleItemProps {
  item: any;
  storeCurrency: string;
  showBundleInfo: boolean;
}

const BundleItem = ({ item, storeCurrency, showBundleInfo }: BundleItemProps) => {
  const getItemDetail = (item: any) => {
    if (item?.product_variation) {
      return {
        name: item?.product_variation?.product?.name || 'Unnamed Product',
        imageId: item?.product_variation?.product?.product_images?.find(
          (img: any) => img?.position === 'featured'
        )?.image_id,
        sku: item?.product_variation?.sku || 'N/A',
        attributes: item?.product_variation?.product_variation_attributes || [],
      };
    }
    return {
      name: item?.product?.name || 'Unnamed Product',
      imageId: item?.image?.image_id,
      sku: item?.sku || 'N/A',
      attributes: [],
    };
  };

  const details = getItemDetail(item);
  const productSlug = item?.product_id ?? item?.sku ?? '';
  const productUrl = productSlug ? `/product/${encodeURIComponent(productSlug)}` : '/shop';
  const imageSrc = details.imageId
    ? `${process.env.NEXT_PUBLIC_NHOST_STORAGE_URL}/files/${details.imageId}?w=128&h=128`
    : '/placeholder.svg';

  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch gap-3 p-3 rounded-lg ${
        showBundleInfo ? 'bg-slate-50/80' : 'border border-slate-200'
      }`}
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg bg-slate-100 shrink-0 mx-auto sm:mx-0">
        <Image
          src={imageSrc}
          alt={details.name}
          fill
          className="object-cover"
          sizes="72px"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1 text-center sm:text-left">
        <Link
          href={productUrl}
          className="font-medium text-slate-900 truncate hover:text-[var(--primary-color)] transition-colors"
        >
          {details.name}
        </Link>
        <p className="text-xs text-slate-500 font-mono">SKU: {details.sku}</p>
        <p className="text-xs text-slate-500">Qty: {item?.quantity ?? 1}</p>
        {details.attributes?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start mt-1">
            {details.attributes.map((attr: any, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs font-normal px-2 py-0">
                {attr?.product_attribute?.name}: {attr?.product_attributes_value?.value}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BundleItem;
