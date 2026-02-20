// "use client";

// import React, { useMemo } from "react";
// import Image from "next/image";
// import { motion } from "motion/react";
// import { getErpnextImageUrl } from "@/lib/erpnextImageUtils";

// const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];

// function isImageAttachment(fileName: string): boolean {
//   const lower = fileName.toLowerCase();
//   return IMAGE_EXT.some((ext) => lower.endsWith(ext));
// }

// /** Block from description: one per section, title (h2) + HTML content */
// interface DescriptionBlock {
//   title?: string;
//   html: string;
// }

// /** Decode HTML entities so parser can find real elements (handles ERPNext escaped HTML) */
// function decodeHtmlEntities(str: string): string {
//   return str
//     .replace(/&lt;/gi, "<")
//     .replace(/&gt;/gi, ">")
//     .replace(/&amp;/g, "&")
//     .replace(/&quot;/g, '"')
//     .replace(/&#39;/g, "'");
// }

// /** Parse HSG-style description: one block per section (5 sections). */
// function parseDescriptionBlocks(html?: string): DescriptionBlock[] {
//   if (!html || !html.trim()) return [];

//   if (typeof window === "undefined" || typeof document === "undefined") return [];

//   // Decode entities so <section> is parsed as HTML, not text
//   const decoded = decodeHtmlEntities(html);
//   const firstTag = decoded.indexOf("<");
//   const htmlToParse = firstTag >= 0 ? decoded.slice(firstTag) : decoded;

//   // Use div+innerHTML so browser decodes entities and parses real elements
//   const div = document.createElement("div");
//   div.innerHTML = htmlToParse;

//   const blocks: DescriptionBlock[] = [];
//   const sections = div.querySelectorAll('section, div.section, div[class*="section"]');

//   if (sections.length > 0) {
//     sections.forEach((section) => {
//       const h2 = section.querySelector("h2");
//       const title = h2?.textContent?.trim() || "";
//       const contentParts: string[] = [];
//       for (const child of Array.from(section.children)) {
//         if (child.tagName === "H2") continue;
//         contentParts.push(child.outerHTML);
//       }
//       const blockHtml = contentParts.join("");
//       if (title || blockHtml.trim()) blocks.push({ title, html: blockHtml });
//     });
//   }

//   // Fallback: h2/h3/h4/h5 + following content
//   if (blocks.length === 0) {
//     div.querySelectorAll("h2, h3, h4, h5").forEach((h) => {
//       const title = h.textContent?.trim() || "";
//       const bodyParts: string[] = [];
//       let next = h.nextElementSibling;
//       while (next && !/^H[2-5]$/i.test(next.tagName)) {
//         bodyParts.push(next.outerHTML || next.textContent || "");
//         next = next.nextElementSibling;
//       }
//       if (title || bodyParts.join("")) blocks.push({ title, html: bodyParts.join("") });
//     });
//   }

//   return blocks;
// }

// interface MachineProductGalleryProps {
//   product: {
//     item_name: string;
//     description?: string;
//     attachments?: Array<{
//       name: string;
//       file_name: string;
//       file_url: string;
//     }>;
//   };
//   isMachine?: boolean;
// }

// export default function MachineProductGallery({
//   product,
//   isMachine = false,
// }: MachineProductGalleryProps) {
//   const imageAttachments = useMemo(() => {
//     if (!product.attachments) return [];
//     return product.attachments.filter((a) => isImageAttachment(a.file_name));
//   }, [product.attachments]);

//   const descriptionBlocks = useMemo(
//     () => parseDescriptionBlocks(product.description),
//     [product.description]
//   );

//   // Build rows: one div per content block. Image: if 1 use in all; if multiple rotate; if none, no image.
//   const rows = useMemo(() => {
//     const imgs = imageAttachments.map((a) => ({
//       url: getErpnextImageUrl(a.file_url),
//       alt: a.file_name || product.item_name,
//     }));

