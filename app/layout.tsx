import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getUrlWithScheme } from "@/lib/getUrlWithScheme";
import { headers } from "next/headers";
import CacheInitializer from "@/components/CacheInitializer";

// Configure Inter font with fallbacks and error handling
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  adjustFontFallback: true,
  preload: true,
});

export const metadata: Metadata = {
  title: "krallaser",
  description: "Laser Cutting and Marking Solutions",
  icons: {
    icon: "/krallaser.jpeg",
    shortcut: "/krallaser.jpeg",
    apple: "/krallaser.jpeg",
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
          <title>{"krallaser"}</title>
          <meta
            name="description"
            content={
              "Laser Cutting and Marking Solutions"
            }
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/krallaser.jpeg" type="image/jpeg" />
          <link rel="shortcut icon" href="/krallaser.jpeg" type="image/jpeg" />
          <link rel="apple-touch-icon" href="/krallaser.jpeg" />
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
                --primary-color: #EF4444;
                --secondary-color: #374151;
              }
            `}
          </style>
        </head>
        <body className={inter.className} cz-shortcut-listen="true">
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
          <title>krallaser</title>
          <meta name="description" content="Laser Cutting and Marking Solutions" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/krallaser.jpeg" type="image/jpeg" />
          <link rel="shortcut icon" href="/krallaser.jpeg" type="image/jpeg" />
          <link rel="apple-touch-icon" href="/krallaser.jpeg" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </head>
        <body className={inter.className} cz-shortcut-listen="true">
          <CacheInitializer />
          {children}
        </body>
      </html>
    );
  }
}
