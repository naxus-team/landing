"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n-context";

const COLS = 10;
const ROWS = 8;
const GRID_SQUARES = Array.from({ length: COLS * ROWS }, (_, i) => i);
const V_LINES = [0.15, 0.35, 0.55, 0.75, 0.9];
const H_LINES = [0.2, 0.4, 0.6, 0.8];

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex flex-col bg-background overflow-hidden">

      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* Grid squares */}
        <div
          className="absolute inset-0"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {GRID_SQUARES.map((i) => (
            <motion.div
              key={i}
              className="border border-foreground/[0.04]"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 4 + (i % 5) * 0.8,
                repeat: Infinity,
                delay: (i % 11) * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Edge fades */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />

        {/* Vertical lines */}
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
              repeat: Infinity,
              delay: i * 0.9,
              ease: "easeInOut",
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
              repeat: Infinity,
              delay: i * 1.1 + 0.7,
              ease: "easeInOut",
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

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 max-w-5xl mx-auto w-full gap-8 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[clamp(4rem,8vw,6rem)] font-semibold leading-none text-foreground">
            {t.hero.line1}
          </h1>
          <h1 className="text-[clamp(4rem,8vw,6rem)] font-semibold text-muted-foreground">
            {t.hero.line2}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col md:flex-row md:items-end justify-between mt-20 gap-6"
        >
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            {t.hero.description}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button className="rounded-full" asChild>
              <a href="#services" className="gap-2 flex items-center">
                {t.hero.cta_primary}
                <ArrowUpRight size={14} />
              </a>
            </Button>
            <Button
              className="rounded-full gap-2 bg-foreground hover:bg-foreground/90 text-background border-0"
              asChild
            >
              <a href="#contact" className="flex items-center px-6 gap-2">
                {t.hero.cta_start}
              </a>
            </Button>
          </div>
        </motion.div>

        {/* <Separator /> */}

        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-2xl font-extrabold tracking-tighter text-foreground">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div> */}
      </div>
    </section>
  );
}