//     const rawDesc = product.description || "";
//     const fallbackHtml = rawDesc ? decodeHtmlEntities(rawDesc) : `<p>${product.item_name}</p>`;

//     const blocks =
//       descriptionBlocks.length > 0
//         ? descriptionBlocks
//         : [{ title: product.item_name, html: fallbackHtml }];

//     return blocks.map((block, i) => ({
//       image: imgs.length > 0 ? (imgs.length === 1 ? imgs[0] : imgs[i % imgs.length]) : null,
//       block: {
//         title: block.title,
//         html: block.html || fallbackHtml,
//       },
//     }));
//   }, [
//     imageAttachments,
//     descriptionBlocks,
//     product.item_name,
//     product.description,
//   ]);

//   if (!isMachine) return null;
//   if (rows.length === 0) return null;

//   // Professional alternating backgrounds: refined slate with subtle depth
//   const bgColors = [
//     "bg-gradient-to-br from-slate-800 to-slate-800/95",
//     "bg-gradient-to-br from-slate-800/95 to-slate-900",
//     "bg-gradient-to-br from-slate-800 to-slate-800/95",
//     "bg-gradient-to-br from-slate-800/95 to-slate-900",
//     "bg-gradient-to-br from-slate-800 to-slate-800/95",
//   ];

//   return (
//     <div className="space-y-3">
//       {rows.map((row, index) => {
//         const bg = bgColors[index % bgColors.length];
//         const imageLeft = index % 2 === 0;
//         const sectionNum = index + 1;

//         return (
//           <motion.section
//             key={index}
//             initial={{ opacity: 0, y: 16 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: "-24px" }}
//             transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
//             className={`relative overflow-hidden rounded-lg border border-slate-600/30 shadow-lg ${bg}`}
//           >
//             <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-blue-600/80" />

//             <div
//               className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-4 sm:p-5 pl-5 sm:pl-6 ${
//                 !row.image && "md:grid-cols-1"
//               }`}
//             >
//               {row.image && (
//                 <motion.div
//                   initial={{ opacity: 0, x: imageLeft ? -12 : 12 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true, margin: "-24px" }}
//                   transition={{ duration: 0.3, delay: 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
//                   className={`relative h-[120px] sm:h-[140px] w-full max-w-[280px] overflow-hidden rounded-md bg-slate-900/60 ring-1 ring-white/5 ${
//                     imageLeft ? "md:order-1" : "md:order-2 md:ml-auto"
//                   }`}
//                 >
//                   <Image
//                     src={row.image.url}
//                     alt={row.image.alt}
//                     fill
//                     className="object-contain p-1"
//                     sizes="(max-width: 768px) 100vw, 280px"
//                   />
//                 </motion.div>
//               )}

