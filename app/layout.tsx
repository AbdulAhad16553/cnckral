import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import CacheInitializer from "@/components/CacheInitializer";
// import PWARegister from "@/components/PWARegister";
// import ChatBox from "@/components/ChatBox";

// Plus Jakarta Sans - professional, clean, excellent readability
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  adjustFontFallback: true,
  preload: true,
});

const SITE_URL = "https://cnckral.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CNC KRAL | Best CNC Supplier, CNC Machine, Router, Bits & Marble Tools in Pakistan",
    template: "%s | CNC KRAL",
  },
  description:
    "CNC KRAL is the best CNC supplier in Pakistan. We supply CNC machines, CNC routers, CNC bits, marble tools, and precision cutting tools for woodworking, metalworking, and stone carving. Based in Lahore.",
  keywords: [
    "best CNC supplier Pakistan",
    "best CNC machine Pakistan",
    "best CNC router Pakistan",
    "best CNC bits Pakistan",
    "marble tools Pakistan",
    "CNC bits supplier",
    "CNC machinery Lahore",
    "CNC router Lahore",
  ],
  icons: {
    icon: "/cnc_kral.png",
    shortcut: "/cnc_kral.png",
    apple: "/cnc_kral.png",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: "CNC KRAL",
    title: "CNC KRAL | Best CNC Supplier, CNC Machine, Router, Bits & Marble Tools in Pakistan",
    description:
      "Best CNC supplier in Pakistan. CNC machines, CNC routers, CNC bits, marble tools. Lahore.",
    images: [{ url: "/cnc_kral.png", width: 512, height: 512, alt: "CNC KRAL" }],
  },
  twitter: {
    card: "summary",
    title: "CNC KRAL | Best CNC Supplier, CNC Machine, Router, Bits & Marble Tools in Pakistan",
    description:
      "Best CNC supplier in Pakistan. CNC machines, CNC routers, CNC bits, marble tools. Lahore.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    return (
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* PWA disabled - uncomment these to re-enable installable app */}
          {/* <meta name="theme-color" content="#0368E5" /> */}
          {/* <link rel="manifest" href="/manifest.webmanifest" /> */}
          {/* Organization schema for AI/LLM and search */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "CNC KRAL",
                url: SITE_URL,
                logo: `${SITE_URL}/cnc_kral.png`,
                description:
                  "Best CNC supplier in Pakistan. Suppliers of CNC machines, CNC routers, CNC bits, marble tools, and precision cutting tools for woodworking, metalworking, and stone carving.",
                areaServed: { "@type": "Country", name: "Pakistan" },
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Lahore",
                  addressRegion: "Punjab",
                  addressCountry: "PK",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+92-321-4198406",
                  contactType: "sales",
                  areaServed: "PK",
                  availableLanguage: "English, Urdu",
                },
                knowsAbout: [
                  "CNC machinery",
                  "CNC machines",
                  "CNC routers",
                  "CNC bits",
                  "Marble tools",
                  "Precision tooling",
                  "Cutting tools",
                ],
              }),
            }}
          />
            <link rel="icon" href="/cnc_kral.png" type="image/png" />
          <link rel="shortcut icon" href="/cnc_kral.png" type="image/png" />
          <link rel="apple-touch-icon" href="/cnc_kral.png" />
          {/* Preconnect to Google Fonts for faster loading */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <style>
            {`
              :root {
                --primary-color: #0368E5;
                --secondary-color: #363E47;
                --primary-gradient: linear-gradient(135deg, #0368E5 0%, #363E47 100%);
                --grey-gradient: linear-gradient(135deg, #0368E5 0%, #363E47 100%);
                --primary-hover: #363E47;
              }
            `}
          </style>
        </head>
        <body className={`${plusJakarta.variable} ${plusJakarta.className}`} cz-shortcut-listen="true">
          <CacheInitializer />
          {/* <PWARegister /> */}
          {children}
          {/* <ChatBox /> */}
        </body>
      </html>
    );
  } catch (error) {
    console.error("Error in layout:", error);
    
    // Fallback layout in case of error
    return (
      <html lang="en">
<head>
        <title>CNC KRAL | Best CNC Supplier, CNC Machine, Router, Bits & Marble Tools in Pakistan</title>
        <meta name="description" content="CNC KRAL is the best CNC supplier in Pakistan. CNC machines, CNC routers, CNC bits, marble tools. Lahore." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* PWA disabled - uncomment these to re-enable installable app */}
        {/* <meta name="theme-color" content="#0368E5" /> */}
        {/* <link rel="manifest" href="/manifest.webmanifest" /> */}
        <link rel="icon" href="/cnc_kral.png" type="image/png" />
        <link rel="shortcut icon" href="/cnc_kral.png" type="image/png" />
        <link rel="apple-touch-icon" href="/cnc_kral.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
        <body className={`${plusJakarta.variable} ${plusJakarta.className}`} cz-shortcut-listen="true">
          <CacheInitializer />
          {/* <PWARegister /> */}
          {children}
          {/* <ChatBox /> */}
        </body>
      </html>
    );
  }
}
