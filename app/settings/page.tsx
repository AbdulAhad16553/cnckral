import type { Metadata } from "next"
import AllSettings from "@/modules/AllSettings";
import { getRequestOrigin } from "@/lib/requestOrigin";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
    title: "Account Settings | EasyShop",
    description: "Manage your account settings and preferences",
}

export default async function Settings() {
    const fullStoreUrl = await getRequestOrigin();

    const response = await fetch(`${fullStoreUrl}/api/fetchStore`);
    const data = await response.json();

    const storeId = data?.store?.stores[0].id
    const companyId = data?.store?.stores[0].company_id
    const storeCurrency = data?.store?.stores[0].store_detail?.currency ? data?.store?.stores[0].store_detail?.currency : "Rs.";

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Account Settings</h1>
                <AllSettings
                    necessary={{
                        storeId: storeId,
                        companyId: companyId,
                        storeCurrency: storeCurrency
                    }}
                />
            </div>
        </Layout>
    )
}

