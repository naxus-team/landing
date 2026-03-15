"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/common/ThemeToggle";
import LangDialog from "@/components/common/LangDialog";
import { useI18n } from "@/lib/i18n-context";
import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Facebook, Github, Globe, Instagram, Linkedin, Twitter } from "lucide-react";
import { type brandSocial } from "@/types";

const BRAND: brandSocial = {
    social: {
        facebook: "#",
        instagram: "#",
        twitter: "#",
        linkedin: "https://www.linkedin.com/company/naxus",
        github: "https://github.com/naxus-team",
    },
};

const SOCIAL_ICONS = {
    linkedin: { icon: Linkedin, label: "LinkedIn" },
    github: { icon: Github, label: "GitHub" },
    twitter: { icon: Twitter, label: "Twitter" },
    instagram: { icon: Instagram, label: "Instagram" },
    facebook: { icon: Facebook, label: "Facebook" },
    website: { icon: Globe, label: "Website" },
} as const;

const SocialButton = memo(({ href, icon: Icon, label }: {
    href: string;
    icon: React.ElementType;
    label: string;
}) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 rounded-full text-muted-foreground hover:text-foreground"
        >
            <Icon size={12} />
        </Button>
    </a>
));
SocialButton.displayName = "SocialButton";

const FooterLink = memo(({ href, label, dimmed, onEnter, onLeave }: {
    href: string;
    label: string;
    dimmed: boolean;
    onEnter: () => void;
    onLeave: () => void;
}) => (
    <a
        href={href}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="text-xs font-semibold w-fit transition-all duration-150"
        style={{
            color: "var(--muted-foreground)",
            opacity: dimmed ? 0.4 : 1,
        }}
    >
        {label}
    </a>
));
FooterLink.displayName = "FooterLink";

export default function Footer() {
    const { t } = useI18n();

    const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const LINKS = useMemo(() => ({
        [t.footer.company]: [
            { label: t.footer.links.about, href: "#about" },
            { label: t.footer.links.services, href: "#services" },
            { label: t.footer.links.work, href: "#work" },
            { label: t.footer.links.contact, href: "#contact" },
        ],
        [t.footer.legal]: [
            { label: t.footer.links.privacy, href: "#privacy" },
            { label: t.footer.links.terms, href: "#terms" },
        ],
    }), [t]);

    const handleGroupEnter = useCallback((group: string) => setHoveredGroup(group), []);
    const handleGroupLeave = useCallback(() => {
        setHoveredGroup(null);
        setHoveredItem(null);
    }, []);
    const handleItemEnter = useCallback((label: string) => setHoveredItem(label), []);
    const handleItemLeave = useCallback(() => setHoveredItem(null), []);

    return (
        <footer className="bg-background">
            <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

                    {/* Brand */}
                    <div className="flex flex-col gap-3">
                        <Logo />
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                            {t.footer.tagline}
                        </p>
                        <div className="flex items-center gap-1 flex-wrap">
                            {Object.entries(BRAND.social).map(([key, url]) => {
                                const s = SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS];
                                if (!s || !url) return null;
                                return (
                                    <SocialButton
                                        key={key}
                                        href={url}
                                        icon={s.icon}
                                        label={s.label}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(LINKS).map(([group, items]) => (
                        <div
                            key={group}
                            className="flex flex-col gap-3"
                            onMouseEnter={() => handleGroupEnter(group)}
                            onMouseLeave={handleGroupLeave}
                        >
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                {group}
                            </span>
                            <div className="flex flex-col gap-2">
                                {items.map((item) => (
                                    <FooterLink
                                        key={item.label}
                                        href={item.label}
                                        label={item.label}
                                        dimmed={hoveredGroup === group && hoveredItem !== item.label}
                                        onEnter={() => handleItemEnter(item.label)}
                                        onLeave={handleItemLeave}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
                    <span className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Naxus. {t.footer.copyright}
                    </span>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <LangDialog />
                    </div>
                </div>
            </div>
        </footer>
    );
}