"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  amount?: number;
  once?: boolean;
  stagger?: boolean;
}

const fadeInVariants: Variants = {
  hidden: (direction: string) => {
    const offsets = { up: 40, down: -40, left: 40, right: -40 };
    return {
      opacity: 0,
      y: direction === "up" || direction === "down" ? offsets[direction as "up" | "down"] : 0,
      x: direction === "left" || direction === "right" ? offsets[direction as "left" | "right"] : 0,
    };
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
  },
};

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  amount = 0.2,
  once = true,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={fadeInVariants}
      custom={direction}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
