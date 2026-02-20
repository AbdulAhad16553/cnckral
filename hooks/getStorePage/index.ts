// Store page functionality - simplified for ERPNext integration
// In a real implementation, you would create pages in ERPNext or use a CMS

export const getStorePage = async (storeId: string, pageSlug: string) => {
    try {
        const mockPage = {
            id: pageSlug,
            title: pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1),
            content: `This is the ${pageSlug} page content.`,
            slug: pageSlug,
            meta_title: `${pageSlug} - Store Page`,
            meta_description: `Learn more about ${pageSlug} on our store.`,
            status: 'published' as const
        };

        return { page: mockPage };
    } catch (error) {
        console.error('Error fetching store page:', error);
        return { page: null };
    }
};