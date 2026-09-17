import React, { Suspense } from 'react'
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

const Layout = ({ children, showFooter = true }: LayoutProps) => {
    const storeBase = {
        id: "default-store",
        store_name: "CNC KRAL",
        company_id: "CNC KRAL",
        store_components: [],
    };
    const contact = "03103170270";
    const whatsappMessage =
      "Hi CNC KRAL, I visited cnckral.com and I need detail/query about your CNC machines and tools.";
    const whatsappLink = contact
      ? `https://wa.me/${normalizePhoneNumber(contact).replace("+", "")}?text=${encodeURIComponent(whatsappMessage)}`
      : null;

    const storeDataWithLogo = {
        ...storeBase,
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
                    <Suspense fallback={<div className="h-40 bg-neutral-100" aria-hidden />}>
                        <Footer storeData={storeDataWithLogo} />
                    </Suspense>
                </div>
            )}
            <Toaster />
            {whatsappLink && (
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp 03103170270"
                    className="fixed z-[55] w-14 h-14 bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] right-4 md:bottom-6 md:right-6 active:scale-95 transition-transform"
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