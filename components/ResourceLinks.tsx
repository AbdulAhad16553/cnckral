"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wrench,
  Layers,
  Gauge,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

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
    href: "/contact",
    icon: Lightbulb,
    description: "Best practices and tricks",
  },
];

export function ResourceLinks() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {resources.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
        >
          <Link
            href={item.href}
            className="group flex items-center justify-between p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <item.icon className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-[#21B9FF] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#21B9FF] group-hover:translate-x-0.5 transition-all" />
          </Link>
        </motion.div>
      ))}
    </section>
  );
}
