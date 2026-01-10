import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
  title: "CNC Kral",
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
          <title>{"CNC Kral"}</title>
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
          <title>CNC Kral</title>
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
        <body className={inter.className} cz-shortcut-listen="true">
          <CacheInitializer />
          {children}
        </body>
      </html>
    );
  }
}
