"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n-context";
import GridSquares from "../common/GridSquares";

const COLS = 10;
const ROWS = 8;
const GRID_SQUARES = Array.from({ length: COLS * ROWS }, (_, i) => i);
const V_LINES = [0.15, 0.35, 0.55, 0.75, 0.9];
const H_LINES = [0.2, 0.4, 0.6, 0.8];

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex flex-col bg-background overflow-hidden">

      <GridSquares />

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
              <a href="/register" className="flex items-center px-6 gap-2">
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