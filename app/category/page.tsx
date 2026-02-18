import Categories from "@/modules/Categories";
import Layout from "@/components/Layout";
import { getAllCategories } from "@/hooks/getCategories";
import { getUrlWithScheme } from "@/lib/getUrlWithScheme";
import { headers } from "next/headers";
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AllCategories = async () => {
  const Headers = await headers();
  const host = Headers.get("host");

  if (!host) {
    throw new Error("Host header is missing or invalid");
  }

  const fullStoreUrl = getUrlWithScheme(host);
  const response = await fetch(`${fullStoreUrl}/api/fetchStore`, { next: { revalidate: 300 } });
  const data = await response.json();
  const storeId = data?.store?.stores[0].id;

  const { categories } = await getAllCategories(storeId);

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="page-container py-12 lg:py-16">
          <nav className="mb-4">
            <p className="text-sm text-slate-500">
              You are here:{" "}
              <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
              <span className="mx-1">»</span>
              <span className="text-slate-900 font-medium">Product Categories</span>
            </p>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Product Categories – Browse
          </h1>
          <div className="h-px bg-slate-200 mb-8" />

          <div className="mb-10 max-w-4xl">
            <p className="text-slate-700 leading-relaxed">
              Explore our comprehensive range of products organized into convenient categories. 
              Find exactly what you&apos;re looking for with our intuitive navigation.
            </p>
          </div>

          <div className="mb-12">
            <Categories subcat={false} categories={categories} hideOnPage={true} />
          </div>

          <div className="text-center">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Can&apos;t find what you need?
              </h2>
              <p className="text-slate-600 mb-6">
                Browse all products or contact our team for assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/machine">
                  <Button
                    className="text-white px-8 py-3 rounded-lg shadow-soft hover:shadow-soft-lg transition-all"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    Browse All Products
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="px-8 py-3 rounded-lg border-slate-300 hover:bg-slate-50">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllCategories;
