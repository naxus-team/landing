"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n-context";

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useI18n();

  return (
    <section id="about" ref={ref} className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6 md:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              {t.about.label}
            </p>
            <h2 className="text-4xl font-extrabold tracking-tighter text-foreground mb-8">
              {t.about.title}
            </h2>

            <div className="flex flex-col gap-4 text-sm text-muted-foreground leading-relaxed mb-8">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button className="rounded-full" asChild>
                <a href="#contact" className="flex items-center gap-2">
                  {t.about.cta_primary}
                  <ArrowUpRight size={13} />
                </a>
              </Button>
              <Button variant="ghost" className="rounded-full" asChild>
                <a href="#services">{t.about.cta_secondary}</a>
              </Button>
            </div>
          </motion.div>

          {/* Right — values */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            {t.about.values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: 16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="flex gap-4 p-4 rounded-2xl border bg-card hover:bg-muted/50 transition-colors duration-150"
              >
                <span className="text-xs font-mono text-muted-foreground mt-0.5 shrink-0">
                  0{i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{v.title}</p>
                  <p className="text-xs text-muted-foreground">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mt-16 rounded-2xl overflow-hidden border"
        >
          {t.about.stats.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 bg-background px-6 py-6 hover:bg-muted/50 transition-colors duration-150">
              <span className="text-2xl font-extrabold tracking-tighter text-foreground">
                {item.value}
              </span>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        <Separator className="mt-16" />
      </div>
    </section>
  );
}