"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { getErpnextImageUrl } from "@/lib/erpnextImageUtils";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];

function isImageAttachment(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return IMAGE_EXT.some((ext) => lower.endsWith(ext));
}

/** Block from description: one per section, title (h2) + HTML content */
interface DescriptionBlock {
  title?: string;
  html: string;
}

/** Decode HTML entities so parser can find real elements (handles ERPNext escaped HTML) */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** Parse HSG-style description: one block per section (5 sections). */
function parseDescriptionBlocks(html?: string): DescriptionBlock[] {
  if (!html || !html.trim()) return [];

  if (typeof window === "undefined" || typeof document === "undefined") return [];

  // Decode entities so <section> is parsed as HTML, not text
  const decoded = decodeHtmlEntities(html);
  const firstTag = decoded.indexOf("<");
  const htmlToParse = firstTag >= 0 ? decoded.slice(firstTag) : decoded;

  // Use div+innerHTML so browser decodes entities and parses real elements
  const div = document.createElement("div");
  div.innerHTML = htmlToParse;

  const blocks: DescriptionBlock[] = [];
  const sections = div.querySelectorAll('section, div.section, div[class*="section"]');

  if (sections.length > 0) {
    sections.forEach((section) => {
      const h2 = section.querySelector("h2");
      const title = h2?.textContent?.trim() || "";
      const contentParts: string[] = [];
      for (const child of Array.from(section.children)) {
        if (child.tagName === "H2") continue;
        contentParts.push(child.outerHTML);
      }
      const blockHtml = contentParts.join("");
      if (title || blockHtml.trim()) blocks.push({ title, html: blockHtml });
    });
  }

  // Fallback: h2/h3/h4/h5 + following content
  if (blocks.length === 0) {
    div.querySelectorAll("h2, h3, h4, h5").forEach((h) => {
      const title = h.textContent?.trim() || "";
      const bodyParts: string[] = [];
      let next = h.nextElementSibling;
      while (next && !/^H[2-5]$/i.test(next.tagName)) {
        bodyParts.push(next.outerHTML || next.textContent || "");
        next = next.nextElementSibling;
      }
      if (title || bodyParts.join("")) blocks.push({ title, html: bodyParts.join("") });
    });
  }

  return blocks;
}

interface MachineProductGalleryProps {
  product: {
    item_name: string;
    description?: string;
    attachments?: Array<{
      name: string;
      file_name: string;
      file_url: string;
    }>;
  };
  isMachine?: boolean;
}

export default function MachineProductGallery({
  product,
  isMachine = false,
}: MachineProductGalleryProps) {
  const imageAttachments = useMemo(() => {
    if (!product.attachments) return [];
    return product.attachments.filter((a) => isImageAttachment(a.file_name));
  }, [product.attachments]);

  const descriptionBlocks = useMemo(
    () => parseDescriptionBlocks(product.description),
    [product.description]
  );

  // Build rows: one div per content block. Image: if 1 use in all; if multiple rotate; if none, no image.
  const rows = useMemo(() => {
    const imgs = imageAttachments.map((a) => ({
      url: getErpnextImageUrl(a.file_url),
      alt: a.file_name || product.item_name,
    }));

    const rawDesc = product.description || "";
    const fallbackHtml = rawDesc ? decodeHtmlEntities(rawDesc) : `<p>${product.item_name}</p>`;

    const blocks =
      descriptionBlocks.length > 0
        ? descriptionBlocks
        : [{ title: product.item_name, html: fallbackHtml }];

    return blocks.map((block, i) => ({
      image: imgs.length > 0 ? (imgs.length === 1 ? imgs[0] : imgs[i % imgs.length]) : null,
      block: {
        title: block.title,
        html: block.html || fallbackHtml,
      },
    }));
  }, [
    imageAttachments,
    descriptionBlocks,
    product.item_name,
    product.description,
  ]);

  if (!isMachine) return null;
  if (rows.length === 0) return null;

  // Professional alternating backgrounds: refined slate with subtle depth
  const bgColors = [
    "bg-gradient-to-br from-slate-800 to-slate-800/95",
    "bg-gradient-to-br from-slate-800/95 to-slate-900",
    "bg-gradient-to-br from-slate-800 to-slate-800/95",
    "bg-gradient-to-br from-slate-800/95 to-slate-900",
    "bg-gradient-to-br from-slate-800 to-slate-800/95",
  ];

  return (
    <div className="space-y-4">
      {rows.map((row, index) => {
        const bg = bgColors[index % bgColors.length];
        const imageLeft = index % 2 === 0;
        const sectionNum = index + 1;

        return (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative overflow-hidden rounded-xl border border-slate-600/30 shadow-xl ${bg}`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600/80" />

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch p-5 sm:p-6 pl-6 sm:pl-7 ${
                !row.image && "md:grid-cols-1"
              }`}
            >
              {row.image && (
                <motion.div
                  initial={{ opacity: 0, x: imageLeft ? -16 : 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.35, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`relative aspect-[16/10] min-h-[180px] overflow-hidden rounded-lg bg-slate-900/60 ring-1 ring-white/5 flex-1 ${
                    imageLeft ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <Image
                    src={row.image.url}
                    alt={row.image.alt}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: imageLeft ? 16 : -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`flex flex-1 flex-col justify-center min-w-0 ${
                  imageLeft ? "md:order-2" : "md:order-1"
                }`}
              >
                {row.block.title && (
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-blue-500/25 text-xs font-bold text-blue-300">
                      {sectionNum}
                    </span>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">
                      {row.block.title}
                    </h2>
                  </div>
                )}
                <div
                  className="prose prose-invert prose-slate max-w-none text-sm sm:text-base leading-relaxed [&_h3]:text-white [&_h4]:text-white [&_h5]:text-white [&_h3]:font-semibold [&_h4]:font-semibold [&_h5]:font-semibold [&_h3]:text-base [&_h4]:text-sm [&_h5]:text-sm [&_p]:text-slate-300 [&_p]:my-2 [&_strong]:text-white prose-table:my-4 prose-table:w-full prose-table:border-collapse prose-table:rounded-lg prose-table:overflow-hidden prose-th:border prose-th:border-slate-600 prose-th:bg-slate-700/90 prose-th:px-3 prose-th:py-2 prose-th:text-xs prose-th:font-semibold prose-th:text-white prose-th:uppercase prose-td:border prose-td:border-slate-600 prose-td:px-3 prose-td:py-2 prose-td:text-slate-300 prose-li:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: row.block.html }}
                />
              </motion.div>
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
