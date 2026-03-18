"use client";

import { useEffect, useState } from "react";
import { type getLocale , useI18n } from "@/lib/i18n-context";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Languages, RotateCcw, Sparkles } from "lucide-react";

type Language = {
    locale: getLocale;
    native: string;
    label: string;
    flag: string;
    continent: string;
};

const LANGUAGES: Language[] = [
    { locale: "en", native: "English", label: "English", flag: "🇬🇧", continent: "Global" },
    { locale: "ar", native: "العربية", label: "Arabic", flag: "🇦🇪", continent: "Middle East" },
    { locale: "de", native: "Deutsch", label: "German", flag: "🇩🇪", continent: "Europe" },
    { locale: "fr", native: "Français", label: "French", flag: "🇫🇷", continent: "Europe" },
    { locale: "es", native: "Español", label: "Spanish", flag: "🇪🇸", continent: "Europe" },
    { locale: "it", native: "Italiano", label: "Italian", flag: "🇮🇹", continent: "Europe" },
];

const CONTINENT_ORDER = ["Global", "Middle East", "Europe"];

export default function LangDialog() {
    const { locale, setLocale, isRTL } = useI18n();
    const [open, setOpen] = useState(false);
    const [source, setSource] = useState<"auto" | "manual">("auto");

    useEffect(() => {
        const s = localStorage.getItem("naxus-locale-source");
        setSource(s === "manual" ? "manual" : "auto");
    }, [locale]);

    const handleSelect = (l: getLocale) => {
        setLocale(l);
        setSource("manual");
        setOpen(false);
    };

    const handleReset = () => {
        localStorage.removeItem("naxus-locale-source");
        localStorage.removeItem("naxus-locale");
        window.location.reload();
    };

    const grouped = CONTINENT_ORDER.map((continent) => ({
        continent,
        langs: LANGUAGES.filter((l) => l.continent === continent),
    }));

    const currentLang = LANGUAGES.find((l) => l.locale === locale);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-8 h-8 p-0 gap-1.5"
                    aria-label="Language"
                >
                    <Languages size={14} />
                </Button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-sm p-0 gap-0 overflow-hidden"
                showCloseButton={true}
            >
                {/* Header */}
                <DialogHeader className="px-5 pt-5 pb-4 border-b">
                    <div className="flex items-start justify-between gap-2 pe-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-muted border flex items-center justify-center shrink-0 text-base">
                                {currentLang?.flag}
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-semibold leading-none mb-1">
                                    Language
                                </DialogTitle>
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full inline-block ${source === "auto" ? "bg-emerald-500" : "bg-blue-500"
                                            }`}
                                    />
                                    <p className="text-[10px] font-mono text-muted-foreground">
                                        {source === "auto" ? "Auto-detected" : "Manually selected"}
                                    </p>
                                    {source === "manual" && (
                                        <button
                                            onClick={handleReset}
                                            className="flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <RotateCcw size={9} />
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* Language groups */}
                <div className="overflow-y-auto max-h-[65vh] px-3 py-3 flex flex-col gap-3">
                    {grouped.map(({ continent, langs }) => (
                        <div key={continent}>
                            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 mb-2">
                                {continent}
                            </p>
                            <div className="grid grid-cols-2 gap-1.5">
                                {langs.map((lang) => {
                                    const isActive = locale === lang.locale;
                                    return (
                                        <button
                                            key={lang.locale}
                                            onClick={() => handleSelect(lang.locale)}
                                            className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150 text-start ${isActive
                                                ? "bg-foreground border-foreground"
                                                : "bg-background border-border hover:bg-muted hover:border-muted-foreground/30"
                                                }`}
                                        >
                                            <span className={`text-base leading-none shrink-0 ${isActive ? "text-background/60" : "text-muted-foreground"}`}>
                                                {lang.flag}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-semibold leading-tight truncate ${isActive ? "text-background" : "text-foreground"
                                                    }`}>
                                                    {lang.native}
                                                </p>
                                                <p className={`text-[10px] leading-tight truncate ${isActive ? "text-background/60" : "text-muted-foreground"
                                                    }`}>
                                                    {lang.label}
                                                </p>
                                            </div>
                                            {isActive && (
                                                <Check
                                                    size={11}
                                                    className={`shrink-0 absolute top-2 ${isRTL ? "left-2" : "right-2"} text-background`}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                        {LANGUAGES.length} languages available
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}