//               <motion.div
//                 initial={{ opacity: 0, x: imageLeft ? 12 : -12 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true, margin: "-24px" }}
//                 transition={{ duration: 0.3, delay: 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
//                 className={`flex flex-1 flex-col justify-center min-w-0 ${
//                   imageLeft ? "md:order-2" : "md:order-1"
//                 }`}
//               >
//                 {row.block.title && (
//                   <div className="mb-3 flex items-center gap-2">
//                     <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-500/25 text-[10px] font-bold text-blue-300">
//                       {sectionNum}
//                     </span>
//                     <h2 className="text-base sm:text-lg font-semibold text-white leading-tight">
//                       {row.block.title}
//                     </h2>
//                   </div>
//                 )}
//                 <div
//                   className="[&_h3]:text-white [&_h4]:text-white [&_h5]:text-white [&_h3]:font-semibold [&_h4]:font-semibold [&_h5]:font-semibold [&_h3]:text-sm [&_h4]:text-sm [&_h5]:text-xs [&_h3]:mt-2 [&_h4]:mt-2 [&_h5]:mt-1.5 [&_p]:text-slate-300 [&_p]:text-sm [&_p]:leading-[1.6] [&_p]:my-1.5 [&_strong]:text-white [&_ul]:text-slate-300 [&_ul]:text-sm [&_ul]:my-2 [&_ul]:space-y-0.5 [&_ol]:text-slate-300 [&_ol]:text-sm prose-table:my-3 prose-table:w-full prose-table:border-collapse prose-table:rounded prose-table:overflow-hidden prose-th:border prose-th:border-slate-600 prose-th:bg-slate-700/90 prose-th:px-2.5 prose-th:py-1.5 prose-th:text-[11px] prose-th:font-semibold prose-th:text-white prose-th:uppercase prose-th:tracking-wide prose-td:border prose-td:border-slate-600 prose-td:px-2.5 prose-td:py-1.5 prose-td:text-slate-300 prose-td:text-sm"
//                   dangerouslySetInnerHTML={{ __html: row.block.html }}
//                 />
//               </motion.div>
//             </div>
//           </motion.section>
//         );
//       })}
//     </div>
//   );
// }
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

  // HSG Laser exact styling - clean white background with subtle borders
  const bgColors = [
    "bg-white",
    "bg-white",
    "bg-white",
    "bg-white",
    "bg-white",
  ];

  return (
    <div className="space-y-0 max-w-7xl mx-auto">
      {rows.map((row, index) => {
        const bg = bgColors[index % bgColors.length];
        const imageLeft = index % 2 === 0;
        const sectionNum = index + 1;

        return (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-24px" }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative overflow-hidden ${bg} ${
              index > 0 ? "border-t border-gray-200" : ""
            }`}
          >
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-600 to-blue-700" />

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-6 py-10 md:px-12 lg:px-16 ${
                !row.image && "md:grid-cols-1"
              }`}
            >
              {row.image && (
                <motion.div
                  initial={{ opacity: 0, x: imageLeft ? -12 : 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-24px" }}
                  transition={{ duration: 0.3, delay: 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`relative h-[180px] sm:h-[220px] w-full max-w-[400px] overflow-hidden rounded-lg ${
                    imageLeft ? "md:order-1 md:justify-self-start" : "md:order-2 md:justify-self-end"
                  }`}
                >
                  <Image
                    src={row.image.url}
                    alt={row.image.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: imageLeft ? 12 : -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-24px" }}
                transition={{ duration: 0.3, delay: 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`flex flex-1 flex-col justify-center min-w-0 ${
                  imageLeft ? "md:order-2" : "md:order-1"
                }`}
              >
                {row.block.title && (
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
                        Feature {sectionNum.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      {row.block.title}
                    </h2>
                  </div>
                )}
                <div
                  className="[&_h3]:text-gray-900 [&_h4]:text-gray-900 [&_h5]:text-gray-900 [&_h3]:font-semibold [&_h4]:font-semibold [&_h5]:font-semibold [&_h3]:text-lg [&_h4]:text-base [&_h5]:text-sm [&_h3]:mt-4 [&_h4]:mt-3 [&_h5]:mt-2 [&_p]:text-gray-600 [&_p]:text-base [&_p]:leading-relaxed [&_p]:my-3 [&_strong]:text-gray-900 [&_strong]:font-semibold [&_ul]:text-gray-600 [&_ul]:text-base [&_ul]:my-3 [&_ul]:space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:text-gray-600 [&_ol]:text-base [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:pl-1 [&_li]:marker:text-blue-600 prose-table:my-4 prose-table:w-full prose-table:border-collapse prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-sm prose-th:border prose-th:border-gray-200 prose-th:bg-gray-50 prose-th:px-4 prose-th:py-3 prose-th:text-xs prose-th:font-semibold prose-th:text-gray-600 prose-th:uppercase prose-th:tracking-wider prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-3 prose-td:text-gray-600 prose-td:text-sm"
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