import type { Metadata } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import { getRequestOrigin } from "@/lib/requestOrigin";
import { getAllCategories } from "@/hooks/getCategories";
import { getProducts } from "@/hooks/getProducts";
import Hero from "@/modules/Hero";

export const metadata: Metadata = {
  title: "Shipping Policy | CNC KRAL",
  description:
    "CNC KRAL shipping policy for CNC machines, parts, and accessories across Pakistan. Free shipping on orders over Rs. 10,000.",
};

export default async function ShippingPolicyPage() {
  const fullStoreUrl = await getRequestOrigin();
  const response = await fetch(`${fullStoreUrl}/api/fetchStore`);
  const data = await response.json();
  const storeId = data?.store?.stores?.[0]?.id;

  const { categories } = await getAllCategories(storeId);
  const { products } = await getProducts(storeId);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 bg-brand-tint/30 min-h-screen">
        <Hero
          hideOnPage={true}
          content={{ title: "Shipping Policy", heroImage: undefined }}
          storeData={data?.store?.stores?.[0]}
          categories={categories}
          products={products}
        />

        <article className="max-w-3xl mx-auto space-y-8 text-slate-700 bg-white rounded-xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
          <p className="text-lg leading-relaxed">
            <strong>CNC KRAL</strong> ships CNC machines, spare parts, and
            accessories across Pakistan from our Lahore operations. This page
            explains how delivery works for online and showroom orders.
          </p>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Free shipping threshold
            </h2>
            <p>
              Orders totaling{" "}
              <strong>Rs. 10,000 or more</strong> qualify for free shipping
              within Pakistan (standard courier), unless a product listing or
              quote states otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Delivery times
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Parts &amp; accessories:</strong> typically 2–5 business
                days after confirmation, depending on city and stock.
              </li>
              <li>
                <strong>Machines &amp; heavy equipment:</strong> scheduled
                delivery after order confirmation; timing depends on model,
                preparation, and destination.
              </li>
              <li>
                Remote areas may need extra transit time. We will share an
                estimated window when your order is confirmed.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Order confirmation
            </h2>
            <p>
              After you place an order or inquiry, our team confirms stock,
              shipping cost (if any), and delivery details by phone, WhatsApp,
              or email before dispatch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Damaged or missing items
            </h2>
            <p>
              Please inspect packages on arrival. Report damage or missing items
              within <strong>48 hours</strong> of delivery with photos and your
              order reference so we can help quickly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Contact</h2>
            <p>
              Questions about shipping?{" "}
              <Link
                href="/contact"
                className="text-[var(--primary-color)] font-medium underline-offset-2 hover:underline"
              >
                Contact us
              </Link>
              , call{" "}
              <a
                href="tel:03224414443"
                className="text-[var(--primary-color)] font-medium underline-offset-2 hover:underline"
              >
                0322 4414443
              </a>
              , or email{" "}
              <a
                href="mailto:cnckral@gmail.com"
                className="text-[var(--primary-color)] font-medium underline-offset-2 hover:underline"
              >
                cnckral@gmail.com
              </a>
              .
            </p>
          </section>
        </article>
      </div>
    </Layout>
  );
}
