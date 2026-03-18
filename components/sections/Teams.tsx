"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n-context";
import { ROLE_LABELS, ROLE_STYLES, type TeamMember } from "@/types/index";
import { Github, Linkedin, Globe, Twitter } from "lucide-react";

const TEAM: TeamMember[] = [
    {
        id: "1",
        name: "Mohamed Reda",
        role: "ceo",
        avatar: "MA",
        image: "/mohamed_reda.jpg",
        bio: {
            en: "Founder & CEO — Vision, strategy, and growth.",
            ar: "المؤسس والرئيس التنفيذي — الرؤية والاستراتيجية والنمو.",
            de: "Gründer & CEO — Vision, Strategie und Wachstum.",
            fr: "Fondateur & PDG — Vision, stratégie et croissance.",
            es: "Fundador & CEO — Visión, estrategia y crecimiento.",
            it: "Fondatore & CEO — Visione, strategia e crescita.",
        },
        social: {
            linkedin: "https://www.linkedin.com/in/moreeda/",
            github: "https://github.com/moreeda",
        },
    },
    {
        id: "2",
        name: "Abdelrahman Khadr",
        role: "cto",
        avatar: "SK",
        image: "/abdelrahman_khadr.jpg",
        bio: {
            en: "Founder & CTO — Operations & project coordination.",
            ar: "المؤسس ومدير التقنية — العمليات وتنسيق المشاريع.",
            de: "Gründer & CTO — Betrieb und Projektkoordination.",
            fr: "Fondateur & CTO — Opérations et coordination de projets.",
            es: "Fundador & CTO — Operaciones y coordinación de proyectos.",
            it: "Fondatore & CTO — Operazioni e coordinamento progetti.",
        },
        social: {
            linkedin: "https://www.linkedin.com/in/abdelrahman-khadr/",
            github: "https://github.com/khdrx",
        },
    },
];

const SOCIAL_ICONS = {
    linkedin: { icon: Linkedin, label: "LinkedIn" },
    github: { icon: Github, label: "GitHub" },
    twitter: { icon: Twitter, label: "Twitter" },
    website: { icon: Globe, label: "Website" },
} as const;

export default function Team() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const { t, locale } = useI18n();

    return (
        <section id="team" ref={ref} className="py-24 bg-background">
            <div className="max-w-5xl mx-auto px-6 md:px-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
                        {t.team.label}
                    </p>
                    <h2 className="text-4xl font-extrabold tracking-tighter text-foreground">
                        {t.team.title}
                    </h2>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {TEAM.map((member, i) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="group flex flex-col rounded-2xl rounded-tl-3xl rounded-tr-3xl border hover:bg-muted/40 transition-colors duration-150 overflow-hidden"
                        >
                            {/* Avatar*/}
                            <div className="relative w-full aspect-square bg-muted flex items-center justify-center border-b">
                                {member.image ? (
                                    <img
                                        src={`/assets/teams/images/${member.image}`}
                                        alt={member.name}
                                        className="w-full h-full object-cover rounded-tl-3xl rounded-tr-3xl"
                                    />
                                ) : (
                                    <span className="text-4xl font-bold text-muted-foreground select-none">
                                        {member.avatar}
                                    </span>
                                )}

                                {/* Social overlay on hover */}
                                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {member.social && Object.entries(member.social).map(([key, url]) => {
                                        const s = SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS];
                                        if (!s || !url) return null;
                                        const Icon = s.icon;
                                        return (
                                            <a
                                                key={key}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={s.label}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="w-9 h-9 rounded-full"
                                                >
                                                    <Icon size={14} />
                                                </Button>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-2 p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-md font-semibold text-foreground leading-tight">
                                        {member.name}
                                    </span>
                                </div>

                                <Badge
                                    className={`text-[10px] px-2 py-0 rounded-full shrink-0 ${ROLE_STYLES[member.role]}`}
                                >
                                    {ROLE_LABELS[member.role][locale] ?? ROLE_LABELS[member.role].en}
                                </Badge>

                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {member.bio[locale]}
                                </p>

                                {/* Social buttons */}
                                {member.social && (
                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                        {Object.entries(member.social).map(([key, url]) => {
                                            const s = SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS];
                                            if (!s || !url) return null;
                                            const Icon = s.icon;
                                            return (
                                                <a
                                                    key={key}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={s.label}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-7 h-7 rounded-full text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Icon size={12} />
                                                    </Button>
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <Separator className="mt-16" />
            </div>
        </section>
    );
}