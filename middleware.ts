import { NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest) {
    try {
        const host = req.nextUrl.host;
        const storeUrl = host.includes(":") ? process.env.NEXT_PUBLIC_STORE_DOMAIN : `https://${host}`;
        if (!storeUrl) return NextResponse.next();
        const baseUrl = storeUrl.startsWith("http") ? storeUrl : `https://${storeUrl}`;
        await fetch(`${baseUrl}/api/fetchStore`);
        return NextResponse.next();
    } catch (error) {
        console.error("Error fetching store data:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/",
        "/comingsoon",
        "/cart",
        "/checkout",
        "/profile",
        "/category/:path*",
        "/product/:path*",
    ],
};
