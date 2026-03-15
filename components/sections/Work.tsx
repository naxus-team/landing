"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-context";

const PROJECTS = [
  { id: "01", title: "FinTrack Platform",    category: "Product Development",    tags: ["Next.js", "PostgreSQL"],  year: "2024", status: "Live"      },
  { id: "02", title: "LegalAI Assistant",    category: "AI Integration",         tags: ["LLMs", "FastAPI"],        year: "2024", status: "Live"      },
  { id: "03", title: "PropTech OS",          category: "System Architecture",    tags: ["React", "AWS"],           year: "2023", status: "Completed" },
  { id: "04", title: "eComm Accelerator",    category: "Growth Engineering",     tags: ["Next.js", "Edge"],        year: "2024", status: "Live"      },
  { id: "05", title: "MedConnect",           category: "Digital Transformation", tags: ["React Native", "WebRTC"], year: "2023", status: "Completed" },
];

export default function Work() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useI18n();
  const [active, setActive] = useState("All");

  const filters = t.work.filters;
  const filtered = active === filters[0]
    ? PROJECTS
    : PROJECTS.filter((p) => {
        const idx = t.work.filters.indexOf(active);
        const enFilters = ["All","Product Development","AI Integration","System Architecture","Growth Engineering","Digital Transformation"];
        return p.category === enFilters[idx];
      });

  const statusColor = (s: string) => {
    if (s === "Live")        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    if (s === "In Progress") return "bg-yellow-500/10 text-yellow-600";
    return "bg-muted text-muted-foreground";
  };

  const statusLabel = (s: string) => {
    if (s === "Live")        return t.work.status.live;
    if (s === "In Progress") return t.work.status.inProgress;
    return t.work.status.completed;
  };

  return (
    <section id="work" ref={ref} className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              {t.work.label}
            </p>
            <h2 className="text-4xl font-extrabold tracking-tighter text-foreground">
              {t.work.title}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">{t.work.sub}</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
        >
          {filters.map((f) => (
            <Button
              key={f}
              variant={active === f ? "default" : "outline"}
              size="sm"
              className="rounded-full text-xs h-7"
              onClick={() => setActive(f)}
            >
              {f}
            </Button>
          ))}
        </motion.div>

        {/* List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="group flex items-center gap-4 py-4 border-b last:border-b-0 hover:bg-muted/40 px-3 transition-colors duration-150 cursor-default"
              >
                <span className="text-xs font-mono text-muted-foreground w-6 shrink-0">
                  {project.id}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      {project.title}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${statusColor(project.status)}`}>
                      {project.status === "Live" && (
                        <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 me-1 animate-pulse" />
                      )}
                      {statusLabel(project.status)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] rounded-full px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <span className="text-xs font-mono text-muted-foreground shrink-0">
                  {project.year}
                </span>

                <div className="w-7 h-7 rounded-full border flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-150 shrink-0">
                  <ArrowUpRight size={12} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-xs font-mono text-muted-foreground">
            {t.work.showing} {filtered.length} {t.work.of} {PROJECTS.length} {t.work.projects}
          </span>
          <a
            href="#contact"
            className="text-xs font-mono text-muted-foreground hover:text-foreground tracking-widest uppercase transition-colors duration-150 flex items-center gap-1"
          >
            {t.work.cta}
            <ArrowUpRight size={11} />
          </a>
        </div>

        <Separator className="mt-16" />
      </div>
    </section>
  );
}