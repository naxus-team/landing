"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Layers, Cpu, Globe, BarChart3, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n-context";

const ICONS = [Code2, Layers, Cpu, Globe, BarChart3, ShieldCheck];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useI18n();

  return (
    <section id="services" ref={ref} className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              {t.services.label}
            </p>
            <h2 className="text-4xl font-extrabold tracking-tighter text-foreground">
              {t.services.title}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            {t.services.sub}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.services.items.map((service, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group relative flex flex-col gap-4 p-5 rounded-2xl border bg-card hover:bg-muted/50 transition-colors duration-150"
              >
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Icon size={14} className="text-foreground" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {service.number}
                  </span>
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] rounded-full px-2 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-12"
        >
          <a
            href="#contact"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground tracking-widest uppercase underline hover:no-underline transition-colors duration-150"
          >
            {t.services.cta}
          </a>
        </motion.div>

        <Separator className="mt-16" />
      </div>
    </section>
  );
}