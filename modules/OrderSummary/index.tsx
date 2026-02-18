'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/currencyUtils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Lock, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface OrderSummaryProps {
  storeCurrency: string;
  necessary?: {
    storeId?: string;
    companyId?: string;
  };
}

const OrderSummary = ({ storeCurrency, necessary }: OrderSummaryProps) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const cartDataString = sessionStorage.getItem('cart');
        const cartData = cartDataString ? JSON.parse(cartDataString) : [];
        setCartItems(Array.isArray(cartData) ? cartData : []);
      } catch {
        setCartItems([]);
      }
    };

    handleCartUpdate();
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.salePrice ?? item.price ?? 0;
    return sum + itemPrice * (item.quantity ?? 1);
  }, 0);

  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string) => {
    setCustomerForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProceed = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setDialogOpen(true);
  };

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customerForm.name || !customerForm.phone || !customerForm.address) {
      toast.error('Please add name, phone, and address');
      return;
    }

    setIsSubmitting(true);

    try {
      const customerResponse = await fetch('/api/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerForm.name,
          phone: customerForm.phone,
          email: customerForm.email,
        }),
      });

      const customerData = await customerResponse.json();
      if (!customerResponse.ok) {
        throw new Error(customerData?.message || 'Failed to create customer');
      }

      const invoiceResponse = await fetch('/api/sale-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerData?.data?.name || customerForm.name,
          items: cartItems,
          shipping: { ...customerForm },
          companyId: necessary?.companyId,
          storeId: necessary?.storeId,
        }),
      });

      const invoiceData = await invoiceResponse.json();
      if (!invoiceResponse.ok) {
        throw new Error(invoiceData?.message || 'Failed to create sales invoice');
      }

      toast.success('Order created successfully', {
        description: invoiceData?.data?.name
          ? `Invoice #${invoiceData.data.name}`
          : 'Sales invoice created',
      });

      sessionStorage.removeItem('cart');
      setCartItems([]);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      setDialogOpen(false);
    } catch (error: any) {
      toast.error('Unable to complete order', {
        description: error?.message || 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="lg:sticky lg:top-24">
        <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900">Order summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingBag className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Your cart is empty</p>
              <Button variant="outline" className="mt-4 rounded-lg" asChild>
                <Link href="/shop">Continue shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:sticky lg:top-24">
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900">Order summary</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {/* Item list */}
          <div className="max-h-[240px] overflow-y-auto px-6 py-4">
            <ul className="space-y-3">
              {cartItems.map((item, index) => {
                const itemPrice = item.salePrice ?? item.price ?? 0;
                const qty = item.quantity ?? 1;
                const itemTotal = itemPrice * qty;
                return (
                  <li key={`${item.id}-${index}`} className="flex justify-between gap-3 text-sm">
                    <span className="text-slate-700 truncate flex-1 min-w-0">
                      {item.name}
                      <span className="text-slate-400 font-normal"> × {qty}</span>
                    </span>
                    <span className="font-medium text-slate-900 shrink-0 tabular-nums">
                      {formatPrice(itemTotal, item.currency ?? storeCurrency)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <Separator className="bg-slate-100" />

          <div className="px-6 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium text-slate-900 tabular-nums">
                {formatPrice(subtotal, storeCurrency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Shipping</span>
              <span className="font-medium text-slate-900 tabular-nums">
                {formatPrice(shipping, storeCurrency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tax</span>
              <span className="font-medium text-slate-900 tabular-nums">
                {formatPrice(tax, storeCurrency)}
              </span>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          <div className="px-6 py-4 flex justify-between items-baseline">
            <span className="text-base font-semibold text-slate-900">Total</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              {formatPrice(total, storeCurrency)}
            </span>
          </div>

          <div className="px-6 pb-6 pt-0 space-y-3">
            <Button
              className="w-full rounded-xl h-12 font-semibold bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white"
              onClick={handleProceed}
            >
              Proceed to checkout
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <Lock className="h-3.5 w-3.5" />
              Secure checkout
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Shipping details
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Enter your contact and delivery details to place the order.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitOrder}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Customer name</Label>
              <Input
                id="name"
                value={customerForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Doe"
                required
                className="rounded-lg border-slate-200"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-lg border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700">Phone</Label>
                <Input
                  id="phone"
                  value={customerForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+92 300 0000000"
                  required
                  className="rounded-lg border-slate-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-slate-700">Shipping address</Label>
              <Textarea
                id="address"
                value={customerForm.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Street, house no, area"
                required
                className="rounded-lg border-slate-200 min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-slate-700">City</Label>
              <Input
                id="city"
                value={customerForm.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
                className="rounded-lg border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-700">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={customerForm.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any delivery instructions"
                className="rounded-lg border-slate-200 min-h-[60px]"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setDialogOpen(false)}
                disabled={isSubmitting}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[160px] rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]"
              >
                {isSubmitting ? 'Processing…' : 'Place order'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderSummary;
