const PAGE_TITLES: Record<string, string> = {
  "about-us": "About Us",
  "privacy-policy": "Privacy Policy",
  "terms-conditions": "Terms & Conditions",
  "shipping-policy": "Shipping Policy",
  "return-policy": "Return Policy",
};

/**
 * Store CMS pages. Returns title metadata only — no mock placeholder body text.
 * Real page copy lives in dedicated route components (about-us, shipping-policy, etc.).
 */
export const getStorePage = async (storeId: string, pageSlug: string) => {
  try {
    const title =
      PAGE_TITLES[pageSlug] ||
      pageSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return {
      page: {
        id: pageSlug,
        title,
        content: "",
        slug: pageSlug,
        meta_title: `${title} | CNC KRAL`,
        meta_description: `${title} — CNC KRAL`,
        status: "published" as const,
      },
    };
  } catch (error) {
    console.error("Error fetching store page:", error);
    return { page: null };
  }
};
