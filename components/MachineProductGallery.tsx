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

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseDescriptionBlocks(html?: string): DescriptionBlock[] {
  if (!html || !html.trim()) return [];
  if (typeof window === "undefined") return [];

  const decoded = decodeHtmlEntities(html);
  const div = document.createElement("div");
  div.innerHTML = decoded;

  const blocks: DescriptionBlock[] = [];
  const sections = div.querySelectorAll('section, .section, [class*="section"]');

  if (sections.length > 0) {
    sections.forEach((section) => {
      const h2 = section.querySelector("h2, h3");
      const title = h2?.textContent?.trim() || "";
      const contentParts: string[] = [];
      for (const child of Array.from(section.children)) {
        if (child.tagName === "H2" || child.tagName === "H3") continue;
        contentParts.push(child.outerHTML);
      }
      const blockHtml = contentParts.join("");
      if (title || blockHtml.trim()) blocks.push({ title, html: blockHtml });
    });
  }

  if (blocks.length === 0) {
    div.querySelectorAll("h2, h3").forEach((h) => {
      const title = h.textContent?.trim() || "";
      const bodyParts: string[] = [];
      let next = h.nextElementSibling;
      while (next && !/^H[2-3]$/i.test(next.tagName)) {
        bodyParts.push(next.outerHTML || next.textContent || "");
        next = next.nextElementSibling;
      }
      blocks.push({ title, html: bodyParts.join("") });
    });
  }

  return blocks;
}

interface DescriptionBlock {
  title?: string;
  html: string;
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

  const rows = useMemo(() => {
    const imgs = imageAttachments.map((a) => ({
      url: getErpnextImageUrl(a.file_url),
      alt: a.file_name || product.item_name,
    }));

    const blocks = descriptionBlocks.length > 0 
      ? descriptionBlocks 
      : [{ title: "Product Overview", html: product.description || "" }];

    return blocks.map((block, i) => ({
      image: imgs.length > 0 ? imgs[i % imgs.length] : null,
      block,
    }));
  }, [imageAttachments, descriptionBlocks, product.item_name, product.description]);

  if (!isMachine || rows.length === 0) return null;

  const bgColors = ["bg-sky-50", "bg-slate-100", "bg-sky-100/80", "bg-slate-50", "bg-sky-50"];
  return (
    <div className="font-sans">
      {/* Dynamic Sections */}
      {rows.map((row, index) => {
        const isEven = index % 2 === 0;
        const bg = bgColors[index % bgColors.length];

        return (
          <section key={index} className={`relative py-12 md:py-16 border-b border-slate-200/80 overflow-hidden ${bg}`}>
            <div className="container mx-auto px-6 max-w-7xl">
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                
                {/* Visual Side */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="w-full lg:w-1/2"
                >
                  {row.image ? (
                    <div className="relative group aspect-video lg:aspect-square max-h-[400px] overflow-hidden rounded-xl bg-white border border-slate-200 shadow-md">
                      <Image
                        src={row.image.url}
                        alt={row.image.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-100 rounded-xl border border-dashed border-slate-300 flex items-center justify-center">
                      <span className="text-slate-500 italic text-sm">Industrial Feature</span>
                    </div>
                  )}
                </motion.div>

                {/* Content Side */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="w-full lg:w-1/2 space-y-6"
                >
                  <div className="inline-flex items-center space-x-3">
                    <span className="text-blue-600 font-mono text-sm tracking-widest uppercase font-bold">
                      Feature 0{index + 1}
                    </span>
                    <div className="h-px w-12 bg-blue-500/50" />
                  </div>

                  {row.block.title && (
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                      {row.block.title}
                    </h2>
                  )}

                  <div
                    className="prose prose-slate max-w-none 
                    prose-p:text-slate-600 prose-p:text-base prose-p:leading-relaxed
                    prose-strong:text-slate-800 prose-ul:list-disc prose-li:text-slate-600
                    prose-table:border-slate-200 prose-th:bg-slate-100 prose-th:text-slate-800
                    [&_table]:w-full [&_table]:rounded-lg [&_table]:overflow-hidden [&_table]:my-6
                    [&_td]:p-3 [&_th]:p-3 [&_td]:border-slate-200 [&_td]:text-slate-600"
                    dangerouslySetInnerHTML={{ __html: row.block.html }}
                  />
                </motion.div>
              </div>
            </div>
            
            {/* Background Decorative Element */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-200/40 via-transparent to-transparent" />
            </div>
          </section>
        );
      })}
    </div>
  );
}