import type { Metadata } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import { getRequestOrigin } from "@/lib/requestOrigin";
import { getAllCategories } from "@/hooks/getCategories";
import { getProducts } from "@/hooks/getProducts";
import Hero from "@/modules/Hero";

export const metadata: Metadata = {
  title: "Return Policy | CNC KRAL",
  description:
    "CNC KRAL return and exchange policy for parts, accessories, and CNC equipment purchased in Pakistan.",
};

export default async function ReturnPolicyPage() {
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
          content={{ title: "Return Policy", heroImage: undefined }}
          storeData={data?.store?.stores?.[0]}
          categories={categories}
          products={products}
        />

        <article className="max-w-3xl mx-auto space-y-8 text-slate-700 bg-white rounded-xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
          <p className="text-lg leading-relaxed">
            We want you to be satisfied with every purchase from{" "}
            <strong>CNC KRAL</strong>. This policy covers returns and exchanges
            for products bought through cnckral.com or our Lahore showroom.
          </p>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Eligibility
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Unused parts and accessories in original packaging may be
                returned within <strong>7 days</strong> of delivery, subject to
                inspection.
              </li>
              <li>
                Items must be unused, undamaged, and include all original
                accessories, manuals, and packaging where applicable.
              </li>
              <li>
                Custom-cut, special-order, or clearly marked non-returnable
                items cannot be returned unless faulty on arrival.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Machines &amp; installed equipment
            </h2>
            <p>
              CNC machines and installed equipment are handled case by case.
              Warranty and service terms apply as stated on your invoice or
              quotation. Contact us before attempting any return of heavy
              machinery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Defective or wrong items
            </h2>
            <p>
              If you receive a defective or incorrect product, contact us within{" "}
              <strong>48 hours</strong> with photos and your order details. We
              will arrange a replacement, repair, or refund as appropriate after
              verification.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              How to request a return
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Message us on WhatsApp, call, or email with your order
                reference and reason for return.
              </li>
              <li>
                Wait for approval and return instructions before shipping
                anything back.
              </li>
              <li>
                Once we receive and inspect the item, we process exchange or
                refund according to the agreed resolution.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Refunds
            </h2>
            <p>
              Approved refunds are issued to the original payment method or as
              store credit, typically within a few business days after
              inspection. Shipping fees are non-refundable unless the return is
              due to our error.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Contact</h2>
            <p>
              Need help with a return?{" "}
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
