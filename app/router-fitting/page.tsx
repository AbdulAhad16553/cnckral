import type { Metadata } from "next";
import Layout from "@/components/Layout";
import RouterFittingGuide from "@/components/RouterFittingGuide";
import JsonLd from "@/components/JsonLd";
import { buildRouterFittingFaqSchema } from "@/lib/routerFittingGuide";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CNC Router Spindle Fitting Guide | Collet & Bit Setup",
  description:
    "Step-by-step guide in Urdu: CNC router spindle fitting — mount on Z-axis, ER11/ER20 collet, router bit insertion, wiring, water cooling, and test run.",
  keywords: [
    "CNC router spindle fitting",
    "router collet setup",
    "ER11 ER20 collet",
    "router bit installation",
    "CNC spindle mounting Pakistan",
  ],
};

export default function RouterFittingPage() {
  return (
    <Layout>
      <JsonLd data={buildRouterFittingFaqSchema()} />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
        <div className="page-container py-10 lg:py-14 max-w-4xl">
          <nav className="breadcrumb mb-6">
            <Link href="/" className="breadcrumb-link">
              Home
            </Link>
            <span className="breadcrumb-separator">/</span>
            <Link href="/machine" className="breadcrumb-link">
              Machines
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="text-slate-900 font-medium">Router Fitting</span>
          </nav>

          <RouterFittingGuide />
        </div>
      </div>
    </Layout>
  );
}
