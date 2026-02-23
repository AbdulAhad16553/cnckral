"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { stripHtmlForPreview, decodeHtmlEntities } from "@/lib/utils";

const PREVIEW_LENGTH = 160;

interface MachineCardDescriptionProps {
  /** Raw HTML description (may contain entities) */
  html?: string | null;
  className?: string;
}

export default function MachineCardDescription({
  html,
  className = "",
}: MachineCardDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!html || typeof html !== "string") return null;

  const plainText = stripHtmlForPreview(html);
  if (!plainText.trim()) return null;

  const needsExpand = plainText.length > PREVIEW_LENGTH;
  const preview = needsExpand
    ? stripHtmlForPreview(html, PREVIEW_LENGTH)
    : plainText;

  return (
    <div className={className}>
      {!expanded ? (
        <>
          <p className="text-sm text-slate-600 leading-relaxed">
            {preview}
          </p>
          {needsExpand && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpanded(true);
              }}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Read more
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </>
      ) : (
        <>
          <div
            className="prose prose-sm prose-slate max-w-none text-slate-600 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:text-sm [&_p]:leading-relaxed [&_ul]:text-sm [&_ol]:text-sm [&_strong]:text-slate-800"
            dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(html) }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded(false);
            }}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Read less
            <ChevronUp className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
