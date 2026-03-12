"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wrench, Layers, Gauge, Lightbulb, ChevronRight } from "lucide-react";

const resources = [
  {
    title: "Tooling Recommendations",
    href: "/contact",
    icon: Wrench,
    description: "Expert guidance for your setup",
  },
  {
    title: "Applications",
    href: "/contact",
    icon: Layers,
    description: "Material and use case guides",
  },
  {
    title: "Feeds / Speeds",
    href: "/contact",
    icon: Gauge,
    description: "Optimal cutting parameters",
  },
  {
    title: "Tips / Tricks",
    href: "/contact", // kept for consistency, but click is handled in-component (no navigation)
    icon: Lightbulb,
    description: "Best practices and tricks",
  },
];

export function ResourceLinks() {
  const [showTipsAnswer, setShowTipsAnswer] = useState(false);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {resources.map((item, i) => {
        const isTips = item.title === "Tips / Tricks";

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col gap-2"
          >
            {isTips ? (
              <button
                type="button"
                onClick={() => setShowTipsAnswer((prev) => !prev)}
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
                    <p className="text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-slate-400 transition-all ${
                    showTipsAnswer
                      ? "rotate-90 text-[var(--primary-color)]"
                      : "group-hover:text-[var(--primary-color)] group-hover:translate-x-0.5"
                  }`}
                />
              </button>
            ) : (
              <Link
                href={item.href}
                className="group flex items-center justify-between p-5 rounded-xl border border-slate-200 bg-white hover:border-[var(--primary-color)]/30 hover:shadow-md hover:shadow-[var(--primary-color)]/5 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--secondary-color)]/10 flex items-center justify-center group-hover:bg-[var(--primary-color)]/10 transition-colors">
                    <item.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-[var(--primary-color)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[var(--primary-color)] group-hover:translate-x-0.5 transition-all" />
              </Link>
            )}

            {isTips && showTipsAnswer && (
              <div className="rounded-lg border border-dashed border-[var(--primary-color)]/40 bg-white/70 px-4 py-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900 mb-1">
                  Quick CNC tips from CNC KRAL:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Choose bits for both{" "}
                    <span className="font-medium">material</span> and{" "}
                    <span className="font-medium">operation</span> (upcut,
                    downcut, compression, single-flute, etc.).
                  </li>
                  <li>
                    If you see burning or dust instead of chips,{" "}
                    <span className="font-medium">
                      increase feed or reduce RPM
                    </span>
                    .
                  </li>
                  <li>
                    Keep collets clean and replace worn ones – bad collets cause
                    runout, vibration and broken tools even with new bits.
                  </li>
                </ul>
              </div>
            )}
          </motion.div>
        );
      })}
    </section>
  );
}
