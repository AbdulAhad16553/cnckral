import { NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/comingsoon",
        "/cart",
        "/checkout",
        "/profile",
        "/category/:path*",
        // Excluded: /product/* — avoids an extra fetchStore round-trip on every product view (Layout already loads store data)
    ],
};
