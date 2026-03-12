"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Layers, Gauge, Lightbulb, ChevronRight } from "lucide-react";

const resources = [
  {
    title: "Tooling Recommendations",
    icon: Wrench,
    description: "Expert guidance for your setup",
    answerPoints: [
      "Match tool to material and operation: wood, plastics, metals, and stone each need the right geometry and coating.",
      "Use high‑quality collets and holders – poor holding is one of the main causes of bad finish and broken tools.",
      "Build a small ‘core kit’ for your most common jobs, then add specialty tools only when a use‑case really needs them.",
    ],
  },
  {
    title: "Applications",
    icon: Layers,
    description: "Material and use case guides",
    answerPoints: [
      "For MDF and plywood, use compression or downcut tools for clean edges and good chip evacuation.",
      "For acrylic and plastics, use single‑ or double‑flute tools, sharp edges, and higher feed to avoid melting.",
      "For marble and stone, use the correct bonded or diamond tools and keep coolant / dust extraction in mind.",
    ],
  },
  {
    title: "Feeds / Speeds",
    icon: Gauge,
    description: "Optimal cutting parameters",
    answerPoints: [
      "Start from recommended chipload tables for your tool diameter and material, then fine‑tune by sound and chip shape.",
      "If you see burning or dust, increase feed or lower RPM so the tool takes a real chip instead of rubbing.",
      "Keep depth per pass reasonable – too deep a cut overloads the tool even if RPM and feed look correct.",
    ],
  },
  {
    title: "Tips / Tricks",
    icon: Lightbulb,
    description: "Best practices and tricks",
    answerPoints: [
      "Keep collets and tapers spotless; a dirty collet can ruin accuracy even with a new machine and tool.",
      "Use consistent workholding: vacuum or clamps that do not move, to prevent chatter and broken bits.",
      "Log your successful recipes (material, tool, RPM, feed, depth) – this becomes your own CNC ‘playbook’.",
    ],
  },
];

export function ResourceLinks() {
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {resources.map((item, i) => {
        const isOpen = openTitle === item.title;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col gap-2"
          >
            <button
              type="button"
              onClick={() =>
                setOpenTitle((prev) => (prev === item.title ? null : item.title))
              }
              className="group flex items-center justify-between p-5 rounded-xl border border-slate-200 bg-white hover:border-[var(--primary-color)]/30 hover:shadow-md hover:shadow-[var(--primary-color)]/5 transition-all duration-200 text-left w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--secondary-color)]/10 flex items-center justify-center group-hover:bg-[var(--primary-color)]/10 transition-colors">
                  <item.icon className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-[var(--primary-color)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-slate-400 transition-all ${
                  isOpen
                    ? "rotate-90 text-[var(--primary-color)]"
                    : "group-hover:text-[var(--primary-color)] group-hover:translate-x-0.5"
                }`}
              />
            </button>

            {isOpen && item.answerPoints && (
              <div className="rounded-lg border border-dashed border-[var(--primary-color)]/40 bg-white/70 px-4 py-3 text-sm text-slate-700">
                <ul className="list-disc list-inside space-y-1">
                  {item.answerPoints.map((point: string, idx: number) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        );
      })}
    </section>
  );
}
