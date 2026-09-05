import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import CacheInitializer from "@/components/CacheInitializer";
// import PWARegister from "@/components/PWARegister";
// import ChatBox from "@/components/ChatBox";

const META_PIXEL_ID = "1032995173509399";

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
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/cnc_kral-48.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: "CNC KRAL",
    title: "CNC KRAL | Best CNC Supplier, CNC Machine, Router, Bits & Marble Tools in Pakistan",
    description:
      "Best CNC supplier in Pakistan. CNC machines, CNC routers, CNC bits, marble tools. Lahore.",
    images: [{ url: "/apple-touch-icon.png", width: 180, height: 180, alt: "CNC KRAL" }],
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
                logo: `${SITE_URL}/apple-touch-icon.png`,
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
            <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
          <link rel="shortcut icon" href="/favicon-32.png" type="image/png" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
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
        <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon-32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
        <body className={`${plusJakarta.variable} ${plusJakarta.className}`} cz-shortcut-listen="true">
          <Script id="meta-pixel-fallback" strategy="afterInteractive">
            {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
          <CacheInitializer />
          {/* <PWARegister /> */}
          {children}
          {/* <ChatBox /> */}
        </body>
      </html>
    );
  }
}
