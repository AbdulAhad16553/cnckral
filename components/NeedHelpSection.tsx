"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function NeedHelpSection() {
  return (
    <motion.section
      className="bg-brand-tint rounded-2xl border border-[var(--secondary-color)]/20 p-8 md:p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Need help?</h2>
        <p className="text-slate-600 mb-6">Feel free to reach out at any time.</p>
        <Link href="/contact">
          <Button
            size="lg"
            className="px-8 py-6 text-base font-semibold text-white gradient-blue-grey-combined hover:opacity-95 transition-opacity shadow-lg shadow-[#0368E5]/20"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact Us
          </Button>
        </Link>
      </div>
    </motion.section>
  );
}
