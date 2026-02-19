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

/** Block from description: title (h2/h4/h5) + HTML content */
interface DescriptionBlock {
  title?: string;
  html: string;
}

/** Parse HSG-style description: section, h2, h4, h5 + content (https://www.hsglaser.com/product/laser-cutting-machine-cb.html) */
function parseDescriptionBlocks(html?: string): DescriptionBlock[] {
  if (!html || !html.trim()) return [];

  // Strip leading plain text (e.g. "Edge Banding Glue") before first HTML tag
  const firstTag = html.indexOf("<");
  const htmlToParse = firstTag > 0 ? html.slice(firstTag) : html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlToParse, "text/html");
  const blocks: DescriptionBlock[] = [];

  const sections = doc.querySelectorAll("section");
  if (sections.length > 0) {
    sections.forEach((section) => {
      const h2 = section.querySelector("h2");
      const sectionTitle = h2?.textContent?.trim();

      // p.lead (Product Introduction) – strong = title, rest = body
      const leadP = section.querySelector("p.lead");
      if (leadP) {
        const strong = leadP.querySelector("strong");
        const title = strong?.textContent?.trim().replace(/:$/, "") || sectionTitle;
        const body = leadP.innerHTML;
        if (title || body) blocks.push({ title, html: body });
        return;
      }

      // Table (Technical Specifications)
      const table = section.querySelector("table");
      if (table) {
        blocks.push({
          title: sectionTitle || "Technical Specifications",
          html: table.outerHTML,
        });
        return;
      }

      // h4 + following p (e.g. Dual Pneumatic Concave Wheel Support)
      const h4s = section.querySelectorAll("h4");
      if (h4s.length > 0) {
        h4s.forEach((h4) => {
          const title = h4.textContent?.trim();
          const bodyParts: string[] = [];
          let next = h4.nextElementSibling;
          while (next && !["H4", "H5"].includes(next.tagName)) {
            bodyParts.push(next.outerHTML || next.textContent || "");
            next = next.nextElementSibling;
          }
          if (title || bodyParts.join("")) blocks.push({ title, html: bodyParts.join("") });
        });
        return;
      }

      // h5 + following p (e.g. Modular Workbench Design, AlphaA Bus System)
      const h5s = section.querySelectorAll("h5");
      if (h5s.length > 0) {
        h5s.forEach((h5) => {
          const title = h5.textContent?.trim();
          const bodyParts: string[] = [];
          let next = h5.nextElementSibling;
          while (next && !["H4", "H5"].includes(next.tagName)) {
            bodyParts.push(next.outerHTML || next.textContent || "");
            next = next.nextElementSibling;
          }
          if (title || bodyParts.join("")) blocks.push({ title, html: bodyParts.join("") });
        });
        return;
      }

      // h2 + first p (e.g. 4. Upgraded Matrix Machine Bed)
      const firstP = section.querySelector("p");
      if (sectionTitle && firstP) {
        blocks.push({ title: sectionTitle, html: firstP.outerHTML });
      }
    });
  }

  // Fallback: any h2/h3/h4/h5 + following content
  if (blocks.length === 0) {
    const headings = doc.querySelectorAll("h2, h3, h4, h5");
    headings.forEach((h) => {
      const title = h.textContent?.trim() || "";
      const bodyParts: string[] = [];
      let next = h.nextElementSibling;
      while (next && !/^H[2-5]$/.test(next.tagName)) {
        bodyParts.push(next.outerHTML || next.textContent || "");
        next = next.nextElementSibling;
      }
      const body = bodyParts.join("");
      if (title || body) blocks.push({ title, html: body });
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

  // Build rows: one per content block. Image: if 1 image use in ALL divs; if multiple rotate.
  const rows = useMemo(() => {
    const imgs = imageAttachments.map((a) => ({
      url: getErpnextImageUrl(a.file_url),
      alt: a.file_name || product.item_name,
    }));
    if (imgs.length === 0) return [];

    const fallbackHtml = product.description
      ? product.description
      : `<p>${product.item_name}</p>`;

    // If no parsed blocks, create one row per image with fallback
    const blocks =
      descriptionBlocks.length > 0
        ? descriptionBlocks
        : imgs.map(() => ({ title: product.item_name, html: fallbackHtml }));

    return blocks.map((block, i) => ({
      image: imgs.length === 1 ? imgs[0] : imgs[i % imgs.length],
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

  if (!isMachine || imageAttachments.length < 1) return null;
  if (rows.length === 0) return null;

  // Blue and grey alternating (HSG-style)
  const bgColors = [
    "bg-slate-50",
    "bg-blue-50",
    "bg-slate-100",
    "bg-blue-100/60",
    "bg-slate-200/50",
  ];

  return (
    <div className="space-y-4">
      {rows.map((row, index) => {
        const bg = bgColors[index % bgColors.length];
        const imageLeft = index % 2 === 0;

        return (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-xl overflow-hidden border border-slate-200/60 ${bg}`}
          >
            <div
              className={`grid gap-6 md:gap-10 items-center p-6 sm:p-8 md:p-10 ${
                row.image
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {/* Image – if 1 image used in all divs, if multiple rotates */}
              {row.image && (
                <motion.div
                  initial={{ opacity: 0, x: imageLeft ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                  className={`relative aspect-[16/10] rounded-lg overflow-hidden bg-white shadow-sm min-h-[200px] ${
                    imageLeft ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <Image
                    src={row.image.url}
                    alt={row.image.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              )}

              {/* Content – h5 heading + paragraph */}
              <motion.div
                initial={{ opacity: 0, x: imageLeft ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className={`flex flex-col justify-center ${
                  imageLeft ? "md:order-2" : "md:order-1"
                }`}
              >
                {row.block.title && (
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 border-b-2 border-blue-600 pb-2 inline-block">
                    {row.block.title}
                  </h3>
                )}
                <div
                  className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed prose-headings:text-slate-900 prose-strong:text-slate-800 prose-p:my-2 prose-table:my-4 prose-table:border-collapse prose-th:border prose-th:border-slate-300 prose-th:bg-slate-100 prose-th:px-4 prose-th:py-2 prose-td:border prose-td:border-slate-300 prose-td:px-4 prose-td:py-2"
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
