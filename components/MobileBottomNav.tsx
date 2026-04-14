"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Wrench, ShoppingCart, Info, Phone } from "lucide-react";
import { useCartCount } from "@/hooks/useCartCount";
import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    match: (p: string) => p === "/",
  },
  {
    href: "/category",
    label: "Categories",
    icon: LayoutGrid,
    match: (p: string) => p === "/category" || p.startsWith("/category/"),
  },
  {
    href: "/machine",
    label: "Machine",
    icon: Wrench,
    match: (p: string) => p.startsWith("/machine"),
  },
  {
    href: "/cart",
    label: "Cart",
    icon: ShoppingCart,
    match: (p: string) => p.startsWith("/cart"),
  },
  {
    href: "/about-us",
    label: "About us",
    icon: Info,
    match: (p: string) => p.startsWith("/about-us"),
  },
  {
    href: "/contact",
    label: "Contact",
    icon: Phone,
    match: (p: string) => p.startsWith("/contact"),
  },
] as const;

export default function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const cartCount = useCartCount();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[60] border-t border-neutral-200 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] [-webkit-tap-highlight-color:transparent]"
      aria-label="Main navigation"
    >
      <div className="flex h-14 max-w-lg mx-auto items-stretch justify-around px-0.5">
        {tabs.map((tab) => {
          const { label, icon: Icon, match } = tab;
          const active = match(pathname);
          const { href } = tab as { href: string };
          const showCartBadge = href === "/cart" && cartCount > 0;

          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className={cn(
                "relative flex min-w-0 flex-1 select-none flex-col items-center justify-center gap-0.5 py-1 touch-manipulation transition-colors",
                active ? "text-[var(--primary-color,#0368E5)]" : "text-neutral-500"
              )}
            >
              <span className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    active ? "stroke-[2.5px]" : "stroke-2"
                  )}
                  aria-hidden
                />
                {showCartBadge && (
                  <span className="absolute -top-1.5 -right-2 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold leading-none text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>
              <span className="max-w-full truncate px-0.5 text-[9px] font-medium leading-none">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
