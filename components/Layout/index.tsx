import React from 'react'
import Footer from '../Footer'
import Image from 'next/image'
import { Toaster } from 'sonner'
import Header from '../Header'
import MobileBottomNav from '../MobileBottomNav'

const normalizePhoneNumber = (phone: string): string => {
    phone = phone.trim()
    if (phone.startsWith('+')) return phone
    if (phone.startsWith('0')) return '+92' + phone.slice(1)
    return phone // optional: handle any fallback case
}

interface LayoutProps {
  children: React.ReactNode
  showFooter?: boolean
}

const Layout = async ({ children, showFooter = true }: LayoutProps) => {
    const storeBase = {
        id: "default-store",
        store_name: "CNC KRAL",
        company_id: "CNC KRAL",
        store_detail: { footer_logo_id: "", currency: "PKR" },
        store_contact_detail: { phone: "" },
        store_components: [],
    };
    const contact = storeBase.store_contact_detail.phone;
    const whatsappLink = contact ? `https://wa.me/${normalizePhoneNumber(contact).replace('+', '')}` : null

    // Fetch company logo from ERPNext API
    let companyLogo = null;
    try {
        const companyId = storeBase.company_id;
        const erpDomain = process.env.NEXT_PUBLIC_ERPNEXT_DOMAIN;
        const apiKey = process.env.NEXT_PUBLIC_ERPNEXT_API_KEY;
        const apiSecret = process.env.NEXT_PUBLIC_ERPNEXT_API_SECRET;

        if (erpDomain && apiKey && apiSecret) {
            const encodedName = encodeURIComponent(companyId);
            const companyResponse = await fetch(
                `https://${erpDomain}/api/resource/Company/${encodedName}?fields=["company_logo"]`,
                {
                    headers: {
                        Authorization: `token ${apiKey}:${apiSecret}`,
                        Accept: "application/json",
                    },
                    next: { revalidate: 300 }
                }
            );

            if (companyResponse.ok) {
                const companyData = await companyResponse.json();
                if (companyData?.data?.company_logo) {
                    companyLogo = companyData.data.company_logo;
                }
            }
        }
    } catch (error) {
        console.error("Error fetching company logo:", error);
    }

    // Add company logo to storeData
    const storeDataWithLogo = {
        ...storeBase,
        company_logo: companyLogo
    };

    return (
        <>
            <Header storeData={storeDataWithLogo} />
            <main className="min-h-screen pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
                {children}
            </main>
            <MobileBottomNav />
            {showFooter && (
                <div className="hidden md:block">
                    <Footer storeData={storeDataWithLogo} />
                </div>
            )}
            <Toaster />
            {whatsappLink && (
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed z-50 w-12 h-12 bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] right-4 md:bottom-6 md:right-6"
                >
                    <Image
                        src="/whatsapp-icon.svg" // place the file in your `public/` folder
                        alt="Chat on WhatsApp"
                        width={50}
                        height={50}
                    />
                </a>
            )}
        </>
    )
}

export default Layout