"use client";

import { useI18n } from "@/lib/i18n-context";

export default function Branding() {
    const { t } = useI18n();
    return (
        <div className="relative z-10 space-y-4">
            <div>
                <h2 className="text-4xl font-extrabold tracking-tighter text-foreground leading-none mb-3">
                    {t.hero.line1}
                </h2>
                <h2 className="text-4xl font-extrabold tracking-tighter text-muted-foreground leading-none">
                    {t.hero.line2}
                </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {t.hero.description}
            </p>
        </div>
    );
}