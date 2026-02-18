'use client';

import { useState } from 'react';
import { Package, Trash2, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import BundleItem from './components/BundleItem';
import { IncreamentQuantity } from '@/sub/cart/increamentQuantity';
import { DecreamentQuantity } from '@/sub/cart/decreamentQuantity';
import { RemoveFromCart } from '@/sub/cart/removeFromCart';
import { formatPrice } from '@/lib/currencyUtils';

interface CartBundleProps {
  bundle: any;
  storeCurrency: string;
}

const CartBundle = ({ bundle, storeCurrency }: CartBundleProps) => {
  const [expanded, setExpanded] = useState(true);
  const [removing, setRemoving] = useState(false);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const basePrice = bundle?.basePrice ?? 0;
  const salePrice = bundle?.salePrice ?? bundle?.price ?? basePrice;
  const savingsPercentage =
    basePrice > 0 && salePrice < basePrice
      ? Math.round(((basePrice - salePrice) / basePrice) * 100)
      : 0;

  const currency = bundle?.currency ?? storeCurrency;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-color)]/10">
                <Package className="h-4 w-4 text-[var(--primary-color)]" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 truncate">{bundle.name}</h3>
                {bundle.description && (
                  <p className="text-sm text-slate-500 line-clamp-2 mt-0.5">{bundle.description}</p>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 self-start sm:self-center"
            onClick={toggleExpanded}
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-2">
            {savingsPercentage > 0 && (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Save {savingsPercentage}%
              </span>
            )}
            <span className="text-sm font-semibold text-slate-900">
              {formatPrice(salePrice * (bundle?.quantity ?? 1), currency)}
            </span>
            {basePrice > 0 && salePrice < basePrice && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(basePrice * (bundle?.quantity ?? 1), currency)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-slate-200 rounded-lg bg-white">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-r-none hover:bg-slate-100"
                onClick={() => DecreamentQuantity(bundle?.id)}
                disabled={(bundle?.quantity ?? 1) <= 1}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-9 text-center text-sm font-medium tabular-nums">
                {bundle?.quantity ?? 1}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-l-none hover:bg-slate-100"
                onClick={() => IncreamentQuantity(bundle?.id)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50"
              disabled={removing}
              onClick={() => RemoveFromCart(bundle?.id)}
              aria-label="Remove bundle"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {expanded && bundle?.bundleItems?.length > 0 && (
        <>
          <Separator className="bg-slate-100" />
          <div className="p-4 sm:p-5 pt-0 space-y-4">
            {bundle.bundleItems.map((item: any, index: number) => (
              <div key={index}>
                {index > 0 && <Separator className="my-4 bg-slate-100" />}
                <BundleItem
                  item={item}
                  storeCurrency={storeCurrency}
                  showBundleInfo={true}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CartBundle;
