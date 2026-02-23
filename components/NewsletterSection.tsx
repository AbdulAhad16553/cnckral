"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    // Placeholder - replace with actual newsletter API
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
    setEmail("");
  };

  return (
    <motion.section
      className="gradient-blue-grey text-white rounded-2xl p-8 md:p-12 text-center shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">
          Subscribe to our newsletter to receive 20% off your first order
        </h2>
        <p className="text-slate-300 mb-6 text-sm">
          Get exclusive offers, product updates, and expert tips delivered to your inbox.
        </p>
        {status === "success" ? (
          <p className="text-emerald-400 font-medium">Thanks for subscribing! Check your email for the discount code.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={status === "loading"}
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 font-semibold shrink-0"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
        )}
      </div>
    </motion.section>
  );
}
