import Cart from '@/modules/Cart';
import OrderSummary from '@/modules/OrderSummary';
import { headers } from 'next/headers';
import { getUrlWithScheme } from '@/lib/getUrlWithScheme';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default async function CartPage() {
  const Headers = await headers();
  const host = Headers.get('host');

  if (!host) {
    throw new Error('Host header is missing or invalid');
  }

  const fullStoreUrl = getUrlWithScheme(host);
  const response = await fetch(`${fullStoreUrl}/api/fetchStore`);
  const data = await response.json();

  const store = data?.store?.stores?.[0];
  const storeCurrency = data?.store?.stores?.[0]?.store_detail?.currency ?? 'PKR - Rs';

  return (
    <Layout>
      <main className="min-h-screen bg-slate-50/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-7xl">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm text-slate-500 mb-6"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
            <Link href="/shop" className="hover:text-slate-900 transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
            <span className="text-slate-900 font-medium" aria-current="page">
              Cart
            </span>
          </nav>

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Shopping cart
            </h1>
            <p className="mt-1 text-slate-600">
              Review your items and proceed to checkout
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-7 xl:col-span-8">
              <Cart storeCurrency={storeCurrency} />
            </div>
            <div className="lg:col-span-5 xl:col-span-4">
              <OrderSummary
                storeCurrency={storeCurrency}
                necessary={{
                  companyId: store?.company_id,
                  storeId: store?.id,
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
