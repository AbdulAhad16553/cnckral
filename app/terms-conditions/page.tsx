import Content from "@/common/Content";
import Hero from "@/modules/Hero";
import Layout from "@/components/Layout";
import { getStorePage } from "@/hooks/getStorePage";
import { getRequestOrigin } from "@/lib/requestOrigin";
import React from "react";
import { getAllCategories } from "@/hooks/getCategories";
import { getProducts } from "@/hooks/getProducts";

const TermsConditionsPage = async () => {
  const fullStoreUrl = await getRequestOrigin();

  const response = await fetch(`${fullStoreUrl}/api/fetchStore`);
  const data = await response.json();

  const storeId = data?.store?.stores[0].id;
  const heroSectionId =
    data?.store?.stores?.[0]?.store_components?.find(
      (component: any) => component.type === "hero"
    )?.component_id || "";

  // Fetch all required data
  const { page } = await getStorePage(storeId, "terms-conditions");
  const { categories } = await getAllCategories(storeId);
  const { products } = await getProducts(storeId);

  return (
    <Layout>
      <div className="container mx-auto px-8">
        <Hero
          hideOnPage={true}
          content={{
            title: page?.title,
            heroImage: undefined
          }}
          storeData={data?.store?.stores[0]}
          categories={categories}
          products={products}
        />
        <Content content={page?.content || ''} />
      </div>
    </Layout>
  );
};

export default TermsConditionsPage;
