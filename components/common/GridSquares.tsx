"use client";

import { motion } from "framer-motion";

const V_LINES = [0.15, 0.35, 0.55, 0.75, 0.9];
const H_LINES = [0.2, 0.4, 0.6, 0.8];

export default function GridSquares() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

      {/* Grid — CSS only, zero JS */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right,  color-mix(in srgb, var(--foreground) 8%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--foreground) 8%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "10% 12.5%",
        }}
      />

      {/* Edge fades */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />

      {/* Vertical lines — motion فقط على عدد قليل */}
      {V_LINES.map((pos, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${pos * 100}%`,
            background: "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--foreground) 18%, transparent) 40%, color-mix(in srgb, var(--foreground) 18%, transparent) 60%, transparent 100%)",
          }}
          animate={{ opacity: [0, 1, 0], scaleY: [0.3, 1, 0.3] }}
          transition={{
            duration: 5 + i * 1.2,
            repeat:   Infinity,
            delay:    i * 0.9,
            ease:     "easeInOut",
          }}
        />
      ))}

      {/* Horizontal lines */}
      {H_LINES.map((pos, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px"
          style={{
            top: `${pos * 100}%`,
            background: "linear-gradient(to right, transparent 0%, color-mix(in srgb, var(--foreground) 15%, transparent) 30%, color-mix(in srgb, var(--foreground) 15%, transparent) 70%, transparent 100%)",
          }}
          animate={{ opacity: [0, 1, 0], scaleX: [0.2, 1, 0.2] }}
          transition={{
            duration: 6 + i * 1.3,
            repeat:   Infinity,
            delay:    i * 1.1 + 0.7,
            ease:     "easeInOut",
          }}
        />
      ))}

      {/* Center radial fade */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 55% at 50% 45%, transparent 35%, var(--background) 100%)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}