"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/common/ThemeToggle";
import LangDialog from "@/components/common/LangDialog";
import { useI18n } from "@/lib/i18n-context";
import { useAuth } from "@/hooks/useAuth";
import { useProgressRouter } from "@/hooks/useProgressRouter";
import Logo from "@/components/common/Logo";

export default function Navbar() {
    const { t } = useI18n();
    const { user, loading } = useAuth();
    const router = useProgressRouter();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 5);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("#navbar-pill") && !target.closest("#mobile-menu")) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    const NAV_LINKS = [
        { label: t.nav.services, href: "#services" },
        { label: t.nav.work, href: "#work" },
        { label: t.nav.about, href: "#about" },
        { label: t.nav.team, href: "#team" },
        { label: t.nav.contact, href: "#contact" },
    ];

    return (
        <>
            {/* Scroll gradient */}
            <div
                className="fixed top-0 left-0 right-0 h-24 z-40 pointer-events-none transition-opacity duration-300"
                style={{
                    opacity: scrolled ? 1 : 0,
                    background: "linear-gradient(to bottom, var(--background) 0%, transparent 100%)",
                }}
            />

            {/* Navbar pill */}
            <motion.header
                id="navbar-pill"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] transition-all duration-150 ${scrolled ? "max-w-5xl" : "max-w-6xl"
                    }`}
            >
                <div className={`flex items-center justify-between px-4 h-12 rounded-full border bg-background/95 backdrop-blur-md transition-shadow duration-300 ${scrolled ? "shadow-sm" : ""
                    }`}>

                    {/* Logo */}
                    <a href="#" className="flex items-center">
                        <Logo />
                    </a>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1 flex-1 px-4">
                        {NAV_LINKS.map((item) => (
                            <Button
                                key={item.href}
                                variant="ghost"
                                size="sm"
                                className="rounded-full text-xs"
                                asChild
                            >
                                <a href={item.href}>{item.label}</a>
                            </Button>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-1.5">
                        <LangDialog />

                        {/* Dashboard button */}
                        {!loading && !user && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-1.5"
                            >
                                <Button
                                    size="sm"
                                    className="rounded-full h-8 text-xs hidden sm:flex"
                                    onClick={() => router.push("/login")}
                                >
                                    {t.auth.login}
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full h-8 text-xs gap-1.5"
                                    onClick={() => router.push("/register")}
                                >
                                    {t.auth.getStarted}
                                </Button>
                            </motion.div>
                        )}

                        {!loading && user && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-full gap-1.5 h-8 text-xs hidden sm:flex"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    {t.nav.dashboard}
                                </Button>

                                <Button
                                    size="icon"
                                    className="rounded-full w-8 h-8 sm:hidden"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    <LayoutDashboard size={13} />
                                </Button>
                            </motion.div>
                        )}

                        {/* Hamburger — mobile only */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden w-8 h-8 rounded-full"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={menuOpen ? "x" : "menu"}
                                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {menuOpen ? <X size={15} /> : <Menu size={15} />}
                                </motion.div>
                            </AnimatePresence>
                        </Button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        id="mobile-menu"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="fixed top-[4.5rem] left-4 right-4 z-50 rounded-2xl border bg-background/98 backdrop-blur-md shadow-lg overflow-hidden md:hidden"
                    >
                        <div className="flex flex-col p-2 gap-0.5">
                            {NAV_LINKS.map((item, i) => (
                                <motion.a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors duration-150"
                                >
                                    {item.label}
                                </motion.a>
                            ))}

                            {/* Dashboard link في الـ mobile menu */}
                            {!loading && user && (
                                <motion.button
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: NAV_LINKS.length * 0.04 }}
                                    onClick={() => { setMenuOpen(false); router.push("/dashboard"); }}
                                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground bg-muted/60 rounded-xl transition-colors duration-150 mt-1 border border-border/50"
                                >
                                    <LayoutDashboard size={14} />
                                    {t.nav.dashboard}
                                </motion.button>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
}