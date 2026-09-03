import type React from "react";
import { Facebook, Instagram } from "lucide-react";
import { getRequestOrigin } from "@/lib/requestOrigin";

export default async function ComingSoonPage() {
    const fullStoreUrl = await getRequestOrigin();

    const response = await fetch(`${fullStoreUrl}/api/fetchStore`);
    const data = await response.json();

    const store = data?.store?.stores?.[0];
    const storeSocials = store?.store_socials || [];

    const instagramSocial = storeSocials.find((social: any) => social.platform_name === "instagram");
    const facebookSocial = storeSocials.find((social: any) => social.platform_name === "facebook");

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4">
            <main className="text-center">
                <h1 className="text-5xl font-bold mb-4">Coming Soon</h1>
                <p className="text-xl mb-8">We're working hard to bring you something amazing. Stay tuned!</p>
                <div className="flex justify-center space-x-4">
                    <a
                        href={facebookSocial?.social_link || "#"}
                        target={facebookSocial?.social_link ? "_blank" : "_self"}
                        rel={facebookSocial?.social_link ? "noopener noreferrer" : undefined}
                        className={`hover:text-yellow-500 transition-colors ${!facebookSocial?.social_link ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                        <Facebook size={24} />
                        <span className="sr-only">Facebook</span>
                    </a>

                    <a
                        href={instagramSocial?.social_link || "#"}
                        target={instagramSocial?.social_link ? "_blank" : "_self"}
                        rel={instagramSocial?.social_link ? "noopener noreferrer" : undefined}
                        className={`hover:text-yellow-500 transition-colors ${!instagramSocial?.social_link ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                        <Instagram size={24} />
                        <span className="sr-only">Instagram</span>
                    </a>
                </div>
            </main>

            <footer className="mt-8 text-sm opacity-75">
                {`© ${new Date().getFullYear()} ${store?.store_name || "Our Store"}. All rights reserved by `}
                <a
                    href="https://www.items.pk/"
                    className="hover:text-yellow-500 transition-colors"
                >
                    Items.PK
                </a>
            </footer>
        </div>
    );
}
