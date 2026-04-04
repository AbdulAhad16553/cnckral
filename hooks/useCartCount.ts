"use client";

import { useState, useEffect } from "react";

export function useCartCount(): number {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const stored = sessionStorage.getItem("cart");
      const items = stored ? JSON.parse(stored) : [];
      setCartCount(Array.isArray(items) ? items.length : 0);
    };

    updateCartCount();
    window.addEventListener("load", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("load", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return cartCount;
}
