'use client';

import React, { useEffect, useState } from 'react';
import CartItem from './components/CartItem';
import CartBundle from './components/CartBundle';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartProps {
  storeCurrency: string;
}

const Cart = ({ storeCurrency }: CartProps) => {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const syncCart = () => {
      try {
        const cartDataString = localStorage.getItem('cart');
        const cartData = cartDataString ? JSON.parse(cartDataString) : [];
        setCart(Array.isArray(cartData) ? cartData : []);
      } catch {
        setCart([]);
      }
    };

    syncCart();
    window.addEventListener('load', syncCart);
    window.addEventListener('storage', syncCart);
    window.addEventListener('cartUpdated', syncCart);

    return () => {
      window.removeEventListener('load', syncCart);
      window.removeEventListener('storage', syncCart);
      window.removeEventListener('cartUpdated', syncCart);
    };
  }, []);

  const items = cart.filter((item: any) => item.type === 'item');
  const bundles = cart.filter((item: any) => item.type === 'bundle');
  const isEmpty = items.length === 0 && bundles.length === 0;

  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-6">
            <ShoppingBag className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-600 max-w-sm mb-8">
            Add items from the shop to get started. When you&apos;re ready, come back here to checkout.
          </p>
          <Button asChild className="rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart items card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Cart items
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {items.length + bundles.length} item{items.length + bundles.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {items.length > 0 &&
            items.map((item: any, index: number) => (
              <CartItem
                key={`${item.id}-${index}`}
                item={item}
                storeCurrency={storeCurrency}
                showBundleInfo={false}
              />
            ))}
          {bundles.length > 0 && items.length > 0 && (
            <div className="bg-slate-50/50">
              <div className="px-6 py-3">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Bundles
                </span>
              </div>
            </div>
          )}
          {bundles.length > 0 &&
            bundles.map((bundle: any, index: number) => (
              <div key={`bundle-${bundle.id}-${index}`} className="bg-slate-50/30">
                <CartBundle bundle={bundle} storeCurrency={storeCurrency} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;
