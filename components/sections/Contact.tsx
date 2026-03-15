"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Check, Mail, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n-context";
import {  } from "lucide-react";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useI18n();
  const [subject, setSubject] = useState("");
  const [sent, setSent] = useState(false);
  const { isRTL }           = useI18n();

  const INFO = [
    { icon: Mail,          label: t.contact.info.email,    value: "hello@naxus.dev",          href: "mailto:hello@naxus.dev"              },
    { icon: MapPin,        label: t.contact.info.location, value: "Dubai, UAE",                href: "https://maps.google.com/?q=Dubai"    },
    { icon: MessageSquare, label: t.contact.info.linkedin, value: "Naxus",                     href: "https://linkedin.com/company/naxus"  },
  ];

  return (
    <section id="contact" ref={ref} className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
            {t.contact.label}
          </p>
          <h2 className="text-4xl font-extrabold tracking-tighter text-foreground">
            {t.contact.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.contact.sub}
            </p>

            <div className="flex flex-col gap-2">
              {INFO.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors duration-150"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                        {item.label}
                      </p>
                      <p className="text-sm text-foreground truncate">{item.value}</p>
                    </div>
                    <ArrowUpRight size={12} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -16 : 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3"
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 text-center h-full py-16"
              >
                <div className="w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center text-lg">
                  <Check size={16} className="text-foreground" />
                </div>
                <h3 className="font-bold text-foreground">{t.contact.success.title}</h3>
                <p className="text-sm text-muted-foreground">{t.contact.success.sub}</p>
                <Button variant="ghost" size="sm" className="rounded-full border border-foreground/10" onClick={() => setSent(false)}>
                  {t.contact.success.again}
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      {t.contact.form.name}
                    </label>
                    <input
                      type="text" required
                      placeholder={t.contact.form.namePlaceholder}
                      className="h-10 px-3 rounded-xl border bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      {t.contact.form.email}
                    </label>
                    <input
                      type="email" required
                      placeholder={t.contact.form.emailPlaceholder}
                      className="h-10 px-3 rounded-xl border bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    {t.contact.form.subject}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {t.contact.form.subjects.map((s) => (
                      <button
                        type="button" key={s}
                        onClick={() => setSubject(s)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                          subject === s
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    {t.contact.form.message}
                  </label>
                  <textarea
                    required rows={5}
                    placeholder={t.contact.form.messagePlaceholder}
                    className="px-3 py-2.5 rounded-xl border bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors resize-none"
                  />
                </div>

                <Button type="submit" className="rounded-full w-full gap-2">
                  {t.contact.form.submit}
                  <ArrowUpRight size={13} />
                </Button>
              </form>
            )}
          </motion.div>
        </div>

        <Separator className="mt-16" />
      </div>
    </section>
  );
}