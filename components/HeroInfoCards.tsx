"use client";

import React, { useState } from "react";
import { Wrench, ChevronRight } from "lucide-react";

type InfoCard = {
  title: string;
  description: string;
  content?: {
    heading: string;
    body: string;
  }[];
};

interface HeroInfoCardsProps {
  cards: InfoCard[];
}

export function HeroInfoCards({ cards }: HeroInfoCardsProps) {
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  return (
    <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {cards.map((card) => {
        const isOpen = openTitle === card.title;

        return (
          <button
            key={card.title}
            type="button"
            onClick={() =>
              setOpenTitle((prev) => (prev === card.title ? null : card.title))
            }
            className="group text-left flex flex-col gap-3 p-6 rounded-xl border border-slate-200 bg-white hover:border-[var(--primary-color)]/30 hover:shadow-md hover:shadow-[var(--primary-color)]/5 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <Wrench className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-[var(--primary-color)] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-500">{card.description}</p>
                  </div>
                  <ChevronRight
                    className={`mt-1 w-5 h-5 text-slate-400 transition-all ${
                      isOpen
                        ? "rotate-90 text-[var(--primary-color)]"
                        : "group-hover:text-[var(--primary-color)] group-hover:translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            </div>

            {isOpen && card.content && (
              <div className="mt-1 space-y-2 text-sm text-slate-600">
                {card.content.map((section) => (
                  <div key={section.heading}>
                    <p className="font-semibold text-slate-800">
                      {section.heading}
                    </p>
                    <p className="text-slate-600">{section.body}</p>
                  </div>
                ))}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

