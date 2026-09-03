import Layout from "@/components/Layout"
import CheckOut from "@/modules/Checkout";
import { getRequestOrigin } from "@/lib/requestOrigin";

export default async function CheckoutPage() {
    const fullStoreUrl = await getRequestOrigin();

    const response = await fetch(`${fullStoreUrl}/api/fetchStore`);
    const data = await response.json();

    const store = data?.store?.stores?.[0]
    const storeCurrency = data?.store?.stores[0].store_detail?.currency ? data?.store?.stores[0].store_detail?.currency : "Rs.";

    return (
        <Layout>
            <CheckOut
                necessary={{
                    companyId: store?.company_id,
                    storeId: store?.id,
                }}
                storeCurrency={storeCurrency}
            />
        </Layout>
    )
}

