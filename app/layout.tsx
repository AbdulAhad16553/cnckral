import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import CacheInitializer from "@/components/CacheInitializer";

// Plus Jakarta Sans - professional, clean, excellent readability
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  adjustFontFallback: true,
  preload: true,
});

export const metadata: Metadata = {
  title: "CNC KRAL",
  description: "Tools, Machinery, and Equipment for the Metalworking Industry",
  icons: {
    icon: "/cnc_kral.png",
    shortcut: "/cnc_kral.png",
    apple: "/cnc_kral.png",
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
          <title>{"CNC KRAL"}</title>
          <meta
            name="description"
            content={
              "Tools, Machinery, and Equipment for the Metalworking Industry"
            }
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          {children}
        </body>
      </html>
    );
  } catch (error) {
    console.error("Error in layout:", error);
    
    // Fallback layout in case of error
    return (
      <html lang="en">
        <head>
          <title>CNC KRAL</title>
          <meta name="description" content="Tools, Machinery, and Equipment for the Metalworking Industry" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          {children}
        </body>
      </html>
    );
  }
}
