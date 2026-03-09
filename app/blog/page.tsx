import type { Metadata } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import { blogArticles } from "@/lib/blogArticles";

export const metadata: Metadata = {
  title: "Blog | CNC Guides, Buying Tips & Industry Insights",
  description:
    "Articles on CNC routers, CNC bits, buying guides, and industrial equipment in Pakistan. From CNC Kral—your CNC router and tools supplier.",
};

export default function BlogPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50">
        <div className="page-container py-10 lg:py-14">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Blog
            </h1>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Guides, buying tips, and insights on CNC routers, bits, and
              industrial equipment in Pakistan.
            </p>
          </header>

          <ul className="space-y-4" role="list">
            {blogArticles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="block p-5 rounded-lg border border-slate-200 bg-white hover:border-[var(--primary-color)]/30 hover:shadow-md transition-all duration-200 group"
                >
                  <h2 className="text-lg font-semibold text-slate-900 group-hover:text-[var(--primary-color)] transition-colors">
                    {article.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                    {article.description}
                  </p>
                  <time
                    dateTime={article.publishedAt}
                    className="mt-2 text-xs text-slate-500"
                  >
                    {new Date(article.publishedAt).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
